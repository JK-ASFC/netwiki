---
title: Incus, LXD et LXC — aide-mémoire des commandes
description: Commandes Incus (et LXD) avec exemples — initialisation, images, launch, list, exec, console, start/stop/restart, config et limites, profils, périphériques (disque, réseau, proxy), réseaux, stockage et volumes, instantanés, export/import, copy/move entre serveurs, remotes et confiance, projets, cluster, journaux ; outils LXC bas niveau (lxc-create, lxc-start, lxc-attach, lxc-ls).
tags: [aide-mémoire, incus, lxd, lxc, conteneurs]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Incus, LXD et LXC]] et [[02-reseau-stockage-cluster|exploitation]]. Avec **LXD**, remplacez `incus` par `lxc` (client LXD) et `incus admin init` par `lxd init`.

## Serveur et images

```bash
incus admin init
incus version
incus info | head -30
incus image list images: debian/13
incus image list                        # images en cache local
incus image copy images:debian/13 local: --alias debian13 --auto-update
incus image delete debian13
```

## Instances

```bash
incus launch images:debian/13 srv-web-01
incus launch images:debian/13 vm-01 --vm -c limits.cpu=2 -c limits.memory=4GiB
incus init images:alpine/3.22 c-test    # créer sans démarrer
incus list
incus list -c ns4tS                     # nom, état, IPv4, type, nombre d'instantanés
incus info srv-web-01
incus exec srv-web-01 -- bash
incus exec srv-web-01 -- apt update
incus console srv-web-01                # Ctrl+A puis Q pour quitter
incus start srv-web-01 ; incus stop srv-web-01 ; incus restart srv-web-01
incus stop srv-web-01 --force
incus rename srv-web-01 srv-web-10
incus delete srv-web-10 --force
incus file push ./nginx.conf srv-web-01/etc/nginx/nginx.conf
incus file pull srv-web-01/var/log/syslog .
```

## Configuration et profils

```bash
incus config set srv-web-01 limits.cpu=2 limits.memory=2GiB boot.autostart=true
incus config get srv-web-01 limits.memory
incus config show srv-web-01 --expanded
incus config edit srv-web-01
incus profile list
incus profile show default
incus profile copy default serveur && incus profile edit serveur
incus profile add srv-web-01 serveur
```

## Périphériques

```bash
incus config device add srv-web-01 data disk source=/srv/data path=/data
incus config device add srv-web-01 eth1 nic nictype=bridged parent=br0 vlan=30
incus config device add srv-web-01 http proxy listen=tcp:0.0.0.0:8080 connect=tcp:127.0.0.1:80
incus config device override srv-web-01 root size=40GiB
incus config device remove srv-web-01 data
```

## Réseau et stockage

```bash
incus network list
incus network create labo ipv4.address=10.99.0.1/24 ipv4.nat=true
incus network show incusbr0
incus network list-leases incusbr0
incus storage list
incus storage create rapide zfs source=/dev/nvme1n1
incus storage volume create rapide donnees size=50GiB
incus storage volume attach rapide donnees srv-db-01 /var/lib/data
```

## Instantanés, sauvegardes, migration

```bash
incus snapshot create srv-web-01 avant-maj
incus snapshot list srv-web-01
incus snapshot restore srv-web-01 avant-maj
incus snapshot delete srv-web-01 avant-maj
incus export srv-web-01 srv-web-01.tar.gz --optimized-storage
incus import srv-web-01.tar.gz
incus copy srv-web-01 incus-02:srv-web-01 --refresh
incus move srv-web-01 incus-02:
```

## Accès distant, projets, cluster

```bash
incus config set core.https_address :8443
incus config trust add poste-admin
incus config trust list
incus remote add incus-01 https://incus-01.corp.exemple.fr:8443 --token <jeton>
incus remote list
incus project create equipe-web && incus project switch equipe-web
incus cluster list
incus cluster add incus-03
incus cluster evacuate incus-02 && incus cluster restore incus-02
```

## Journaux

```bash
incus info --show-log srv-web-01
incus monitor --pretty --type=logging
journalctl -u incus -f
```

## LXC bas niveau

```bash
lxc-create -n c1 -t download -- -d debian -r trixie -a amd64
lxc-start -n c1
lxc-attach -n c1
lxc-ls -f
lxc-info -n c1
lxc-stop -n c1 && lxc-destroy -n c1
cat /var/lib/lxc/c1/config
```
