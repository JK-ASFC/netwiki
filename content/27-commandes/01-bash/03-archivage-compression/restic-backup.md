---
title: "restic backup"
description: "Bash — restic backup (Sauvegarde / Création) : Crée un instantané (snapshot) chiffré et dédupliqué des fichiers indiqués. Seules les données nouvelles sont écrites dans le dépôt."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde / Création |
| **Commande type** | `restic backup ~/Documents` |

## Rôle

Crée un instantané (snapshot) chiffré et dédupliqué des fichiers indiqués. Seules les données nouvelles sont écrites dans le dépôt.

## Options

| Option | Rôle |
| --- | --- |
| `-r ‹dépôt›` | emplacement du dépôt (chemin ou sftp:, s3:...) |
| `--exclude ‹motif›` | exclut un motif (répétable) |
| `--exclude-file ‹fichier›` | motifs lus dans un fichier |
| `--exclude-caches` | ignore les dossiers marqués CACHEDIR.TAG |
| `--exclude-larger-than ‹taille›` | exclut les fichiers plus gros |
| `--files-from ‹fichier›` | liste des éléments à sauvegarder |
| `--tag ‹étiquette›` | étiquette l'instantané (répétable) |
| `--host ‹nom›` | nom d'hôte enregistré dans l'instantané |
| `--dry-run` | montre ce qui serait fait, n'écrit rien |
| `-v` | détaille le résultat ; -vv liste chaque fichier |
| `--skip-if-unchanged` | pas d'instantané si rien n'a changé |
| `--force` | relit tous les fichiers |
| `--stdin-from-command` | sauvegarde la sortie d'une commande |
| `--stdin-filename ‹nom›` | nom du flux dans l'instantané |
| `--compression ‹mode›` | auto, off, fastest, better ou max |
| `(codes de sortie) 0 1 3 10 11 12` | à tester dans un script |
| `--one-file-system` | ne traverse pas les autres volumes |
| `--ignore-inode` | ignore inode et ctime (FUSE, pCloud) |
| `(cron) planification` | restic ne planifie rien lui-même |

## Exemples

**Sauvegarder un dossier**

```bash
restic backup -r /srv/restic-repo ~/Documents
```

**Exclusions et étiquette**

```bash
restic backup -r /srv/restic-repo ~/work --exclude="*.tmp" --exclude-caches --tag projetX
```

**Sortie d'une commande**

```bash
restic backup -r /srv/restic-repo --stdin-from-command --stdin-filename production.sql -- mysqldump mydb
```

## Dans les autres shells

- [[27-commandes/02-powershell/03-archivage-compression/restic-backup|restic backup (PowerShell)]]
- [[27-commandes/03-macos/03-archivage-compression/restic-backup|restic backup (macOS)]]

*Mots-clés : restic sauvegarde backup instantané snapshot exclure dedoublonnage incrémentiel*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
