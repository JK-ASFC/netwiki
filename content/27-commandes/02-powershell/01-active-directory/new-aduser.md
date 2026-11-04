---
title: "New-ADUser"
description: "PowerShell — New-ADUser (Administration AD) : Crée un compte utilisateur dans l'annuaire."
tags: [powershell, commande, active-directory]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Active Directory |
| **Contexte** | Administration AD |
| **Commande type** | `New-ADUser "jdupont" -Path "OU=IT,DC=corp,DC=lan" -Enabled $true` |

## Rôle

Crée un compte utilisateur dans l'annuaire.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom du compte |
| `-Path ‹DN›` | OU cible |
| `-Enabled ‹$true›` | actif à la création |
| `-AccountPassword ‹mdp›` | mot de passe initial |

## Exemples

**Créer un compte**

```powershell
New-ADUser "jdupont" -Path "OU=IT,DC=corp,DC=lan" -Enabled $true
```

*Mots-clés : créer compte utilisateur ad annuaire new-aduser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
