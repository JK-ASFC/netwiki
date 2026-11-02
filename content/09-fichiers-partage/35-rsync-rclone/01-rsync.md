---
title: rsync
description: rsync — synchronisation incrémentale de fichiers locale ou distante (GPL) : algorithme delta, installation (Linux, macOS, Windows via WSL, cwRsync ou MSYS2), options essentielles (-a, -v, -z, -h, --progress, --delete, --exclude, --dry-run, --partial, --bwlimit, -H -A -X), barre oblique finale, transfert par SSH, démon rsyncd (rsyncd.conf, modules, authentification), sauvegardes avec --link-dest, sécurité (clés restreintes, rrsync), et pièges courants.
tags: [rsync, synchronisation, sauvegarde, ssh, incrémental, rsyncd]
icon: info
---

**rsync** ne transfère que les **différences** entre source et destination : outil de base pour copier de gros volumes, migrer un serveur, alimenter un miroir ou faire des sauvegardes simples. Il est présent sur presque tous les Linux et macOS.

## Installation

| Système | Commande |
| --- | --- |
| Debian/Ubuntu | `sudo apt install rsync` |
| RHEL/Fedora | `sudo dnf install rsync` |
| macOS | Préinstallé (version ancienne) ; récent : `brew install rsync` |
| Windows | WSL (`apt install rsync`), MSYS2 (`pacman -S rsync`) ou cwRsync |

## Options essentielles

```bash
rsync -avh --progress /srv/donnees/ /mnt/sauvegarde/donnees/          # -a : récursif, droits, dates, liens
rsync -avhn --delete /srv/donnees/ /mnt/sauvegarde/donnees/           # -n : simulation, à faire AVANT --delete
rsync -aHAX --numeric-ids /srv/ ancien-srv:/srv/                      # liens durs, ACL, attributs étendus (migration)
rsync -avz -e "ssh -p 2222 -i ~/.ssh/id_sauvegarde" /srv/web/ sauv@nas.corp.exemple.fr:/volume1/web/
rsync -av --exclude='*.tmp' --exclude='cache/' --partial --bwlimit=20M src/ dest/
```

> [!WARNING]
> La **barre oblique finale** change tout : `rsync -a src/ dest/` copie le **contenu** de `src` dans `dest` ; `rsync -a src dest/` crée `dest/src`. Avec `--delete`, une erreur de chemin peut effacer la destination : simulez toujours avec `-n`.

## Sauvegardes historisées avec --link-dest

```bash
JOUR=$(date +%F)
rsync -a --delete --link-dest=/sauv/srv-web/derniere srv-web:/srv/ /sauv/srv-web/$JOUR/ \
  && ln -sfn /sauv/srv-web/$JOUR /sauv/srv-web/derniere
```

Chaque jour est un répertoire complet, mais les fichiers inchangés sont des **liens durs** (aucun espace supplémentaire). C'est le principe de [[12-rdiff-backup-rsnapshot/01-presentation-installation|rsnapshot]].

## Démon rsyncd

```ini
# /etc/rsyncd.conf
uid = nobody
gid = nogroup
use chroot = yes
max connections = 4
[miroir]
  path = /srv/miroir
  read only = yes
  hosts allow = 10.0.0.0/8
[depot]
  path = /srv/depot
  read only = no
  auth users = depot
  secrets file = /etc/rsyncd.secrets
```

```bash
sudo systemctl enable --now rsync           # port 873, non chiffré : réseau interne uniquement
rsync -av rsync://srv-miroir/miroir/ /srv/copie/
```

Restreindre une clé SSH à rsync : `command="/usr/bin/rrsync /volume1/sauvegardes",restrict ssh-ed25519 AAAA…` dans `authorized_keys`.

Suite : [[02-rclone|Rclone]] · [[90-aide-memoire|aide-mémoire]].
