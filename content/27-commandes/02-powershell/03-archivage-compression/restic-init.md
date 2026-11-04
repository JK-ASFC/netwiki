---
title: "restic init"
description: "PowerShell — restic init (Sauvegarde / Dépôt) : Crée un dépôt restic chiffré à l'emplacement indiqué (dossier, SFTP, S3...). Le mot de passe ne peut pas être récupéré s'il est perdu."
tags: [powershell, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde / Dépôt |
| **Commande type** | `restic init --repo D:\restic-repo` |

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
| `(winget) winget install --exact --id restic.restic --scope Machine` | installation pour tous les utilisateurs |
| `(scoop) scoop install restic` | installation par Scoop |
| `(MSYS2) winpty restic init` | l'invite de mot de passe échoue sous Mintty |

> [!WARNING]
> Options à manier avec précaution : `--insecure-no-password`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Dépôt sur un autre disque**

```powershell
restic init --repo D:\restic-repo
```

**Dépôt SFTP**

```powershell
restic init -r sftp:user@hote:/srv/restic-repo
```

**Destination d'une copie**

```powershell
restic init -r D:\restic-copy --from-repo D:\restic-repo --copy-chunker-params
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/restic-init|restic init (Bash)]]
- [[27-commandes/03-macos/03-archivage-compression/restic-init|restic init (macOS)]]

*Mots-clés : restic sauvegarde backup dépôt repository init chiffre mot de passe sftp s3*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
