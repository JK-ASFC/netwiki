---
title: "Remove-LocalGroupMember"
description: "PowerShell — Remove-LocalGroupMember (Comptes / Groupes) : Retire un membre d'un groupe local."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Comptes / Groupes |
| **Commande type** | `Remove-LocalGroupMember -Group Administrateurs -Member jdupont` |

## Rôle

Retire un membre d'un groupe local.

## Options

| Option | Rôle |
| --- | --- |
| `-Group ‹groupe›` | groupe cible |
| `-Member ‹utilisateur›` | compte à retirer |
| `Add-LocalGroupMember` | ajoute |
| `Get-LocalGroupMember` | vérifie |

## Exemples

**Retirer**

```powershell
Remove-LocalGroupMember -Group Administrateurs -Member jdupont
```

**Vérifier**

```powershell
Get-LocalGroupMember Administrateurs
```

**Ajouter (inverse)**

```powershell
Add-LocalGroupMember -Group Administrateurs -Member jdupont
```

*Mots-clés : retirer membre groupe local remove-localgroupmember*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
