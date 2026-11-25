---
title: nftables et iptables
description: Pare-feu du noyau Linux — nftables (successeur d'iptables : tables, chaînes, règles, familles inet, ensembles et maps, compteurs, journalisation, NAT, fichier /etc/nftables.conf, nft -f, -c, list ruleset, sauvegarde atomique) et iptables (historique, iptables-nft et iptables-legacy, chaînes INPUT/FORWARD/OUTPUT, tables filter/nat/mangle, persistance iptables-save/restore), exemple de politique serveur par défaut, NAT de passerelle, traduction iptables vers nftables (iptables-translate), interactions avec Docker, firewalld et UFW, et bonnes pratiques pour ne pas se couper l'accès.
tags: [nftables, iptables, pare-feu, linux, nat, netfilter]
icon: info
---

**Netfilter** filtre les paquets dans le noyau Linux. **nftables** (`nft`) est l'interface moderne, par défaut sur Debian, RHEL 8+, Ubuntu récents ; **iptables** reste très répandu dans la documentation et les scripts (sur les systèmes récents, la commande `iptables` est généralement `iptables-nft`, qui écrit des règles nftables). Les outils [[02-firewalld-ufw|firewalld et UFW]] génèrent ces règles pour vous.

> [!WARNING]
> Sur un serveur distant, testez toujours une nouvelle politique avec un **retour arrière automatique** (`nft -f regles.nft ; sleep 120 ; nft -f ancien.nft` dans une session `screen`, ou la console hors bande disponible) avant de la rendre permanente.

## nftables : politique d'un serveur

```text
#!/usr/sbin/nft -f
# /etc/nftables.conf
flush ruleset

table inet filtre {
  set admins { type ipv4_addr; flags interval; elements = { 10.0.99.0/24 } }
  set bannis { type ipv4_addr; flags timeout; }

  chain entree {
    type filter hook input priority filter; policy drop;
    ct state established,related accept
    ct state invalid drop
    iif "lo" accept
    ip saddr @bannis drop
    meta l4proto { icmp, ipv6-icmp } accept
    ip saddr @admins tcp dport 22 accept
    tcp dport { 80, 443 } accept
    limit rate 5/minute log prefix "nft-refus: " level info
  }
  chain transit { type filter hook forward priority filter; policy drop; }
  chain sortie  { type filter hook output priority filter; policy accept; }
}
```

```bash
sudo nft -c -f /etc/nftables.conf && sudo nft -f /etc/nftables.conf        # vérifier puis charger (atomique)
sudo systemctl enable --now nftables
sudo nft list ruleset ; sudo nft -a list chain inet filtre entree           # -a : numéros de règle (handle)
sudo nft add element inet filtre bannis { 198.51.100.77 timeout 1h }
sudo nft delete rule inet filtre entree handle 12
```

NAT d'une passerelle :

```text
table ip nat {
  chain postrouting { type nat hook postrouting priority srcnat; oifname "eth0" ip saddr 10.0.0.0/8 masquerade; }
  chain prerouting  { type nat hook prerouting priority dstnat; iifname "eth0" tcp dport 443 dnat to 10.0.20.10; }
}
```

### Référence nft

| Élément | Valeurs |
| --- | --- |
| **Familles** | `inet` (IPv4+IPv6, recommandé), `ip`, `ip6`, `arp`, `bridge`, `netdev` |
| **Hooks** | `prerouting`, `input`, `forward`, `output`, `postrouting`, `ingress` (netdev/inet) |
| **Priorités** nommées | `raw` (−300), `mangle` (−150), `dstnat` (−100), `filter` (0), `srcnat` (100) |
| **Verdicts** | `accept`, `drop`, `reject` (avec `with icmp type …`), `queue`, `continue`, `return`, `jump <chaîne>`, `goto` |
| **Sélecteurs** | `ip saddr/daddr`, `tcp/udp dport/sport`, `ct state`, `iif/oif`, `meta l4proto/mark/skuid`, `ether saddr` |
| **Instructions** | `log`, `limit rate`, `counter`, `quota`, `meter` (limite par IP), `dnat`/`snat`/`masquerade`/`redirect`, `tcp flags`, `mark set` |
| **Objets nommés** | `set` (ensemble), `map` (clé→valeur/verdict), `counter`, `quota`, `ct helper`, `flowtable` (déchargement) |

```text
# Ensemble, map de redirection de ports et limite par IP
table inet filtre {
  map portmap { type inet_service : ipv4_addr; elements = { 80 : 10.0.20.10, 443 : 10.0.20.11 } }
  chain entree {
    type filter hook input priority filter; policy drop;
    ct state established,related accept
    tcp dport 22 meter ssh-flood { ip saddr limit rate 10/minute } accept   # anti-force-brute par IP
    counter comment "paquets refusés" drop
  }
}
```

```bash
sudo nft list ruleset ; sudo nft list sets ; sudo nft list counters
sudo nft monitor                     # suivre les événements en direct
sudo nft list ruleset > /etc/nftables-sauvegarde.nft      # sauvegarde
```

## iptables

```bash
sudo iptables -L -n -v --line-numbers ; sudo iptables -t nat -L -n -v
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -s 10.0.99.0/24 -p tcp --dport 22 -j ACCEPT
sudo iptables -P INPUT DROP
sudo iptables-save | sudo tee /etc/iptables/rules.v4        # persistance (paquet iptables-persistent sur Debian)
iptables-translate -A INPUT -p tcp --dport 22 -j ACCEPT      # équivalent nftables
sudo iptables -I DOCKER-USER -i eth0 ! -s 10.0.99.0/24 -j DROP     # restreindre les conteneurs publiés
```

Modules de correspondance (`-m`) courants : `conntrack` (`--ctstate`), `multiport` (`--dports 80,443`), `limit`/`hashlimit` (anti-flood), `recent` (listes dynamiques), `addrtype`, `mac`, `owner` (par UID), `string`, `comment`. Cibles (`-j`) utiles : `ACCEPT`, `DROP`, `REJECT --reject-with`, `LOG --log-prefix`, `DNAT`/`SNAT`/`MASQUERADE` (table `nat`), `MARK`, `RETURN`.

**Docker** ajoute ses propres règles (chaînes `DOCKER`, `DOCKER-USER`) : placez vos restrictions dans `DOCKER-USER`, sinon les ports publiés contournent votre politique.

Suite : [[02-firewalld-ufw|firewalld et UFW]] · [[03-sshguard|SSHGuard]] · [[90-aide-memoire|aide-mémoire]].
