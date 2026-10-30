---
title: pfSense et OPNsense — aide-mémoire des commandes
description: Commandes pfSense et OPNsense avec exemples — shell (pfctl : règles, états, statistiques, tables), journaux du filtrage, captures, services (pfSsh.php, configctl), mises à jour (pfSense-upgrade, opnsense-update), sauvegarde de config.xml, API REST d'OPNsense, menu console.
tags: [aide-mémoire, pfsense, opnsense, pfctl, configctl, freebsd]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-pfsense|pfSense]] et [[02-opnsense|OPNsense]].

## Commun (shell FreeBSD)

```sh
pfctl -sr                                  # règles chargées
pfctl -ss | grep 10.0.20.15                # états
pfctl -si                                  # statistiques
pfctl -sn                                  # règles de NAT
pfctl -t virusprot -T show                 # contenu d'une table
pfctl -k 10.0.20.15                        # supprimer les états d'un hôte
tcpdump -ni em0 host 10.0.20.15
netstat -rn
sockstat -4l
top -SH
```

## pfSense

```sh
pfSsh.php playback svc restart unbound
pfSsh.php playback listpkg
pfSense-upgrade -c                         # vérifier les mises à jour
tail -f /var/log/filter.log
cp /cf/conf/config.xml /root/config-$(date +%F).xml
easyrule pass wan tcp 198.51.100.7 10.0.30.10 443
```

## OPNsense

```sh
configctl filter reload
configctl service reload all
configctl interface list ifconfig
opnsense-update -c
opnsense-version
cp /conf/config.xml /root/config-$(date +%F).xml
```

```bash
curl -s -k -u "CLE:SECRET" https://10.0.99.1/api/core/firmware/status | jq .
curl -s -k -u "CLE:SECRET" https://10.0.99.1/api/diagnostics/interface/getArp | jq '.[0:5]'
```
