---
title: Stormshield SNS — aide-mémoire des commandes
description: Commandes Stormshield SNS avec exemples — accès CLI serverd (modification, activation), objets, interfaces et routes, règles de filtrage et de NAT, accès d'administration, sauvegarde et restauration, mise à jour, console système (connexions, captures, VPN, état).
tags: [aide-mémoire, stormshield, sns, serverd, filtrage, nat]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-acces-administration|accès et administration]], [[02-objets-reseau-filtrage-nat|objets, filtrage et NAT]] et [[03-vpn-ha-supervision|VPN, HA et supervision]].

## Commandes serverd (CLI)

```sns
MODIFY ON FORCE
CONFIG OBJECT HOST NEW name=SRV_WEB ip=10.0.30.10 resolve=static
CONFIG OBJECT ACTIVATE
CONFIG NETWORK INTERFACE ADDRESS ADD ifname=ethernet1 address=10.0.10.254 mask=24
CONFIG NETWORK INTERFACE ACTIVATE
CONFIG NETWORK ROUTE ADD State=1 Remote=NET_A Interface=dmz2 Gateway=FW_A
CONFIG NETWORK ROUTE ACTIVATE
CONFIG SLOT ACTIVATE type=filter slot=5
CONFIG FILTER RULE INSERT index=9 type=filter state=on action=pass srctarget=Network_internals dsttarget=internet dstport=https position=1 loglevel=minor
CONFIG FILTER ACTIVATE
CONFIG WEBADMIN ACCESS ADD RESEAU_ADMIN
CONFIG WEBADMIN ACTIVATE
CONFIG CONSOLE SSH state=0
CONFIG CONSOLE ACTIVATE
CONFIG BACKUP list=all password=MotDePasseSauvegarde > sauvegarde-sns.na
SYSTEM UPDATE ACTIVATE
```

## Console système (SSH)

```bash
sfctl -s filter                    # règles actives
sfctl -s conn                      # connexions
tcpdump -ni ethernet1 host 10.0.20.15
netstat -rn
ipsecinfo
sysinfo
nsrpc -c "MONITOR SYSTEM" admin@localhost
```

Les noms et options exacts dépendent de la version de SNS : consultez le guide des commandes serverd.
