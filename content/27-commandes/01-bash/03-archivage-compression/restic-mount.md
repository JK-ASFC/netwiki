---
title: "restic mount"
description: "Bash — restic mount (Sauvegarde / Navigation) : Expose le dépôt comme un système de fichiers en lecture seule, pour parcourir ou copier quelques fichiers. Linux, macOS et FreeBSD uniquement."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde / Navigation |
| **Commande type** | `restic mount /mnt/restic` |

## Rôle

Expose le dépôt comme un système de fichiers en lecture seule, pour parcourir ou copier quelques fichiers. Linux, macOS et FreeBSD uniquement.

## Options

| Option | Rôle |
| --- | --- |
| `‹point-montage›` | dossier où exposer le dépôt |
| `-r ‹dépôt›` | emplacement du dépôt (chemin ou sftp:, s3:...) |
| `--host ‹nom›` | instantanés d'un hôte |
| `--path ‹chemin›` | instantanés contenant ce chemin |
| `--tag ‹étiquette›` | instantanés portant ces étiquettes |
| `--allow-other` | autorise les autres utilisateurs |
| `--owner-root` | root comme propriétaire de tout |
| `--no-default-permissions` | ignore les droits Unix (avec --allow-other) |
| `--path-template ‹modèle›` | noms des dossiers du montage |
| `--time-template ‹modèle›` | format des dates dans les noms |
| `(prérequis) fuse et fusermount` | module noyau et commande requis |
| `(démontage) Ctrl-c ou umount` | arrêt du montage |

## Exemples

**Monter le dépôt**

```bash
restic mount -r /srv/restic-repo /mnt/restic
```

**Seulement un hôte**

```bash
restic mount -r /srv/restic-repo --host luigi /mnt/restic
```

**Dates sans deux-points**

```bash
restic mount -r /srv/restic-repo --time-template "2006-01-02_15-04-05" /mnt/restic
```

## Dans les autres shells

- [[27-commandes/03-macos/03-archivage-compression/restic-mount|restic mount (macOS)]]

*Mots-clés : restic sauvegarde monter mount fuse parcourir dépôt instantané*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
