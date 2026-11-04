---
title: "Get-GPOReport"
description: "PowerShell — Get-GPOReport (Stratégie de groupe) : Génère un rapport complet (HTML ou XML) des paramètres d'un GPO."
tags: [powershell, commande, gpo]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | GPO |
| **Contexte** | Stratégie de groupe |
| **Commande type** | `Get-GPOReport -Name "Conf" -ReportType Html -Path C:\conf.html` |

## Rôle

Génère un rapport complet (HTML ou XML) des paramètres d'un GPO.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹GPO›` | le GPO |
| `-ReportType ‹Html/Xml›` | format du rapport |
| `-Path ‹fichier›` | fichier de sortie |
| `-All` | rapport de tous les GPO |

## Exemples

**Rapport HTML**

```powershell
Get-GPOReport -Name "Conf" -ReportType Html -Path C:\conf.html
```

**Tous**

```powershell
Get-GPOReport -All -ReportType Html -Path C:\tous.html
```

*Mots-clés : get-gporeport gpo rapport html xml paramètres stratégie audit*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
