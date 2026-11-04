---
title: "Get-GPO"
description: "PowerShell — Get-GPO (Stratégie de groupe) : Liste les GPO du domaine, ou en affiche un précis."
tags: [powershell, commande, gpo]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | GPO |
| **Contexte** | Stratégie de groupe |
| **Commande type** | `Get-GPO -All` |

## Rôle

Liste les GPO du domaine, ou en affiche un précis.

## Options

| Option | Rôle |
| --- | --- |
| `-All` | tous les GPO du domaine |
| `-Name ‹nom›` | un GPO par son nom |
| `-Guid ‹guid›` | par identifiant |

## Exemples

**Tous**

```powershell
Get-GPO -All
```

**Un précis**

```powershell
Get-GPO -Name "Sécurité Postes"
```

*Mots-clés : get-gpo gpo lister stratégie groupe domaine policy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
