---
title: "Get-Member"
description: "PowerShell — Get-Member (Inspecter un objet) : Affiche les propriétés et méthodes d'un objet : le réflexe pour explorer le pipeline. Alias : gm."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Inspecter un objet |
| **Commande type** | `Get-Member` |

## Rôle

Affiche les propriétés et méthodes d'un objet : le réflexe pour explorer le pipeline. Alias : gm.

## Options

| Option | Rôle |
| --- | --- |
| `-MemberType ‹type›` | Property, Method, NoteProperty... |
| `-Name ‹nom›` | un membre précis |
| `-Static` | membres statiques du type |

## Exemples

**Explorer un objet**

```powershell
Get-Process | Get-Member
```

**Propriétés seules**

```powershell
Get-Service | Get-Member -MemberType Property
```

**Type**

```powershell
(Get-Date) | gm
```

*Mots-clés : get-member gm propriétés méthodes objet inspecter type pipeline explorer*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
