---
title: "Get-ADUser"
description: "PowerShell — Get-ADUser (Administration AD) : Interroge les comptes Active Directory (module RSAT)."
tags: [powershell, commande, active-directory]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Active Directory |
| **Contexte** | Administration AD |
| **Commande type** | `Get-ADUser -Filter * -SearchBase "OU=IT,DC=corp,DC=lan"` |

## Rôle

Interroge les comptes Active Directory (module RSAT).

## Options

| Option | Rôle |
| --- | --- |
| `-Filter *` | tous (obligatoire) |
| `-Identity ‹utilisateur›` | un compte |
| `-SearchBase ‹DN›` | OU de départ |
| `-Properties ‹propriétés›` | attributs supplémentaires |

## Exemples

**Comptes d'une OU**

```powershell
Get-ADUser -Filter * -SearchBase "OU=IT,DC=corp,DC=lan"
```

**Un compte détaillé**

```powershell
Get-ADUser jdupont -Properties *
```

*Mots-clés : active directory ad utilisateur compte annuaire domaine get-aduser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
