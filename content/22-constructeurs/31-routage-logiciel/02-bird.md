---
title: BIRD
description: BIRD Internet Routing Daemon (CZ.NIC) — démon de routage pour serveurs de route d'IXP et routeurs Linux/BSD : BIRD 2 et 3 (IPv4 et IPv6 dans un même démon, multi-thread en 3.x), installation (Debian/Ubuntu, RHEL, Alpine, FreeBSD), bird.conf (protocols device, kernel, static, bgp, ospf, bfd, rpki), canaux, filtres programmables, tables, birdc (show protocols, show route, configure, check), serveurs de route, et comparaison avec FRR.
tags: [bird, bgp, ospf, ixp, serveur de route, rpki, routage]
icon: info
---

**BIRD** (GPL, CZ.NIC) est le démon de routage des **points d'échange Internet** (serveurs de route d'IXP) et de nombreux opérateurs : configuration déclarative concise, **langage de filtres** très puissant, excellente tenue de grandes tables. La branche **2.x** gère IPv4 et IPv6 dans un seul démon ; **3.x** ajoute le multi-thread pour les très gros volumes.

## Installation

```bash
sudo apt install bird2           # Debian/Ubuntu (paquet bird2 ; « bird » désigne l'ancienne 1.6 sur les vieilles versions)
sudo dnf install bird            # RHEL/Rocky/Alma (EPEL)
sudo apk add bird                # Alpine
sudo pkg install bird2           # FreeBSD
sudo systemctl enable --now bird
```

Le dépôt de CZ.NIC (`pkg.labs.nic.cz`) fournit les versions les plus récentes pour Debian et Ubuntu.

## Exemple de configuration (`/etc/bird/bird.conf`)

```text
log syslog all;
router id 10.0.255.1;

protocol device { }
protocol direct { ipv4; ipv6; }

protocol kernel {
  ipv4 { export where source ~ [ RTS_BGP, RTS_STATIC ]; };   # pousser les routes dans le noyau
  merge paths on;                                             # ECMP
}

protocol static annonces {
  ipv4;
  route 198.51.100.0/24 blackhole;
}

define MON_AS = 65001;

filter sortie_transit {
  if net ~ [ 198.51.100.0/24 ] then accept;
  reject;
}

filter entree_transit {
  if net ~ [ 0.0.0.0/0{0,7}, 10.0.0.0/8+, 192.168.0.0/16+, 172.16.0.0/12+ ] then reject;   # trop larges et RFC 1918
  if bgp_path.len > 50 then reject;
  accept;
}

protocol bgp transit_operateur {
  local 203.0.113.2 as MON_AS;
  neighbor 203.0.113.1 as 64500;
  ipv4 {
    import filter entree_transit;
    export filter sortie_transit;
  };
}

protocol ospf v2 interne {
  ipv4 { import all; export none; };
  area 0 {
    interface "eth1" { cost 10; };
    interface "lo" { stub; };
  };
}
```

## birdc

```bash
sudo birdc show status
sudo birdc show protocols
sudo birdc show protocols all transit_operateur
sudo birdc show route count
sudo birdc show route for 9.9.9.9 all
sudo birdc show route export transit_operateur
sudo birdc configure check          # valider la syntaxe
sudo birdc configure                # recharger sans couper les sessions inchangées
sudo birdc disable transit_operateur ; sudo birdc enable transit_operateur
```

Serveurs de route d'IXP : configurations générées avec **arouteserver** ou IXP Manager (filtres IRR, RPKI, communautés de contrôle). Suite : [[03-openbgpd|OpenBGPD]] · [[01-frrouting|FRR]] · [[90-aide-memoire|aide-mémoire]].
