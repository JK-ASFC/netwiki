---
title: "Unlock-ADAccount"
description: "PowerShell — Unlock-ADAccount (Administration AD) : Deverrouille un compte / réinitialise un mot de passe."
tags: [powershell, commande, active-directory]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Active Directory |
| **Contexte** | Administration AD |
| **Commande type** | `Unlock-ADAccount jdupont` |

## Rôle

Deverrouille un compte / réinitialise un mot de passe.

## Options

| Option | Rôle |
| --- | --- |
| `Unlock-ADAccount` | deverrouille |
| `Set-ADAccountPassword` | change le mdp |
| `-Reset` | réinitialisation |
| `Enable-ADAccount` | réactive |

## Exemples

**Déverrouiller**

```powershell
Unlock-ADAccount jdupont
```

**Réinitialiser le mdp**

```powershell
Set-ADAccountPassword jdupont -Reset
```

*Mots-clés : déverrouiller réinitialiser mot de passe compte ad unlock-adaccount*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
