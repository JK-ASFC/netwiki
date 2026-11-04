---
title: "Get-Disk"
description: "PowerShell — Get-Disk (Gestion du stockage) : Disques physiques (taille, état, partitionnement)."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Gestion du stockage |
| **Commande type** | `Get-Disk` |

## Rôle

Disques physiques (taille, état, partitionnement).

## Options

| Option | Rôle |
| --- | --- |
| `(seul)` | tous les disques |
| `Initialize-Disk` | initialise |
| `Get-Partition` | partitions |
| `Clear-Disk` | efface |

## Exemples

**Lister**

```powershell
Get-Disk
```

**Partitions d'un disque**

```powershell
Get-Partition -DiskNumber 0
```

*Mots-clés : disque physique stockage partition table get-disk*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
