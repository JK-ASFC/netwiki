---
title: "restic init"
description: "macOS — restic init (Sauvegarde / Dépôt) : Crée un dépôt restic chiffré à l'emplacement indiqué (dossier, SFTP, S3...). Le mot de passe ne peut pas être récupéré s'il est perdu."
tags: [macos, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde / Dépôt |
| **Commande type** | `restic init --repo /Volumes/Sauvegarde/restic-repo` |

## Rôle

Crée un dépôt restic chiffré à l'emplacement indiqué (dossier, SFTP, S3...). Le mot de passe ne peut pas être récupéré s'il est perdu.

## Options

| Option | Rôle |
| --- | --- |
| `-r ‹dépôt›` | emplacement du dépôt (chemin ou sftp:, s3:...) |
| `--repository-version ‹version›` | 1, 2 ou latest |
| `--password-file ‹fichier›` | lit le mot de passe dans un fichier |
| `--password-command ‹commande›` | obtient le mot de passe par une commande |
| ⚠️ `--insecure-no-password` | dépôt sans mot de passe (déconseillé) |
| `--from-repo ‹dépôt›` | dépôt source d'une future copie |
| `--copy-chunker-params` | reprend le découpage du dépôt source |
| `(schémas) sftp: rest: s3: azure: gs: rclone:` | types de dépôts distants |
| `(variables) RESTIC_REPOSITORY RESTIC_PASSWORD_FILE` | évite de répéter -r et le mot de passe |
| `(brew) brew install restic` | installation par Homebrew |

> [!WARNING]
> Options à manier avec précaution : `--insecure-no-password`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Dépôt sur un disque externe**

```zsh
restic init --repo /Volumes/Sauvegarde/restic-repo
```

**Dépôt SFTP**

```zsh
restic init -r sftp:user@hote:/srv/restic-repo
```

**Destination d'une copie**

```zsh
restic init -r ~/restic-copy --from-repo ~/restic-repo --copy-chunker-params
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/restic-init|restic init (Bash)]]
- [[27-commandes/02-powershell/03-archivage-compression/restic-init|restic init (PowerShell)]]

*Mots-clés : restic sauvegarde backup dépôt repository init chiffre mot de passe sftp s3*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
