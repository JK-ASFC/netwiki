---
title: "Get-AzResourceGroup"
description: "PowerShell — Get-AzResourceGroup (Azure / Ressources) : Liste, crée ou cible des groupes de ressources."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / Ressources |
| **Commande type** | `Get-AzResourceGroup` |

## Rôle

Liste, crée ou cible des groupes de ressources.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | un groupe précis |
| `-Location ‹région›` | filtre par région |
| `New-AzResourceGroup` | crée |
| `Remove-AzResourceGroup` | supprime |

## Exemples

**Tout lister**

```powershell
Get-AzResourceGroup
```

**Un groupe**

```powershell
Get-AzResourceGroup -Name rg-prod
```

**Créer un groupe**

```powershell
New-AzResourceGroup -Name rg-prod -Location westeurope
```

*Mots-clés : groupe ressources resource group région azure get-azresourcegroup*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
