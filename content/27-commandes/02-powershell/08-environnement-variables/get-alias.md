---
title: "Get-Alias"
description: "PowerShell — Get-Alias (Raccourcis de commandes) : Liste les alias, ou trouve à quoi correspond un alias. Set-Alias en crée. Alias : gal."
tags: [powershell, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Environnement & variables |
| **Contexte** | Raccourcis de commandes |
| **Commande type** | `Get-Alias` |

## Rôle

Liste les alias, ou trouve à quoi correspond un alias. Set-Alias en crée. Alias : gal.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹alias›` | un alias précis |
| `-Definition ‹cmdlet›` | les alias d'une cmdlet |
| `(Set-Alias ‹nom› ‹cmdlet›)` | crée un alias |

## Exemples

**Tous**

```powershell
Get-Alias
```

**À quoi sert ls**

```powershell
Get-Alias ls
```

**Alias de Get-ChildItem**

```powershell
Get-Alias -Definition Get-ChildItem
```

*Mots-clés : get-alias gal alias raccourci commande set-alias correspondance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
