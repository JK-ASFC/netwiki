---
title: Présentation, installation et exploitation
description: bhyve — hyperviseur natif de FreeBSD (VT-x/AMD-V, invités FreeBSD, Linux, Windows, OpenBSD), outil vm-bhyve (ZFS, commutateurs virtuels, modèles), installation avec pkg, réseau par pont et VLAN, création d'une VM Linux ou Windows (UEFI, VNC), démarrage automatique, instantanés ZFS, bhyvectl, interfaces graphiques (TrueNAS CORE, Sylve) et dépannage.
tags: [bhyve, freebsd, hyperviseur, vm-bhyve, zfs, virtualisation]
icon: info
---

**bhyve** (licence BSD) est l'hyperviseur intégré à **FreeBSD** depuis la version 10 : virtualisation matérielle (VT-x avec EPT, AMD-V avec RVI), périphériques virtio, UEFI, VNC, passthrough PCI. Il fait tourner FreeBSD, Linux, Windows et les autres BSD. Il équipe historiquement TrueNAS CORE et existe aussi sur illumos (SmartOS, OmniOS).

L'outil **vm-bhyve** simplifie l'administration (création, démarrage, réseau, ZFS) ; c'est la méthode recommandée.

## Installation

```sh
# FreeBSD 14 : charger le module et installer vm-bhyve et le microprogramme UEFI
sysrc kld_list+="vmm"
kldload vmm
pkg install vm-bhyve bhyve-firmware edk2-bhyve grub2-bhyve
# Jeu de données ZFS pour les VM
zfs create zroot/vm
sysrc vm_enable="YES" vm_dir="zfs:zroot/vm"
vm init
cp /usr/local/share/examples/vm-bhyve/* /zroot/vm/.templates/
```

## Réseau

```sh
vm switch create public
vm switch add public em0               # interface physique
vm switch create -n 30 -i em0 vlan30    # commutateur relié à em0, trafic étiqueté VLAN 30
vm switch list
```

Les VM se branchent sur un commutateur par le paramètre `network0_switch` de leur configuration.

## Créer une VM Linux (UEFI)

```sh
vm iso https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-13.1.0-amd64-netinst.iso
vm create -t debian -s 20G -m 2G -c 2 srv-deb-01
vm configure srv-deb-01                 # vérifier : loader="uefi", graphics="yes", network0_switch="public"
vm install srv-deb-01 debian-13.1.0-amd64-netinst.iso
vm list                                  # le port VNC s'affiche (ex. 0.0.0.0:5900)
```

Connectez un client VNC (TigerVNC, Remmina) au port indiqué pour l'installation.

## Créer une VM Windows

```sh
vm create -t windows -s 60G -m 8G -c 4 srv-win-01
# Modèle windows : loader="uefi", graphics="yes", xhci_mouse="yes", disk0_type="nvme", network0_type="e1000"
vm install srv-win-01 Win_Server_2025_FR.iso
```

Après l'installation, installer les pilotes **virtio** (ISO virtio-win) puis passer disque et réseau en `virtio-blk` / `virtio-net` pour de meilleures performances.

## Exploitation

```sh
vm start srv-deb-01 ; vm stop srv-deb-01 ; vm restart srv-deb-01
vm console srv-deb-01                    # console série (invité configuré en console série)
sysrc vm_list="srv-deb-01 srv-win-01"    # démarrage automatique, dans l'ordre
sysrc vm_delay="10"
vm snapshot srv-deb-01                   # instantané ZFS (VM arrêtée de préférence)
vm rollback srv-deb-01@<horodatage>
vm clone srv-deb-01 srv-deb-02
zfs send -R zroot/vm/srv-deb-01@<horodatage> | ssh bsd-02 zfs recv zroot/vm/srv-deb-01   # copie vers un autre hôte
bhyvectl --vm=srv-deb-01 --get-stats | head
```

## Interfaces graphiques

bhyve n'a pas d'interface officielle. Options : **TrueNAS CORE** (menu *Virtual Machines*, FreeBSD), **Sylve** (interface web récente pour FreeBSD, bhyve et jails) ou un client VNC pour la console. Pour une interface complète de virtualisation, voir [[11-proxmox-ve/01-presentation-installation|Proxmox VE]].

## Dépannage

| Symptôme | Cause et correction |
| --- | --- |
| `vm: unable to load vmm.ko` | Virtualisation désactivée dans le BIOS ou processeur sans EPT/RVI |
| Écran noir en VNC | Ajouter `graphics_wait="yes"` pour attendre la connexion VNC avant le démarrage |
| Pas de réseau dans la VM | Commutateur non relié à l'interface physique, filtrage `pf` sur le pont |
| Linux UEFI ne démarre plus après installation | Chemin d'amorçage : copier `grubx64.efi` vers `\EFI\BOOT\BOOTX64.EFI` dans l'invité |

Commandes : [[90-aide-memoire|aide-mémoire]].
