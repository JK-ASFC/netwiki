---
title: UTM — aide-mémoire des commandes
description: Commandes UTM et QEMU sur macOS avec exemples — installation Homebrew, utmctl (list, status, start, suspend, stop, clone, delete, ip-address, exec, file push/pull), emplacement des paquets .utm, qemu-img (conversion VMDK/VHDX vers qcow2), montage du dossier partagé VirtFS sous Linux, outils invités SPICE.
tags: [aide-mémoire, utm, utmctl, macos, qemu-img]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|UTM]].

## Installation

```bash
brew install --cask utm
brew upgrade --cask utm
# utmctl est livré dans l'application
sudo ln -sf /Applications/UTM.app/Contents/MacOS/utmctl /usr/local/bin/utmctl
```

## utmctl

```bash
utmctl list
utmctl status "Debian 13"
utmctl start "Debian 13"
utmctl start "Debian 13" --disposable           # session jetable : modifications perdues à l'arrêt
utmctl suspend "Debian 13"
utmctl stop "Debian 13"                          # --force pour couper
utmctl clone "Debian 13" --name "Debian 13 labo"
utmctl delete "Debian 13 labo"
utmctl ip-address "Debian 13"                    # nécessite l'agent invité (qemu-guest-agent)
utmctl exec "Debian 13" -- uname -a
utmctl file push "Debian 13" /tmp/config.yml < ./config.yml
utmctl file pull "Debian 13" /etc/hostname
```

## Fichiers

```bash
ls ~/Library/Containers/com.utmapp.UTM/Data/Documents/      # machines (paquets .utm)
ls ~/Library/Containers/com.utmapp.UTM/Data/Documents/"Debian 13.utm"/Data   # disques qcow2
```

## Images disque (QEMU livré avec UTM ou brew install qemu)

```bash
brew install qemu
qemu-img convert -p -f vmdk -O qcow2 serveur.vmdk serveur.qcow2
qemu-img convert -p -f vhdx -O qcow2 serveur.vhdx serveur.qcow2
qemu-img info serveur.qcow2
qemu-img resize serveur.qcow2 +20G
```

## Dans l'invité Linux

```bash
sudo apt install qemu-guest-agent spice-vdagent           # IP dans UTM, presse-papiers, écran dynamique
sudo mkdir -p /mnt/partage && sudo mount -t 9p -o trans=virtio,version=9p2000.L share /mnt/partage
echo 'share /mnt/partage 9p trans=virtio,version=9p2000.L,_netdev,nofail 0 0' | sudo tee -a /etc/fstab
```

Windows invité : installer **SPICE Guest Tools** (proposé par l'assistant ou depuis la page de téléchargement d'UTM).
