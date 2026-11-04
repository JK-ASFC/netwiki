---
title: "New-LocalGroup"
description: "PowerShell — New-LocalGroup (Comptes / Groupes) : Crée un groupe local."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Comptes / Groupes |
| **Commande type** | `New-LocalGroup "Developpeurs"` |

## Rôle

Crée un groupe local.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom du groupe |
| `-Description ‹texte›` | description |
| `Remove-LocalGroup` | supprime |
| `Get-LocalGroup` | liste |

## Exemples

**Créer**

```powershell
New-LocalGroup "Developpeurs"
```

**Avec description**

```powershell
New-LocalGroup "IT" -Description "Equipe IT"
```

**Vérifier**

```powershell
Get-LocalGroup
```

*Mots-clés : créer groupe local new-localgroup*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
