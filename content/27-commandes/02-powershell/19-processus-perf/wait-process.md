---
title: "Wait-Process"
description: "PowerShell — Wait-Process (Attendre la fin (= wait)) : Attend qu'un ou plusieurs processus se terminent avant de continuer."
tags: [powershell, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Processus & perf |
| **Contexte** | Attendre la fin (= wait) |
| **Commande type** | `Wait-Process -Name setup` |

## Rôle

Attend qu'un ou plusieurs processus se terminent avant de continuer.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | attend la fin des processus de ce nom |
| `-Id ‹PID›` | attend un PID précis |
| `-Timeout ‹N›` | abandonne après N secondes |

## Exemples

**Attendre un installeur**

```powershell
Wait-Process -Name setup
```

**Avec délai max**

```powershell
Wait-Process -Id 1234 -Timeout 60
```

*Mots-clés : wait attendre fin processus wait-process synchroniser script*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
