---
title: "Get-Command"
description: "PowerShell — Get-Command (Localiser une commande) : Trouve les commandes disponibles (cmdlets, fonctions, alias, exes). Équivaut à which/type. Alias : gcm."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Localiser une commande |
| **Commande type** | `Get-Command` |

## Rôle

Trouve les commandes disponibles (cmdlets, fonctions, alias, exes). Équivaut à which/type. Alias : gcm.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | par nom (jokers acceptés) |
| `-CommandType ‹type›` | Cmdlet, Function, Alias, Application |
| `-Module ‹module›` | d'un module précis |

## Exemples

**Localiser**

```powershell
Get-Command notepad
```

**Tous les Get-**

```powershell
Get-Command Get-*
```

**Derrière un alias**

```powershell
Get-Command ls
```

*Mots-clés : get-command gcm which localiser cmdlet alias commande chercher type*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
