---
title: "Get-Uptime"
description: "PowerShell — Get-Uptime (Disponibilité (= uptime)) : Depuis quand la machine tourne. L'équivalent d'uptime (PowerShell 6+ ; sinon via CIM)."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Disponibilité (= uptime) |
| **Commande type** | `Get-Uptime` |

## Rôle

Depuis quand la machine tourne. L'équivalent d'uptime (PowerShell 6+ ; sinon via CIM).

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | durée depuis le dernier démarrage |
| `-Since` | date et heure du dernier démarrage |

## Exemples

**Durée**

```powershell
Get-Uptime
```

**Depuis quand**

```powershell
Get-Uptime -Since
```

**Compatible ancien PS**

```powershell
(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
```

*Mots-clés : uptime disponibilité démarrage durée get-uptime lastbootuptime*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
