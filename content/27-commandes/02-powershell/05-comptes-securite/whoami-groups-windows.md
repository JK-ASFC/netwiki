---
title: "whoami (groups Windows)"
description: "PowerShell — whoami (groups Windows) (Comptes / Groupes (= groups)) : Affiche les groupes du jeton d'accès de la session courante : nom, type, SID et attributs. Équivalent Windows de groups sans argument."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Comptes / Groupes (= groups) |
| **Commande type** | `whoami /groups` |

## Rôle

Affiche les groupes du jeton d'accès de la session courante : nom, type, SID et attributs. Équivalent Windows de groups sans argument.

## Options

| Option | Rôle |
| --- | --- |
| `/groups` | groupes du jeton d'accès de la session |
| `/user` | compte courant et son SID |
| `/priv` | privilèges du jeton |
| `/all` | tout le jeton : compte, groupes, privilèges |
| `/claims` | revendications (claims) du jeton |
| `/fo ‹format›` | table (défaut), list ou csv |
| `/nh` | sans en-tête (table et csv seulement) |
| `(autre compte local) net user ‹nom›` | « Local Group Memberships » ; /domain pour un compte de domaine |
| `(compte de domaine) Get-ADPrincipalGroupMembership` | voir la fiche Active Directory |
| `(sens inverse) Get-LocalGroupMember ‹groupe›` | membres d'un groupe local |

## Exemples

**Mes groupes**

```powershell
whoami /groups
```

**Version lisible (liste)**

```powershell
whoami /groups /fo list
```

**Un compte local précis**

```powershell
net user jdupont
```

*Mots-clés : groups groupes appartenance jeton token whoami sid uac élévation net user session*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
