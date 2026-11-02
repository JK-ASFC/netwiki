---
title: LVS et IPVS
description: Linux Virtual Server — répartition de charge L4 dans le noyau (IPVS) : modes NAT, DR (Direct Routing) et TUN, algorithmes (rr, wrr, lc, wlc, sh, mh), persistance, ipvsadm (création de services virtuels et serveurs réels, statistiques, sauvegarde), configuration des serveurs réels en DR (VIP sur lo, arp_ignore, arp_announce), pilotage par Keepalived (virtual_server, real_server, HTTP_GET, TCP_CHECK) et usage dans kube-proxy mode IPVS.
tags: [lvs, ipvs, ipvsadm, répartition de charge, l4, direct routing, keepalived]
icon: info
---

**LVS** (*Linux Virtual Server*) répartit les connexions TCP/UDP **dans le noyau** (module **IPVS**) : très performant (plusieurs millions de connexions), sans lecture du contenu HTTP. On l'emploie devant des fermes de serveurs, de proxys [[01-haproxy/01-presentation|HAProxy]] ou de résolveurs DNS ; `kube-proxy` en mode IPVS l'utilise aussi.

| Mode | Fonctionnement | Contraintes |
| --- | --- | --- |
| **NAT** (`-m`) | Le directeur traduit l'adresse ; aller et retour passent par lui | Les serveurs réels utilisent le directeur comme passerelle |
| **DR** (`-g`) | Le directeur réécrit seulement l'adresse MAC ; les réponses vont **directement** au client | Même segment L2 ; VIP sur `lo` des serveurs réels, ARP désactivé pour elle |
| **TUN** (`-i`) | Encapsulation IP-in-IP vers les serveurs réels | Serveurs réels capables de décapsuler |

## Installation et service virtuel

```bash
sudo apt install ipvsadm            # RHEL : dnf install ipvsadm
sudo modprobe ip_vs
sudo ipvsadm -A -t 10.0.20.100:80 -s wlc                       # service virtuel, moindres connexions pondérées
sudo ipvsadm -a -t 10.0.20.100:80 -r 10.0.20.21:80 -g -w 1     # serveur réel en DR
sudo ipvsadm -a -t 10.0.20.100:80 -r 10.0.20.22:80 -g -w 2
sudo ipvsadm -Ln --stats
```

## Serveurs réels en mode DR

```bash
sudo ip addr add 10.0.20.100/32 dev lo
cat <<'EOF2' | sudo tee /etc/sysctl.d/90-lvs-dr.conf
net.ipv4.conf.all.arp_ignore = 1
net.ipv4.conf.all.arp_announce = 2
net.ipv4.conf.lo.arp_ignore = 1
net.ipv4.conf.lo.arp_announce = 2
EOF2
sudo sysctl --system
```

## Piloter LVS avec Keepalived

En production, on ne tape pas `ipvsadm` à la main : [[01-keepalived|Keepalived]] crée les services, **retire les serveurs en panne** grâce à ses contrôles et porte la VIP du directeur en VRRP.

```text
virtual_server 10.0.20.100 80 {
    delay_loop 5
    lb_algo wlc
    lb_kind DR
    persistence_timeout 0
    protocol TCP

    real_server 10.0.20.21 80 {
        weight 1
        HTTP_GET {
            url {
                path /sante
                status_code 200
            }
            connect_timeout 3
            retry 2
            delay_before_retry 2
        }
    }
    real_server 10.0.20.22 80 {
        weight 2
        TCP_CHECK {
            connect_timeout 3
        }
    }
}
```

Commandes : [[90-aide-memoire|aide-mémoire]].
