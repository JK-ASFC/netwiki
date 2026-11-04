---
title: "Set-LocalUser"
description: "PowerShell — Set-LocalUser (Comptes / Modification) : Modifie un compte local existant."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Comptes / Modification |
| **Commande type** | `Set-LocalUser jdupont -PasswordNeverExpires $true` |

## Rôle

Modifie un compte local existant.

## Options

| Option | Rôle |
| --- | --- |
| `-Password ‹mdp›` | nouveau mot de passe |
| `-PasswordNeverExpires` | expiration du mot de passe |
| `-Description ‹texte›` | description |
| `-AccountExpires ‹date›` | date d'expiration : un DateTime PowerShell, ex (Get-Date).AddDays(90) ; -Never pour aucune |

## Exemples

**Mot de passe jamais expiré**

```powershell
Set-LocalUser jdupont -PasswordNeverExpires $true
```

**Changer le mdp**

```powershell
Set-LocalUser jdupont -Password (Read-Host -AsSecureString)
```

**Description**

```powershell
Set-LocalUser jdupont -Description "Compte IT"
```

*Mots-clés : modifier compte local mot de passe set-localuser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
