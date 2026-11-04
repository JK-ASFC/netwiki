---
title: "Get-ADComputer"
description: "PowerShell — Get-ADComputer (Administration AD) : Interroge les comptes machines du domaine."
tags: [powershell, commande, active-directory]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Active Directory |
| **Contexte** | Administration AD |
| **Commande type** | `Get-ADComputer -Filter * -SearchBase "OU=PC,DC=corp,DC=lan"` |

## Rôle

Interroge les comptes machines du domaine.

## Options

| Option | Rôle |
| --- | --- |
| `-Filter *` | tous |
| `-Identity ‹nom›` | une machine |
| `-SearchBase ‹DN›` | OU |
| `-Properties ‹propriétés›` | OS, lastLogon |

## Exemples

**Postes d'une OU**

```powershell
Get-ADComputer -Filter * -SearchBase "OU=PC,DC=corp,DC=lan"
```

**OS des machines**

```powershell
Get-ADComputer -Filter * -Properties OperatingSystem | Select Name,OperatingSystem
```

*Mots-clés : ordinateur machine poste domaine ad get-adcomputer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
