---
title: Présentation, installation et utilisation
description: Kopia — sauvegarde de fichiers dédupliquée, compressée et chiffrée (Apache 2.0), alternative moderne à restic et Borg : dépôts (système de fichiers, SFTP, S3 et compatibles, B2, Azure, GCS, WebDAV, rclone), installation (Linux apt/dnf, Windows winget, macOS, Docker), CLI (repository create/connect, snapshot create/list/restore, policy set), politiques de rétention et de compression, montage des instantanés, exclusions, planification, mode serveur multi-utilisateurs (kopia server), KopiaUI, maintenance et vérification.
tags: [kopia, sauvegarde, déduplication, chiffrement, s3, instantanés]
icon: info
---

**Kopia** sauvegarde des fichiers et dossiers en **instantanés** dédupliqués et **chiffrés** côté client vers presque tout type de stockage. Il se compare à [[01-restic/01-presentation-installation|restic]] et [[02-borgbackup/01-presentation-installation|BorgBackup]], avec en plus une **interface graphique** (KopiaUI) et un **mode serveur** où plusieurs machines sauvegardent vers un dépôt central sans connaître ses identifiants.

## Installation

| Système | Commande |
| --- | --- |
| Debian/Ubuntu | Dépôt `packages.kopia.io/apt` puis `sudo apt install kopia` (et `kopia-ui`) |
| RHEL/Fedora | Dépôt `packages.kopia.io/rpm` puis `sudo dnf install kopia` |
| Windows | `winget install Kopia.KopiaUI` (CLI incluse) |
| macOS | `brew install kopia` ; `brew install --cask kopiaui` |
| Docker | `kopia/kopia` |

## Utilisation (CLI)

```bash
kopia repository create s3 --bucket=sauv-kopia --endpoint=minio.corp.exemple.fr --access-key=SAUVACCES --secret-access-key="$S3_SECRET"
# mot de passe du dépôt demandé : sans lui, aucune restauration possible
kopia repository connect s3 --bucket=sauv-kopia --endpoint=minio.corp.exemple.fr --access-key=SAUVACCES --secret-access-key="$S3_SECRET"   # autre machine
kopia policy set --global --keep-latest 10 --keep-daily 14 --keep-weekly 8 --keep-monthly 12 --compression=zstd
kopia policy set /srv/donnees --add-ignore '*.tmp' --add-ignore 'cache/'
kopia snapshot create /srv/donnees /etc
kopia snapshot list /srv/donnees
kopia snapshot restore k1a2b3c4d5e6 /srv/restauration
kopia mount all /mnt/kopia &                         # parcourir tous les instantanés
```

Planification : la politique `--snapshot-interval 24h` avec KopiaUI ou `kopia server`, ou une minuterie systemd lançant `kopia snapshot create --all`.

## Mode serveur

```bash
kopia server start --address=0.0.0.0:51515 --tls-generate-cert --tls-cert-file=/etc/kopia/tls.crt --tls-key-file=/etc/kopia/tls.key \
  --server-username=admin --server-password="$MDP_UI"
kopia server user add jk@poste-01                    # mot de passe propre au client
# sur le client : kopia repository connect server --url=https://kopia.corp.exemple.fr:51515 --server-cert-fingerprint=<empreinte>
```

## Maintenance

```bash
kopia maintenance info ; kopia maintenance run --full     # automatique par défaut
kopia snapshot verify --verify-files-percent=5            # relit un échantillon de fichiers
```

> [!TIP]
> Testez une **restauration** complète sur une autre machine au moins une fois par trimestre, et conservez le mot de passe du dépôt hors du système sauvegardé (coffre de mots de passe).

Interface : [[02-interface-graphique|KopiaUI]] · commandes : [[90-aide-memoire|aide-mémoire]].
