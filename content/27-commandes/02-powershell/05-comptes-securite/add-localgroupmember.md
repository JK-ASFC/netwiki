---
title: "Add-LocalGroupMember"
description: "PowerShell — Add-LocalGroupMember (Administration des comptes) : Ajoute un compte à un groupe local."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Administration des comptes |
| **Commande type** | `Add-LocalGroupMember -Group Administrators -Member ops` |

## Rôle

Ajoute un compte à un groupe local.

## Options

| Option | Rôle |
| --- | --- |
| `-Group ‹groupe›` | groupe |
| `-Member ‹utilisateur›` | compte |
| `Get-LocalGroupMember` | liste |
| `Remove-LocalGroupMember` | retire |

## Exemples

**Droits admin**

```powershell
Add-LocalGroupMember -Group Administrators -Member ops
```

**Membres d'un groupe**

```powershell
Get-LocalGroupMember Administrators
```

*Mots-clés : groupe membre administrateurs ajouter add-localgroupmember*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
