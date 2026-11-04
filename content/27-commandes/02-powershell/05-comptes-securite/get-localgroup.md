---
title: "Get-LocalGroup"
description: "PowerShell — Get-LocalGroup (Comptes / Groupes) : Liste les groupes locaux (et leurs membres via Get-LocalGroupMember)."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Comptes / Groupes |
| **Commande type** | `Get-LocalGroup` |

## Rôle

Liste les groupes locaux (et leurs membres via Get-LocalGroupMember).

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹groupe›` | un groupe |
| `Get-LocalGroupMember` | les membres |
| `Add-LocalGroupMember` | ajoute |
| `(sans arg)` | tous les groupes |

## Exemples

**Tous**

```powershell
Get-LocalGroup
```

**Membres d'un groupe**

```powershell
Get-LocalGroupMember Administrateurs
```

**Un groupe**

```powershell
Get-LocalGroup "Developpeurs"
```

*Mots-clés : groupe local membres lister get-localgroup*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
