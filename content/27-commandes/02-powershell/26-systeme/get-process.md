---
title: "Get-Process"
description: "PowerShell — Get-Process (Diagnostic de performance) : Liste les processus. Alias : ps, gps."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Diagnostic de performance |
| **Commande type** | `Get-Process \| Sort-Object CPU -Descending \| Select -First 10` |

## Rôle

Liste les processus. Alias : ps, gps.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | par nom |
| `-Id ‹PID›` | par PID |
| `-IncludeUserName` | propriétaire |
| `\| Sort-Object` | trie |

## Exemples

**Top 10 mémoire**

```powershell
Get-Process | Sort-Object WS -Descending | Select -First 10
```

**Un process**

```powershell
Get-Process -Name chrome
```

## Dans les autres shells

- [[27-commandes/02-powershell/19-processus-perf/get-process|Get-Process (PowerShell)]]

*Mots-clés : processus cpu mémoire pid tâche ps get-process*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
