---
title: "Format-Volume"
description: "PowerShell — Format-Volume (Disques / Formatage) : Formate un volume (DANGER : efface les données)."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / Formatage |
| **Commande type** | `Format-Volume -DriveLetter D -FileSystem NTFS` |

## Rôle

Formate un volume (DANGER : efface les données).

## Options

| Option | Rôle |
| --- | --- |
| `-DriveLetter ‹lettre›` | volume cible |
| `-FileSystem ‹NTFS›` | NTFS / exFAT / FAT32 |
| `-NewFileSystemLabel ‹nom›` | étiquette |
| ⚠️ `-Force` | sans confirmation |

> [!WARNING]
> Options à manier avec précaution : `-Force`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Formater**

```powershell
Format-Volume -DriveLetter D -FileSystem NTFS
```

**Avec étiquette**

```powershell
Format-Volume -DriveLetter D -NewFileSystemLabel Data
```

**En exFAT**

```powershell
Format-Volume -DriveLetter D -FileSystem exFAT
```

*Mots-clés : formater volume système fichiers ntfs danger format-volume*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
