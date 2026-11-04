---
title: "Stop-Process"
description: "PowerShell — Stop-Process (Arrêter un process (= kill)) : Termine un ou plusieurs processus, par nom ou par PID. L'équivalent de kill/pkill."
tags: [powershell, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Processus & perf |
| **Contexte** | Arrêter un process (= kill) |
| **Commande type** | `Stop-Process -Name notepad -Force` |

## Rôle

Termine un ou plusieurs processus, par nom ou par PID. L'équivalent de kill/pkill.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | tous les processus de ce nom (= pkill) |
| `-Id ‹PID›` | un processus précis (= kill) |
| `-Force` | force l'arrêt sans confirmation |
| `-WhatIf` | simule sans rien tuer |

## Exemples

**Tuer par nom**

```powershell
Stop-Process -Name notepad -Force
```

**Par PID**

```powershell
Stop-Process -Id 4120
```

**Depuis un tri**

```powershell
Get-Process chrome | Stop-Process -Force
```

## Dans les autres shells

- [[27-commandes/02-powershell/26-systeme/stop-process|Stop-Process (PowerShell)]]

*Mots-clés : kill pkill arrêter processus stop-process force terminer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
