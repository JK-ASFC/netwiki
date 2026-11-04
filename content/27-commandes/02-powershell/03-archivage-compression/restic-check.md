---
title: "restic check"
description: "PowerShell — restic check (Sauvegarde / Intégrité) : Vérifie la cohérence du dépôt et, avec --read-data, l'intégrité des données sauvegardées."
tags: [powershell, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde / Intégrité |
| **Commande type** | `restic check` |

## Rôle

Vérifie la cohérence du dépôt et, avec --read-data, l'intégrité des données sauvegardées.

## Options

| Option | Rôle |
| --- | --- |
| `-r ‹dépôt›` | emplacement du dépôt (chemin ou sftp:, s3:...) |
| `--read-data` | relit toutes les données (long) |
| `--read-data-subset ‹partie›` | relit une partie : n/t, 10% ou 50M |
| `--with-cache` | réutilise le cache existant |
| `(après prune) restic check` | à lancer après chaque prune |
| `(si erreur) restic repair index` | réparation de l'index endommagé |

## Exemples

**Vérifier la structure**

```powershell
restic check -r D:\restic-repo
```

**Relire 10 % des données**

```powershell
restic check -r D:\restic-repo --read-data-subset=10%
```

**Tout relire (coûteux)**

```powershell
restic check -r D:\restic-repo --read-data
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/restic-check|restic check (Bash)]]
- [[27-commandes/03-macos/03-archivage-compression/restic-check|restic check (macOS)]]

*Mots-clés : restic sauvegarde vérifier intégrité dépôt check erreurs corruption*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
