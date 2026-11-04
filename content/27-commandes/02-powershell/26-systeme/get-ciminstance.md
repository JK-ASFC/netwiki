---
title: "Get-CimInstance"
description: "PowerShell — Get-CimInstance (Inventaire & audit) : Interroge WMI/CIM : OS, matériel, disques."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Inventaire & audit |
| **Commande type** | `Get-CimInstance Win32_OperatingSystem` |

## Rôle

Interroge WMI/CIM : OS, matériel, disques.

## Options

| Option | Rôle |
| --- | --- |
| `Win32_OperatingSystem` | infos OS |
| `Win32_LogicalDisk` | disques |
| `-ClassName ‹classe›` | classe |
| `-Filter ‹requête›` | clause WQL |

## Exemples

**Version OS**

```powershell
Get-CimInstance Win32_OperatingSystem | Select Caption,Version
```

**Espace disque**

```powershell
Get-CimInstance Win32_LogicalDisk | Select DeviceID,FreeSpace
```

*Mots-clés : wmi cim système matériel os bios disque info hardware get-ciminstance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
