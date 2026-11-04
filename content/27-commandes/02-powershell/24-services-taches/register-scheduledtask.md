---
title: "Register-ScheduledTask"
description: "PowerShell — Register-ScheduledTask (Automatisation / Planification) : Crée une tâche planifiée (déclencheur + action)."
tags: [powershell, commande, services-taches]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Services & tâches |
| **Contexte** | Automatisation / Planification |
| **Commande type** | `Register-ScheduledTask -TaskName "Backup" -Trigger $t -Action $a` |

## Rôle

Crée une tâche planifiée (déclencheur + action).

## Options

| Option | Rôle |
| --- | --- |
| `-TaskName ‹nom›` | nom |
| `-Trigger ‹déclencheur›` | quand |
| `-Action ‹action›` | quoi |
| `-User ‹utilisateur›` | compte |

## Exemples

**Backup quotidien**

```powershell
$t=New-ScheduledTaskTrigger -Daily -At 3am; Register-ScheduledTask -TaskName Backup -Trigger $t -Action (New-ScheduledTaskAction -Execute backup.ps1)
```

*Mots-clés : créer tâche planifiée scheduler automatisation register-scheduledtask*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
