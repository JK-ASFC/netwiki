---
title: "Get-LocalUser"
description: "PowerShell — Get-LocalUser (Administration des comptes) : Comptes locaux de la machine."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Administration des comptes |
| **Commande type** | `Get-LocalUser` |

## Rôle

Comptes locaux de la machine.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | un compte |
| `New-LocalUser` | crée |
| `Enable-/Disable-LocalUser` | active/désactive |

## Exemples

**Lister**

```powershell
Get-LocalUser
```

**Comptes actives**

```powershell
Get-LocalUser | Where Enabled
```

*Mots-clés : utilisateur compte local windows get-localuser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
