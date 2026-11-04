---
title: "restic forget"
description: "Bash — restic forget (Sauvegarde / Rétention) : Retire des instantanés selon une politique de rétention ou un identifiant. N'efface les données qu'avec prune."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde / Rétention |
| **Commande type** | `restic forget --keep-last 3 --dry-run` |

## Rôle

Retire des instantanés selon une politique de rétention ou un identifiant. N'efface les données qu'avec prune.

## Options

| Option | Rôle |
| --- | --- |
| `-r ‹dépôt›` | emplacement du dépôt (chemin ou sftp:, s3:...) |
| `--keep-last ‹n›` | garde les n plus récents |
| `--keep-daily ‹n›` | un par jour sur n jours |
| `--keep-weekly ‹n›` | un par semaine sur n semaines |
| `--keep-monthly ‹n›` | un par mois sur n mois |
| `--keep-yearly ‹n›` | un par an sur n ans |
| `--keep-within ‹durée›` | garde tout ce qui est récent (ex. 30d) |
| `--keep-tag ‹étiquette›` | garde les instantanés étiquetés |
| `--tag ‹étiquette›` | limite la politique à ces étiquettes |
| `--host ‹nom›` | limite la politique à un hôte |
| `--group-by ‹critères›` | groupes de la politique (host,paths) |
| `--dry-run` | montre ce qui serait supprimé, n'efface rien |
| ⚠️ `--prune` | libère ensuite l'espace (irréversible) |
| ⚠️ `--unsafe-allow-remove-all` | autorise à vider un groupe d'instantanés |
| `(un identifiant) forget ‹id›` | supprime cet instantané, sans politique |
| `(code 3) forget partiel` | des instantanés n'ont pas pu être supprimés |

> [!WARNING]
> Options à manier avec précaution : `--prune`, `--unsafe-allow-remove-all`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Simuler une politique**

```bash
restic forget -r /srv/restic-repo --keep-daily 7 --keep-weekly 4 --dry-run
```

**Appliquer et libérer l'espace**

```bash
restic forget -r /srv/restic-repo --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --prune
```

**Garder 30 jours**

```bash
restic forget -r /srv/restic-repo --keep-within 30d --dry-run
```

## Dans les autres shells

- [[27-commandes/02-powershell/03-archivage-compression/restic-forget|restic forget (PowerShell)]]
- [[27-commandes/03-macos/03-archivage-compression/restic-forget|restic forget (macOS)]]

*Mots-clés : restic sauvegarde rétention forget prune supprimer instantané politique keep*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
