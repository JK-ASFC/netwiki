---
title: "Get-ScheduledTask"
description: "PowerShell — Get-ScheduledTask (Automatisation / Planification) : Tâches planifiées (équivalent cron Windows)."
tags: [powershell, commande, services-taches]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Services & tâches |
| **Contexte** | Automatisation / Planification |
| **Commande type** | `Get-ScheduledTask \| Where State -eq Ready` |

## Rôle

Tâches planifiées (équivalent cron Windows).

## Options

| Option | Rôle |
| --- | --- |
| `\| Where State` | filtre |
| `-TaskName ‹nom›` | une tâche |
| `Start-ScheduledTask` | lance |
| `Disable-ScheduledTask` | désactive |

## Exemples

**Tâches prêtes**

```powershell
Get-ScheduledTask | Where State -eq Ready
```

*Mots-clés : tâche planifiée scheduler automatisation cron get-scheduledtask*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
