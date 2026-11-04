---
title: "Get-Date"
description: "PowerShell — Get-Date (Date & heure) : Renvoie la date/heure courante (objet DateTime), formatable à volonté."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Date & heure |
| **Commande type** | `Get-Date` |

## Rôle

Renvoie la date/heure courante (objet DateTime), formatable à volonté.

## Options

| Option | Rôle |
| --- | --- |
| `-Format ‹modèle›` | format .NET (ex. yyyy-MM-dd HH:mm) |
| `-UFormat ‹%Y...›` | format de type Unix |

## Exemples

**Maintenant**

```powershell
Get-Date
```

**ISO**

```powershell
Get-Date -Format "yyyy-MM-dd HH:mm"
```

**Hier**

```powershell
(Get-Date).AddDays(-1)
```

*Mots-clés : get-date date heure horloge format datetime now jour*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
