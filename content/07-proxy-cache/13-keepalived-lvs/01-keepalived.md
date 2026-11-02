---
title: Keepalived
description: Keepalived — haute disponibilité IP sous Linux avec VRRP (v2/v3) et contrôles de santé : installation (Debian/Ubuntu, RHEL, Alpine, SUSE), keepalived.conf (global_defs, vrrp_script, vrrp_instance, virtual_router_id, priorité, préemption, unicast_peer, track_interface, track_script, vrrp_sync_group, notify), IP virtuelles IPv4/IPv6, paires actives/passives et actives/actives, pare-feu (protocole 112), ip_nonlocal_bind, test de configuration, diagnostic (tcpdump vrrp, signaux USR1/USR2) et pièges (split-brain, multicast en cloud).
tags: [keepalived, vrrp, haute disponibilité, ip virtuelle, linux, failover]
icon: info
---

**Keepalived** (GPL) fait « flotter » une ou plusieurs **adresses IP virtuelles** (VIP) entre plusieurs serveurs Linux grâce au protocole **VRRP** : le nœud **MASTER** porte la VIP, les **BACKUP** la reprennent en une à trois secondes s'il tombe ou si son service local échoue. C'est le complément classique de [[01-haproxy/06-haute-disponibilite-runtime|HAProxy]], NGINX, des résolveurs DNS ou d'un pare-feu Linux ; il pilote aussi [[02-lvs-ipvs|LVS]].

## Installation

```bash
sudo apt install keepalived          # Debian/Ubuntu
sudo dnf install keepalived          # RHEL/Rocky/Alma, Fedora
sudo apk add keepalived              # Alpine
sudo zypper install keepalived       # SUSE
keepalived --version
```

## Paire active/passive (nœud 1)

```text
# /etc/keepalived/keepalived.conf — lb01 (le nœud 2 a priority 100)
global_defs {
    router_id lb01
    enable_script_security
    script_user keepalived_script
}

vrrp_script chk_service {
    script "/usr/bin/systemctl is-active --quiet haproxy"
    interval 2
    fall 2
    rise 2
    weight -60            # la priorité baisse de 60 si le service tombe → bascule
}

vrrp_instance VI_WEB {
    state BACKUP          # les deux nœuds en BACKUP : l'élection se fait sur la priorité
    interface eth0
    virtual_router_id 51  # identique sur les deux nœuds, unique sur le segment
    priority 150
    advert_int 1
    nopreempt             # ne pas reprendre la VIP au retour (évite un double basculement)
    unicast_src_ip 10.0.20.11
    unicast_peer {
        10.0.20.12
    }
    virtual_ipaddress {
        10.0.20.100/24 dev eth0 label eth0:vip
    }
    track_script {
        chk_service
    }
    notify "/etc/keepalived/notification.sh"
}
```

```bash
sudo useradd -r -s /usr/sbin/nologin keepalived_script
echo 'net.ipv4.ip_nonlocal_bind = 1' | sudo tee /etc/sysctl.d/90-vip.conf && sudo sysctl --system   # services liés à la VIP sur le BACKUP
sudo keepalived -t -f /etc/keepalived/keepalived.conf    # tester la configuration
sudo systemctl enable --now keepalived
```

Le script `notify` reçoit `INSTANCE|GROUP`, le nom et le nouvel état (`MASTER`, `BACKUP`, `FAULT`) : envoyer une alerte, démarrer un service.

## Notions avancées

| Fonction | Usage |
| --- | --- |
| **Plusieurs instances** | Actif/actif : VIP 1 MASTER sur lb01, VIP 2 MASTER sur lb02 (DNS à deux adresses) |
| `vrrp_sync_group` | Faire basculer ensemble les VIP LAN et WAN d'un routeur ou pare-feu |
| `track_interface` | Passer en FAULT si un lien tombe |
| `unicast_peer` | Indispensable en **cloud** et quand le multicast VRRP est filtré |
| `vrrp_version 3` | VRRPv3 (IPv4 et IPv6) ; l'authentification `auth_pass` n'existe qu'en v2 et ne protège pas réellement |
| `virtual_ipaddress_excluded` | Adresses supplémentaires non annoncées dans les paquets VRRP (IPv6, nombreuses VIP) |

> [!WARNING]
> **Split-brain** : si les nœuds ne se voient plus (VRRP filtré, lien de synchronisation coupé), les deux deviennent MASTER et l'IP est en conflit. Autorisez le protocole **112** entre les nœuds, surveillez l'état sur chaque nœud, et utilisez un `virtual_router_id` unique par segment.

```bash
sudo firewall-cmd --permanent --add-rich-rule='rule protocol value="vrrp" accept' && sudo firewall-cmd --reload
sudo nft add rule inet filter input ip protocol vrrp accept
```

Suite : [[02-lvs-ipvs|LVS/IPVS]] · [[03-pen-balance|Pen et Balance]] · [[90-aide-memoire|aide-mémoire]].
