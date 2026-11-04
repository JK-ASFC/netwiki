---
title: "Get-ADGroupMember"
description: "PowerShell — Get-ADGroupMember (Administration AD) : Liste les membres d'un groupe de sécurité AD."
tags: [powershell, commande, active-directory]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Active Directory |
| **Contexte** | Administration AD |
| **Commande type** | `Get-ADGroupMember "Domain Admins"` |

## Rôle

Liste les membres d'un groupe de sécurité AD.

## Options

| Option | Rôle |
| --- | --- |
| `-Identity ‹groupe›` | groupe |
| `-Recursive` | groupes imbriqués |
| `Add-ADGroupMember` | ajoute |
| `Remove-ADGroupMember` | retire |

## Exemples

**Membres d'un groupe**

```powershell
Get-ADGroupMember "Domain Admins"
```

**Avec imbrication**

```powershell
Get-ADGroupMember "GG_IT" -Recursive
```

*Mots-clés : groupe membre domain admins ad get-adgroupmember*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
