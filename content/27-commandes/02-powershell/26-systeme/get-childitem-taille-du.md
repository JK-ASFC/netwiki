---
title: "Get-ChildItem (taille = du)"
description: "PowerShell — Get-ChildItem (taille = du) (Taille d'un dossier (= du)) : Calcule la place occupée par un dossier. L'équivalent de du, via Measure-Object."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Taille d'un dossier (= du) |
| **Commande type** | `Get-ChildItem -Recurse \| Measure-Object Length -Sum` |

## Rôle

Calcule la place occupée par un dossier. L'équivalent de du, via Measure-Object.

## Options

| Option | Rôle |
| --- | --- |
| `-Recurse` | descend dans les sous-dossiers |
| `\| Measure-Object Length -Sum` | additionne les tailles |
| `.Sum / 1GB` | convertit le total en Gio |

## Exemples

**Taille d'un dossier**

```powershell
(Get-ChildItem C:\logs -Recurse | Measure-Object Length -Sum).Sum
```

**En Go**

```powershell
'{0:N2} Go' -f ((Get-ChildItem . -Recurse | Measure Length -Sum).Sum/1GB)
```

*Mots-clés : du taille dossier espace occupe get-childitem measure-object somme*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
