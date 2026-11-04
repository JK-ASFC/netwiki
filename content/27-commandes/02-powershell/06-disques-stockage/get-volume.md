---
title: "Get-Volume"
description: "PowerShell — Get-Volume (Gestion du stockage) : Volumes montés (lettre, FS, espace libre)."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Gestion du stockage |
| **Commande type** | `Get-Volume` |

## Rôle

Volumes montés (lettre, FS, espace libre).

## Options

| Option | Rôle |
| --- | --- |
| `(seul)` | tous les volumes |
| `-DriveLetter ‹lettre›` | un volume |
| `Format-Volume` | formate |
| `Optimize-Volume` | defrag/trim |

## Exemples

**Espace libre**

```powershell
Get-Volume
```

**Optimiser (TRIM SSD)**

```powershell
Optimize-Volume -DriveLetter C -ReTrim
```

*Mots-clés : volume disque lettre espace libre système de fichiers get-volume*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
