---
title: OpenNebula — aide-mémoire des commandes
description: Commandes OpenNebula avec exemples — services du front-end, onehost, onecluster, onedatastore, onevnet, oneimage, onemarketapp, onetemplate, onevm (create, deploy, migrate, poweroff, terminate, disk-snapshot, backup), oneuser, onegroup, quotas, onezone, onedb (backup, upgrade) et journaux.
tags: [aide-mémoire, opennebula, onevm, onehost, onetemplate]
icon: terminal
---

Référence rapide (à lancer en tant que `oneadmin` : `sudo -iu oneadmin`) ; explications dans [[01-presentation-installation|OpenNebula]].

## Services

```bash
systemctl status opennebula opennebula-fireedge opennebula-flow opennebula-gate
oneversion
onezone list ; onezone show 0         # haute disponibilité (Raft) : état du leader
```

## Infrastructure

```bash
onehost list ; onehost show kvm-01
onehost create kvm-02.corp.exemple.fr --im kvm --vm kvm
onehost disable kvm-01 ; onehost enable kvm-01
onehost sync --force                  # repousse les pilotes vers les nœuds
onecluster list ; onecluster addhost default kvm-02
onedatastore list ; onedatastore show 1
```

## Réseaux, images, modèles

```bash
onevnet list ; onevnet create vnet.tpl ; onevnet show VM-VLAN30
onevnet addar VM-VLAN30 --ip 10.0.30.200 --size 50
oneimage list ; oneimage create --name debian13 --path /tmp/debian13.qcow2 --datastore default --type OS
onemarketapp list | grep -i alma
onemarketapp export "AlmaLinux 9" alma9 --datastore default
onetemplate list ; onetemplate show debian12 ; onetemplate update debian12
onetemplate instantiate debian12 --name srv-web-02 --nic VM-VLAN30 --cpu 2 --memory 4096
```

## Machines virtuelles

```bash
onevm list
onevm show srv-web-02
onevm poweroff srv-web-02 ; onevm resume srv-web-02
onevm reboot srv-web-02 ; onevm reboot --hard srv-web-02
onevm migrate --live srv-web-02 kvm-02
onevm resize srv-web-02 --cpu 4 --memory 8192        # VM éteinte (ou à chaud si autorisé)
onevm disk-snapshot-create srv-web-02 0 avant-maj
onevm disk-snapshot-revert srv-web-02 0 0
onevm backup srv-web-02 -d sauvegardes
onevm terminate srv-web-02
onevm recover --success 42             # débloquer une VM bloquée dans un état transitoire
```

## Utilisateurs et quotas

```bash
oneuser list ; oneuser create alice 'MotDePasse!'
oneuser chgrp alice equipe-web
onegroup create equipe-web
onegroup quota equipe-web               # ouvre l'éditeur de quotas
oneacl list
```

## Base et journaux

```bash
onedb backup -f /sauvegardes/one-$(date +%F).sql
onedb upgrade                           # après mise à jour des paquets
tail -f /var/log/one/oned.log
tail -f /var/log/one/42.log             # journal de la VM n° 42
```
