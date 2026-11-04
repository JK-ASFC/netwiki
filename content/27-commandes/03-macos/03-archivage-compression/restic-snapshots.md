---
title: "restic snapshots"
description: "macOS — restic snapshots (Sauvegarde / Consultation) : Liste les instantanés d'un dépôt : identifiant, date, hôte, étiquettes et chemins sauvegardés."
tags: [macos, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde / Consultation |
| **Commande type** | `restic snapshots` |

## Rôle

Liste les instantanés d'un dépôt : identifiant, date, hôte, étiquettes et chemins sauvegardés.

## Options

| Option | Rôle |
| --- | --- |
| `-r ‹dépôt›` | emplacement du dépôt (chemin ou sftp:, s3:...) |
| `--host ‹nom›` | instantanés d'un hôte |
| `--path ‹chemin›` | instantanés contenant ce chemin absolu |
| `--tag ‹étiquette›` | instantanés portant ces étiquettes |
| `--group-by ‹critères›` | regroupe par host, paths et/ou tags |
| `--latest ‹n›` | les n derniers par hôte et chemin |
| `--compact` | affichage condensé |
| `--json` | sortie JSON, pour les scripts |

## Exemples

**Tous les instantanés**

```zsh
restic snapshots -r /Volumes/Sauvegarde/restic-repo
```

**Les 3 derniers par hôte et chemin**

```zsh
restic snapshots -r /Volumes/Sauvegarde/restic-repo --latest 3
```

**Exploiter en JSON**

```zsh
restic snapshots -r /Volumes/Sauvegarde/restic-repo --json | jq .
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/restic-snapshots|restic snapshots (Bash)]]
- [[27-commandes/02-powershell/03-archivage-compression/restic-snapshots|restic snapshots (PowerShell)]]

*Mots-clés : restic sauvegarde instantané snapshot lister historique*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
