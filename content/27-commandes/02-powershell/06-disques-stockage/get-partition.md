---
title: "Get-Partition"
description: "PowerShell — Get-Partition (Disques / Partitions) : Liste les partitions des disques."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / Partitions |
| **Commande type** | `Get-Partition` |

## Rôle

Liste les partitions des disques.

## Options

| Option | Rôle |
| --- | --- |
| `-DiskNumber ‹N›` | disque précis |
| `-DriveLetter ‹lettre›` | par lettre |
| `New-Partition` | crée |
| `Resize-Partition` | redimensionne |

## Exemples

**Toutes**

```powershell
Get-Partition
```

**D'un disque**

```powershell
Get-Partition -DiskNumber 0
```

**Une lettre**

```powershell
Get-Partition -DriveLetter C
```

*Mots-clés : partition disque volume lettre get-partition*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
