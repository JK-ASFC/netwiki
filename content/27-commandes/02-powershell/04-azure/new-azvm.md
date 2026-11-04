---
title: "New-AzVM"
description: "PowerShell — New-AzVM (Azure / Provisioning) : Crée et déploie une machine virtuelle."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / Provisioning |
| **Commande type** | `New-AzVM -ResourceGroupName rg-prod -Name vm01 -Image Ubuntu2204` |

## Rôle

Crée et déploie une machine virtuelle.

## Options

| Option | Rôle |
| --- | --- |
| `-ResourceGroupName ‹groupe›` | groupe cible |
| `-Name ‹nom›` | nom de la VM |
| `-Image ‹image›` | image source |
| `-Size ‹taille›` | taille (SKU) |

## Exemples

**Création simple**

```powershell
New-AzVM -ResourceGroupName rg-prod -Name vm01 -Image Ubuntu2204
```

**Taille précise**

```powershell
New-AzVM -ResourceGroupName rg-prod -Name vm01 -Size Standard_B2s -Image Ubuntu2204
```

**Démarrer ensuite**

```powershell
Start-AzVM -ResourceGroupName rg-prod -Name vm01
```

*Mots-clés : créer déployer machine virtuelle vm image taille azure new-azvm*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
