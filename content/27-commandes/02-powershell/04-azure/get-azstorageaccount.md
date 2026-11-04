---
title: "Get-AzStorageAccount"
description: "PowerShell — Get-AzStorageAccount (Azure / Stockage) : Liste les comptes de stockage."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / Stockage |
| **Commande type** | `Get-AzStorageAccount -ResourceGroupName rg-prod` |

## Rôle

Liste les comptes de stockage.

## Options

| Option | Rôle |
| --- | --- |
| `-ResourceGroupName ‹groupe›` | limite à un groupe |
| `-Name ‹nom›` | un compte |
| `New-AzStorageAccount` | crée |
| `-SkuName ‹sku›` | niveau de redondance |

## Exemples

**Tous**

```powershell
Get-AzStorageAccount
```

**D'un groupe**

```powershell
Get-AzStorageAccount -ResourceGroupName rg-prod
```

**Un compte**

```powershell
Get-AzStorageAccount -ResourceGroupName rg-prod -Name stprod
```

*Mots-clés : stockage storage account blob redondance azure get-azstorageaccount*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
