---
title: Présentation et installation
description: Conteneurs système Linux — LXC (outils bas niveau), LXD (Canonical, snap) et Incus (fork communautaire de Linux Containers, Apache 2.0), différences avec Docker, choix entre Incus et LXD, installation sur Debian, Ubuntu, Fedora, RHEL/Rocky (dépôt Zabbly, COPR), Arch, Alpine, initialisation (incus admin init, lxd init), premiers conteneurs et machines virtuelles, migration LXD vers Incus.
tags: [incus, lxd, lxc, conteneurs système, machines virtuelles, linux containers, installation]
icon: info
---

Un **conteneur système** exécute une distribution Linux complète (init, systemd, services, SSH) en partageant le noyau de l'hôte : on l'administre comme une petite VM, avec la légèreté d'un conteneur. Docker, lui, empaquette **une application** ([[01-docker/01-presentation-installation|Docker]]).

| Projet | Rôle | Licence | Outil |
| --- | --- | --- | --- |
| **LXC** | Bibliothèque et outils bas niveau (cgroups, espaces de noms) ; base de [[11-proxmox-ve/01-presentation-installation\|Proxmox VE]] | LGPL | `lxc-create`, `lxc-start`, `lxc-attach` |
| **LXD** | Gestionnaire complet (API REST, images, réseau, stockage, cluster, VM), développé par **Canonical** | AGPL | `lxc` (client), `lxd` |
| **Incus** | **Fork communautaire de LXD** (2023) par l'équipe Linux Containers, mêmes concepts, plus ouvert | Apache 2.0 | `incus` |

**Choisir** : **Incus** pour un serveur Debian, Fedora, Arch ou Alpine et un projet communautaire ; **LXD** sur Ubuntu avec le support Canonical (snap). Les commandes sont presque identiques (`incus launch` ≈ `lxc launch` de LXD) ; ce wiki utilise Incus dans les exemples.

Incus et LXD gèrent aussi des **machines virtuelles** (QEMU/KVM) avec la même commande (`--vm`) : un seul outil pour conteneurs et VM.

## Installation d'Incus

### Debian 13 / Ubuntu 24.04 et plus récents

```bash
sudo apt install incus                    # + incus-ui-canonical pour l'interface web (dépôt Zabbly)
sudo adduser "$USER" incus-admin          # administration sans sudo (reconnexion)
```

### Dépôt Zabbly (dernières versions stables, Debian 12 / Ubuntu 22.04+)

```bash
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://pkgs.zabbly.com/key.asc -o /etc/apt/keyrings/zabbly.asc
cat <<EOF | sudo tee /etc/apt/sources.list.d/zabbly-incus-stable.sources
Enabled: yes
Types: deb
URIs: https://pkgs.zabbly.com/incus/stable
Suites: $(. /etc/os-release && echo ${VERSION_CODENAME})
Components: main
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/zabbly.asc
EOF
sudo apt update && sudo apt install incus incus-ui-canonical
```

### Autres distributions

```bash
sudo dnf install incus                                                     # Fedora
sudo dnf copr enable neil/incus && sudo dnf install incus incus-tools      # RHEL / Rocky / Alma 9 (avec EPEL)
sudo pacman -S incus                                                       # Arch Linux
sudo apk add incus incus-client && sudo rc-update add incusd && sudo rc-service incusd start   # Alpine
sudo systemctl enable --now incus.socket                                   # systemd
```

Client seul (administration à distance) : `brew install incus` (macOS), `winget install LinuxContainers.Incus` (Windows).

## Initialisation

```bash
sudo incus admin init
# Questions principales : cluster (non), pool de stockage (zfs, btrfs, lvm ou dir), pont réseau incusbr0 (NAT, IPv4/IPv6),
# exposition de l'API sur le réseau (core.https_address, port 8443) pour l'administration à distance et l'interface web.
incus admin init --minimal                  # valeurs par défaut (labo)
```

## Premiers conteneurs et VM

```bash
incus image list images: debian            # images du serveur communautaire images.linuxcontainers.org
incus launch images:debian/13 srv-dns-02
incus launch images:rockylinux/9 srv-app-03 -c limits.cpu=2 -c limits.memory=2GiB
incus launch images:ubuntu/24.04 vm-test-01 --vm -c limits.cpu=2 -c limits.memory=4GiB
incus list
incus exec srv-dns-02 -- bash             # shell root dans le conteneur
incus console vm-test-01 --type=vga       # console graphique d'une VM (client SPICE requis)
incus stop srv-dns-02 && incus delete srv-dns-02
```

## LXD (Ubuntu, snap)

```bash
sudo snap install lxd
sudo lxd init
lxc launch ubuntu:24.04 srv-web-01         # client « lxc » de LXD (≠ outils lxc-* de LXC)
lxc list
```

## LXC bas niveau

```bash
sudo apt install lxc                       # dnf install lxc lxc-templates
sudo lxc-create -n c1 -t download -- -d debian -r trixie -a amd64
sudo lxc-start -n c1 && sudo lxc-attach -n c1
sudo lxc-ls -f
```

## Migrer de LXD à Incus

```bash
sudo apt install incus                     # sans initialiser Incus
sudo lxd-to-incus                          # vérifie, migre conteneurs, VM, réseaux et stockage, puis désactive LXD
```

Suite : [[02-reseau-stockage-cluster|réseau, stockage, profils et cluster]].
