---
title: TrueNAS — aide-mémoire des commandes
description: Commandes TrueNAS Community Edition avec exemples — consultation ZFS (zpool status, list, iostat, zfs list, get), midclt (system.info, pool.query, pool.dataset.query, zfs.snapshot, sharing.smb.query, service), SMART (smartctl), réseau, journaux du middleware, API REST, menu console.
tags: [aide-mémoire, truenas, zfs, midclt, nas]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|TrueNAS]]. Modifiez la configuration par l'interface ou `midclt` : les changements faits directement avec `zfs`/`zpool` peuvent être ignorés ou écrasés.

## Consultation ZFS

```bash
zpool status -x ; zpool status -v tank ; zpool list -v
zpool iostat -v tank 5
zfs list -o name,used,avail,refer,compressratio,mountpoint
zfs list -t snapshot -o name,used,creation -s creation | tail
zfs get compression,recordsize,quota,atime tank/partage
arc_summary | head -40
```

## midclt (API middleware)

```bash
midclt call system.info | jq '{version, hostname, uptime}'
midclt call pool.query | jq '.[] | {name, status, healthy}'
midclt call pool.dataset.query | jq '.[].name'
midclt call zfs.snapshot.create '{"dataset":"tank/partage","name":"avant-migration"}'
midclt call sharing.smb.query | jq '.[] | {name, path, enabled}'
midclt call service.query | jq '.[] | {service, state, enable}'
midclt call service.restart cifs
midclt call alert.list | jq '.[].formatted'
```

## Disques et SMART

```bash
lsblk -o NAME,SIZE,MODEL,SERIAL
smartctl -a /dev/sda | grep -E 'Model|Reallocated|Pending|Hours|Temperature'
smartctl -t short /dev/sda
```

## Réseau et journaux

```bash
ip -br a ; ip r
tail -f /var/log/middlewared.log
journalctl -u middlewared -f
```

## API REST

```bash
curl -s -H "Authorization: Bearer <clé-API>" https://nas-01.corp.exemple.fr/api/v2.0/pool | jq '.[].name'
```

Clé d'API : menu utilisateur → *API Keys*. Menu console (clavier/écran ou SSH) : options de réseau, réinitialisation du mot de passe, shell.
