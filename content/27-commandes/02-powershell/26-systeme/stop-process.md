---
title: "Stop-Process"
description: "PowerShell — Stop-Process (Résolution d'incidents) : Termine un processus. Alias : kill."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Résolution d'incidents |
| **Commande type** | `Stop-Process -Name notepad -Force` |

## Rôle

Termine un processus. Alias : kill.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | par nom |
| `-Id ‹PID›` | par PID |
| ⚠️ `-Force` | sans confirmation |

> [!WARNING]
> Options à manier avec précaution : `-Force`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Par nom**

```powershell
Stop-Process -Name notepad -Force
```

**Via le pipe**

```powershell
Get-Process chrome | Stop-Process
```

## Dans les autres shells

- [[27-commandes/02-powershell/19-processus-perf/stop-process|Stop-Process (PowerShell)]]

*Mots-clés : tuer arrêter processus forcer kill stop-process*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
