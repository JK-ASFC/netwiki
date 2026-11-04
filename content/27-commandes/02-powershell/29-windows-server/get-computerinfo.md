---
title: "Get-ComputerInfo"
description: "PowerShell — Get-ComputerInfo (Inventaire serveur) : Inventaire complet : système d'exploitation, version Windows, matériel, BIOS."
tags: [powershell, commande, windows-server]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Windows Server |
| **Contexte** | Inventaire serveur |
| **Commande type** | `Get-ComputerInfo` |

## Rôle

Inventaire complet : système d'exploitation, version Windows, matériel, BIOS.

## Options

| Option | Rôle |
| --- | --- |
| `-Property ‹motif›` | limite aux propriétés voulues |

## Exemples

**Tout**

```powershell
Get-ComputerInfo
```

**Version de l'OS**

```powershell
Get-ComputerInfo -Property "OsName","OsVersion"
```

**Infos Windows**

```powershell
Get-ComputerInfo Os*
```

*Mots-clés : get-computerinfo inventaire système serveur os version matériel bios 2025*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
