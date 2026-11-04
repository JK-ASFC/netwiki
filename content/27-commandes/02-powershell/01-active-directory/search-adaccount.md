---
title: "Search-ADAccount"
description: "PowerShell — Search-ADAccount (Administration AD) : Trouve les comptes verrouillés, expires ou inactifs."
tags: [powershell, commande, active-directory]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Active Directory |
| **Contexte** | Administration AD |
| **Commande type** | `Search-ADAccount -LockedOut` |

## Rôle

Trouve les comptes verrouillés, expires ou inactifs.

## Options

| Option | Rôle |
| --- | --- |
| `-LockedOut` | verrouillés |
| `-AccountExpired` | expires |
| `-AccountInactive` | inactifs |
| `-PasswordExpired` | mdp expiré |

## Exemples

**Comptes verrouillés**

```powershell
Search-ADAccount -LockedOut
```

**Inactifs 90 j**

```powershell
Search-ADAccount -AccountInactive -TimeSpan 90
```

*Mots-clés : compte verrouillé expiré inactif sécurité audit search-adaccount*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
