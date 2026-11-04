---
title: "Get-AzSubscription"
description: "PowerShell — Get-AzSubscription (Azure / Abonnements) : Liste les abonnements accessibles et bascule de contexte."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / Abonnements |
| **Commande type** | `Get-AzSubscription` |

## Rôle

Liste les abonnements accessibles et bascule de contexte.

## Options

| Option | Rôle |
| --- | --- |
| `-SubscriptionName ‹nom›` | filtre par nom |
| `-TenantId ‹id›` | filtre par tenant |
| `Set-AzContext` | bascule de contexte |
| `-SubscriptionId ‹id›` | par identifiant |

## Exemples

**Lister**

```powershell
Get-AzSubscription
```

**Filtrer par tenant**

```powershell
Get-AzSubscription -TenantId 00000000-0000-0000-0000-000000000000
```

**Basculer de contexte**

```powershell
Set-AzContext -Subscription Prod
```

*Mots-clés : abonnement subscription contexte tenant azure get-azsubscription*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
