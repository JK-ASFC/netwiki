---
title: "virt-install"
description: "Bash — virt-install (Virtualisation / KVM) : Crée et installe une nouvelle machine virtuelle KVM/QEMU via libvirt, en une seule commande."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / KVM |
| **Commande type** | `virt-install --name debian12 --memory 2048 --vcpus 2 --disk size=20 --cdrom /iso/debian.iso --os-variant debian12` |

## Rôle

Crée et installe une nouvelle machine virtuelle KVM/QEMU via libvirt, en une seule commande.

## En détail

Crée et installe une VM en une commande : nom, RAM, vCPU, disque et source (ISO ou réseau). --os-variant aide le noyau à optimiser ; --import réutilise un disque existant sans réinstaller.

## Options

| Option | Rôle |
| --- | --- |
| `--name ‹nom›` | nom de la VM |
| `--memory ‹2048›` | RAM en Mio |
| `--vcpus ‹2›` | nombre de vCPU |
| `--disk ‹size=20›` | disque : taille en Go, ou path=/var/lib/libvirt/images/x.qcow2 |
| `--cdrom ‹/iso/x.iso›` | installe depuis une image ISO |
| `--location ‹url_ou_chemin›` | arbre d'installation réseau ou dossier (install auto) |
| `--os-variant ‹debian12›` | optimise selon l'OS invité (liste : osinfo-query os) |
| `--network ‹bridge=br0›` | réseau : bridge=br0, network=default |
| `--graphics ‹vnc›` | console graphique : vnc, spice, none |
| `--boot ‹uefi›` | micrologiciel : bios ou uefi |
| `--import` | n'installe pas : importe un disque existant |
| `--noautoconsole` | ne pas ouvrir la console automatiquement |
| `--extra-args ‹console=ttyS0›` | arguments passés au noyau d'installation |

## Exemples

**VM depuis une ISO**

```bash
virt-install --name debian12 --memory 2048 --vcpus 2 --disk size=20 --cdrom /iso/debian12.iso --os-variant debian12
```

**Importer un disque**

```bash
virt-install --name app --memory 1024 --vcpus 1 --disk /var/lib/libvirt/images/app.qcow2 --import --os-variant generic
```

**Install réseau sans console**

```bash
virt-install --name web --memory 2048 --vcpus 2 --disk size=15 --location http://deb.debian.org/debian/dists/stable/main/installer-amd64/ --os-variant debian12 --graphics none --noautoconsole --extra-args console=ttyS0
```

*Mots-clés : créer installer vm machine virtuelle kvm qemu libvirt iso virt-install*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
