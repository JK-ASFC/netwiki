---
title: "Restart-Service"
description: "PowerShell — Restart-Service (Maintenance corrective) : Redémarre un service et ses dépendances."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Maintenance corrective |
| **Commande type** | `Restart-Service -Name Spooler` |

## Rôle

Redémarre un service et ses dépendances.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | service |
| ⚠️ `-Force` | force les dépendances |
| `Start-/Stop-Service` | démarre/arrête |

> [!WARNING]
> Options à manier avec précaution : `-Force`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Redémarrer le spouleur**

```powershell
Restart-Service -Name Spooler
```

*Mots-clés : redémarrer service relancer spouleur restart-service*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
