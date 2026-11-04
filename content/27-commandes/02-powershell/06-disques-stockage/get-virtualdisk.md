---
title: "Get-VirtualDisk"
description: "PowerShell — Get-VirtualDisk (Storage Spaces) : Liste les disques virtuels d'un pool : l'équivalent Windows des volumes logiques (LV) LVM."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Storage Spaces |
| **Commande type** | `Get-VirtualDisk` |

## Rôle

Liste les disques virtuels d'un pool : l'équivalent Windows des volumes logiques (LV) LVM.

## Options

| Option | Rôle |
| --- | --- |
| `-FriendlyName ‹nom›` | cible un disque virtuel précis |
| `\| Get-PhysicalDisk` | montre sur quels disques PHYSIQUES il repose (équivalent de lvs -o +devices) |
| `\| Format-List *` | toutes les propriétés : résilience, taille, état de santé |

## Exemples

**Lister**

```powershell
Get-VirtualDisk
```

**Disques physiques sous-jacents**

```powershell
Get-VirtualDisk -FriendlyName Data | Get-PhysicalDisk
```

**Détail**

```powershell
Get-VirtualDisk | Format-List *
```

*Mots-clés : disque virtuel lv volume logique storage spaces lvm équivalent*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
