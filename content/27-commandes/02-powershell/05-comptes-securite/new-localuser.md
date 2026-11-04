---
title: "New-LocalUser"
description: "PowerShell — New-LocalUser (Administration des comptes) : Crée un compte local."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Administration des comptes |
| **Commande type** | `New-LocalUser "ops" -Description "Compte ops"` |

## Rôle

Crée un compte local.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom |
| `-Password ‹mdp›` | mot de passe (SecureString) |
| `-NoPassword` | sans |
| `-Description ‹texte›` | description |

## Exemples

**Créer**

```powershell
New-LocalUser "ops" -Description "Compte ops"
```

*Mots-clés : créer utilisateur compte local new-localuser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
