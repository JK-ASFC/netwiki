---
title: "Get-StoragePool"
description: "PowerShell — Get-StoragePool (Storage Spaces) : Liste les pools de stockage : l'équivalent Windows d'un groupe de volumes (VG) LVM."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Storage Spaces |
| **Commande type** | `Get-StoragePool` |

## Rôle

Liste les pools de stockage : l'équivalent Windows d'un groupe de volumes (VG) LVM.

## Options

| Option | Rôle |
| --- | --- |
| `-FriendlyName ‹nom›` | filtre sur le nom convivial du pool |
| `-IsPrimordial $false` | masque le pool primordial (les disques non encore attribués) |
| `\| Format-List *` | affiche toutes les propriétés du pool |

## Exemples

**Lister**

```powershell
Get-StoragePool
```

**Pools réels**

```powershell
Get-StoragePool -IsPrimordial $false
```

**Détail**

```powershell
Get-StoragePool -FriendlyName Pool1 | Format-List *
```

*Mots-clés : pool stockage storage spaces vg groupe volumes lvm équivalent*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
