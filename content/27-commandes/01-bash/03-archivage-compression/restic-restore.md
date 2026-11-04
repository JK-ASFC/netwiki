---
title: "restic restore"
description: "Bash — restic restore (Sauvegarde / Restauration) : Extrait le contenu d'un instantané vers un dossier cible, en entier ou en partie."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde / Restauration |
| **Commande type** | `restic restore latest --target /tmp/restore` |

## Rôle

Extrait le contenu d'un instantané vers un dossier cible, en entier ou en partie.

## Options

| Option | Rôle |
| --- | --- |
| `‹instantané›` | identifiant, latest ou instantané:sous-dossier |
| `-r ‹dépôt›` | emplacement du dépôt (chemin ou sftp:, s3:...) |
| `--target ‹dossier›` | dossier de destination |
| `--include ‹motif›` | restaure seulement ces éléments |
| `--exclude ‹motif›` | exclut de la restauration |
| `--host ‹nom›` | choisit le latest de cet hôte |
| `--path ‹chemin›` | choisit le latest de ce chemin |
| `--sparse` | recrée les fichiers creux |
| `--overwrite ‹mode›` | always, if-changed, if-newer ou never |
| ⚠️ `--delete` | supprime de la cible ce qui est absent de l'instantané |
| `--dry-run` | simule sans rien écrire |
| `-vv` | détaille chaque fichier traité |
| `(sous-dossier) latest:/chemin` | ne restaure qu'une branche |
| `(dump) restic dump latest fichier` | envoie un fichier sur la sortie standard |

> [!WARNING]
> Options à manier avec précaution : `--delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Restaurer le dernier instantané**

```bash
restic restore latest -r /srv/restic-repo --target /tmp/restore
```

**Un seul fichier**

```bash
restic restore latest -r /srv/restic-repo --target /tmp/restore --include /home/user/work/foo
```

**Voir avant de toucher**

```bash
restic restore latest -r /srv/restic-repo --target /tmp/restore --dry-run -vv
```

## Dans les autres shells

- [[27-commandes/02-powershell/03-archivage-compression/restic-restore|restic restore (PowerShell)]]
- [[27-commandes/03-macos/03-archivage-compression/restic-restore|restic restore (macOS)]]

*Mots-clés : restic sauvegarde restaurer restauration instantané snapshot récupérer fichier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
