---
title: "Start-Sleep"
description: "PowerShell — Start-Sleep (Pause (= sleep)) : Met le script en pause pendant une durée. L'équivalent de sleep."
tags: [powershell, commande, processus-perf]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Processus & perf |
| **Contexte** | Pause (= sleep) |
| **Commande type** | `Start-Sleep -Seconds 5` |

## Rôle

Met le script en pause pendant une durée. L'équivalent de sleep.

## Options

| Option | Rôle |
| --- | --- |
| `-Seconds ‹N›` | pause de N secondes |
| `-Milliseconds ‹N›` | pause en millisecondes |

## Exemples

**Cinq secondes**

```powershell
Start-Sleep -Seconds 5
```

**Demi-seconde**

```powershell
Start-Sleep -Milliseconds 500
```

*Mots-clés : sleep pause attendre délai start-sleep temporisation script*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
