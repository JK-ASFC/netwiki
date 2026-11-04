---
title: "Get-Variable"
description: "PowerShell — Get-Variable (Environnement / Variables PS) : Liste les variables de la session PowerShell."
tags: [powershell, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Variables PS |
| **Commande type** | `Get-Variable` |

## Rôle

Liste les variables de la session PowerShell.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | une variable |
| `-Scope ‹portée›` | portée (Global, Local) |
| `Set-Variable` | définit |
| `Remove-Variable` | supprime |

## Exemples

**Toutes**

```powershell
Get-Variable
```

**Une variable**

```powershell
Get-Variable PSVersionTable
```

**Filtrer**

```powershell
Get-Variable | Where-Object Name -like "Pref*"
```

*Mots-clés : variables session powershell lister get-variable*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
