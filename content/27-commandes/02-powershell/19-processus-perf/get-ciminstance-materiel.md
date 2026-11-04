---
title: "Get-CimInstance (matériel)"
description: "PowerShell — Get-CimInstance (matériel) (Inventaire (= lscpu/free)) : Interroge WMI/CIM pour le matériel : CPU (= lscpu), mémoire, disques. Source d'inventaire détaillée."
tags: [powershell, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Processus & perf |
| **Contexte** | Inventaire (= lscpu/free) |
| **Commande type** | `Get-CimInstance Win32_Processor` |

## Rôle

Interroge WMI/CIM pour le matériel : CPU (= lscpu), mémoire, disques. Source d'inventaire détaillée.

## Options

| Option | Rôle |
| --- | --- |
| `Win32_Processor` | détails du/des processeur(s) (= lscpu) |
| `Win32_OperatingSystem` | OS, mémoire libre/totale, uptime |
| `Win32_LogicalDisk` | disques logiques et espace libre (= df) |
| `Win32_PhysicalMemory` | barrettes de mémoire installées |

## Exemples

**Infos CPU**

```powershell
Get-CimInstance Win32_Processor | Select Name,NumberOfCores,NumberOfLogicalProcessors
```

**Mémoire libre**

```powershell
Get-CimInstance Win32_OperatingSystem | Select FreePhysicalMemory
```

**Espace disque**

```powershell
Get-CimInstance Win32_LogicalDisk | Select DeviceID,FreeSpace,Size
```

*Mots-clés : lscpu cpu matériel mémoire cim wmi inventaire processeur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
