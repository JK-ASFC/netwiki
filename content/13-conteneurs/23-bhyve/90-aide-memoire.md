---
title: bhyve — aide-mémoire des commandes
description: Commandes bhyve et vm-bhyve avec exemples — module vmm, initialisation, commutateurs virtuels, téléchargement d'ISO, create, configure, install, start, stop, console, list, info, snapshot, rollback, clone, destroy, démarrage automatique (rc.conf), bhyvectl et bhyve en direct.
tags: [aide-mémoire, bhyve, vm-bhyve, freebsd]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|bhyve]].

## Hôte

```sh
kldstat | grep vmm
sysrc kld_list+="vmm" vm_enable="YES" vm_dir="zfs:zroot/vm"
vm init
vm version
```

## Commutateurs

```sh
vm switch list
vm switch create public && vm switch add public em0
vm switch create -n 30 -i em0 vlan30
vm switch vlan public 30                 # ou : étiqueter un commutateur existant
vm switch destroy labo
```

## Machines

```sh
vm iso                                   # ISO disponibles
vm iso https://download.freebsd.org/releases/ISO-IMAGES/14.3/FreeBSD-14.3-RELEASE-amd64-disc1.iso
vm create -t freebsd-zvol -s 20G -m 2G -c 2 srv-bsd-01
vm configure srv-bsd-01
vm install srv-bsd-01 FreeBSD-14.3-RELEASE-amd64-disc1.iso
vm list
vm info srv-bsd-01
vm start srv-bsd-01 ; vm stop srv-bsd-01 ; vm poweroff srv-bsd-01
vm console srv-bsd-01                    # « ~. » pour quitter
vm snapshot srv-bsd-01 ; vm rollback srv-bsd-01@2026-11-02-10:00:00
vm clone srv-bsd-01 srv-bsd-02
vm destroy srv-bsd-02
```

## Démarrage automatique

```sh
sysrc vm_list="srv-bsd-01 srv-deb-01"
sysrc vm_delay="10"
service vm start
```

## bhyvectl et bhyve direct

```sh
bhyvectl --vm=srv-bsd-01 --get-stats
bhyvectl --vm=srv-bsd-01 --destroy       # libère une VM restée en mémoire
ls /dev/vmm/
```
