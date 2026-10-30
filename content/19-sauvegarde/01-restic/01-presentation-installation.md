---
title: Présentation, stratégie et premiers instantanés
description: Restic, outil de sauvegarde chiffrée et dédupliquée — rappel de la règle 3-2-1-1-0, notions (dépôt, instantanés, paquets, déduplication par blocs de taille variable, chiffrement AES-256), backends (local, SFTP, S3/MinIO, rest-server, rclone), installation sous Linux, Windows et macOS, initialisation du dépôt, sauvegarde avec exclusions, instantanés VSS sous Windows et restauration.
tags: [restic, sauvegarde, 3-2-1, déduplication, chiffrement, s3, sftp, vss]
icon: info
---

## Stratégie : 3-2-1-1-0

| Chiffre | Règle |
| --- | --- |
| **3** | Trois copies des données (production + 2 sauvegardes) |
| **2** | Sur deux supports ou systèmes différents |
| **1** | Une copie **hors site** |
| **1** | Une copie **hors ligne ou immuable** (bande éjectée, stockage S3 en verrouillage d'objets, dépôt en ajout seul) |
| **0** | Zéro erreur à la **vérification** et aux tests de restauration |

Définissez pour chaque service le **RPO** (perte de données acceptable : fréquence des sauvegardes) et le **RTO** (durée d'indisponibilité acceptable : vitesse de restauration). Une sauvegarde jamais restaurée n'est qu'une hypothèse.

## Restic

**restic** (BSD 2) est un binaire unique (Go) qui sauvegarde des fichiers vers un **dépôt** chiffré et dédupliqué :

| Notion | Description |
| --- | --- |
| Dépôt | Emplacement des données (répertoire, SFTP, S3, rest-server…) protégé par un **mot de passe** (clé maîtresse chiffrée) |
| Instantané | État d'un ensemble de chemins à un instant, avec hôte, étiquettes et chemins |
| Déduplication | Fichiers découpés en blocs de taille variable (*content-defined chunking*) : un bloc identique n'est stocké qu'une fois, entre fichiers, instantanés et hôtes |
| Chiffrement | AES-256 en mode CTR + Poly1305-AES ; le stockage ne voit que des données chiffrées |
| Compression | zstd (format de dépôt v2) |

> [!WARNING]
> Sans le **mot de passe** du dépôt, les données sont **irrécupérables**. Conservez-le dans le coffre de mots de passe ([[08-vaultwarden/01-presentation-installation|Vaultwarden]], Vault) **et** hors ligne.

## Backends

| Backend | Syntaxe du dépôt |
| --- | --- |
| Local / disque monté | `/srv/sauvegardes/restic` |
| SFTP | `sftp:sauvegarde@srv-sav-01:/depots/srv-web-01` |
| **S3** (MinIO, Ceph, AWS) | `s3:https://s3.corp.exemple.fr/restic-srv-web-01` |
| **rest-server** (HTTP, mode ajout seul) | `rest:https://utilisateur:mdp@srv-sav-01:8000/srv-web-01/` |
| rclone (tout ce que rclone gère) | `rclone:onedrive:restic` |
| Azure Blob, Google Cloud Storage, Backblaze B2 | `azure:`, `gs:`, `b2:` |

## Installation

```bash
sudo apt install restic            # Debian / Ubuntu ; sudo dnf install restic (EPEL / Fedora)
sudo restic self-update            # version la plus récente (si binaire officiel)
brew install restic                # macOS
```

```powershell
winget install restic.restic       # Windows (ou scoop install restic)
```

## Premier dépôt

```bash
export RESTIC_REPOSITORY="s3:https://s3.corp.exemple.fr/restic-srv-web-01"
export AWS_ACCESS_KEY_ID="svc-restic-web01"
export AWS_SECRET_ACCESS_KEY="SecretS3"
export RESTIC_PASSWORD_FILE=/root/.restic-mdp       # droits 0600

restic init
restic backup /etc /srv/www /var/backups/sql \
  --exclude-caches --exclude-file /etc/restic/exclusions.txt \
  --tag quotidien --host srv-web-01
restic snapshots
restic stats --mode raw-data       # taille réelle après déduplication et compression
```

```text /etc/restic/exclusions.txt
/srv/www/*/cache
/srv/www/*/tmp
*.tmp
*.log.[0-9]*
node_modules
```

Pour les **bases de données**, sauvegardez un vidage cohérent (`mysqldump`, `pg_dump`) ou envoyez-le directement : `mysqldump --single-transaction --all-databases | restic backup --stdin --stdin-filename mariadb.sql`.

## Windows et VSS

```powershell
$env:RESTIC_REPOSITORY = "rest:https://srv-sav-01.corp.exemple.fr:8000/srv-fic-01/"
$env:RESTIC_PASSWORD_FILE = "C:\ProgramData\restic\mdp.txt"
restic backup D:\Partages --use-fs-snapshot --exclude "D:\Partages\**\~$*" --tag quotidien
```

`--use-fs-snapshot` crée un **instantané VSS** (droits administrateur) : les fichiers ouverts et verrouillés sont sauvegardés de façon cohérente. Lancez restic depuis une tâche planifiée sous un compte de service (ou SYSTEM).

## Restaurer

```bash
restic snapshots --host srv-web-01 --tag quotidien
restic ls latest /etc/nginx
restic restore latest --target /tmp/restauration --include /etc/nginx
restic restore 4f2a9c1e --target / --include /srv/www/site1        # instantané précis, en place
restic dump latest /etc/nginx/nginx.conf > nginx.conf.restaure
restic mount /mnt/restic                                            # parcourir les instantanés (FUSE, Linux/macOS)
restic diff 4f2a9c1e latest                                         # différences entre instantanés
```

Suite : [[02-retention-automatisation-exploitation|rétention, automatisation et exploitation]].
