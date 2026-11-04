---
title: "Get-Process"
description: "PowerShell — Get-Process (Processus (= ps / top)) : Liste les processus et leur consommation. L'équivalent de ps et top ; trié, il montre les plus gourmands."
tags: [powershell, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Processus & perf |
| **Contexte** | Processus (= ps / top) |
| **Commande type** | `Get-Process \| Sort CPU -Descending \| Select -First 10` |

## Rôle

Liste les processus et leur consommation. L'équivalent de ps et top ; trié, il montre les plus gourmands.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | filtre par nom (= pgrep) |
| `-Id ‹PID›` | cible un PID précis |
| `\| Sort CPU -Descending` | trie par CPU décroissant (= top) |
| `\| Sort WS -Descending` | trie par mémoire de travail |
| `\| Select -First ‹N›` | garde les N premiers |

## Exemples

**Top 10 CPU**

```powershell
Get-Process | Sort CPU -Descending | Select -First 10
```

**Un process par nom**

```powershell
Get-Process -Name chrome
```

**Gros consommateurs mémoire**

```powershell
Get-Process | Sort WS -Descending | Select -First 5 Name,WS
```

## Dans les autres shells

- [[27-commandes/02-powershell/26-systeme/get-process|Get-Process (PowerShell)]]

*Mots-clés : processus ps top htop cpu mémoire get-process trier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
