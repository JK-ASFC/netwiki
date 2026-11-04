---
title: "Get-AzVM"
description: "PowerShell — Get-AzVM (Azure / Compute) : Liste et contrôle les machines virtuelles."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / Compute |
| **Commande type** | `Get-AzVM -ResourceGroupName rg-prod` |

## Rôle

Liste et contrôle les machines virtuelles.

## Options

| Option | Rôle |
| --- | --- |
| `-ResourceGroupName ‹groupe›` | limite à un groupe |
| `-Name ‹nom›` | une VM |
| `-Status` | état d'exécution |
| `Start-AzVM` | démarre / Stop-AzVM→arrête |

## Exemples

**Toutes les VM**

```powershell
Get-AzVM
```

**D'un groupe**

```powershell
Get-AzVM -ResourceGroupName rg-prod
```

**Avec l'état**

```powershell
Get-AzVM -ResourceGroupName rg-prod -Status
```

*Mots-clés : machine virtuelle vm compute état azure get-azvm*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
