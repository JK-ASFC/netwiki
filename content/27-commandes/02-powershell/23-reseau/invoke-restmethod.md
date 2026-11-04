---
title: "Invoke-RestMethod"
description: "PowerShell — Invoke-RestMethod (Tests d'API / Web) : Appel d'API : parse le JSON en objet. Alias : irm."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Tests d'API / Web |
| **Commande type** | `Invoke-RestMethod https://api.site -Method Post` |

## Rôle

Appel d'API : parse le JSON en objet. Alias : irm.

## Options

| Option | Rôle |
| --- | --- |
| `-Uri ‹url›` | endpoint |
| `-Method ‹GET›` | verbe |
| `-Headers @{}` | en-têtes |
| `-Body ‹données›` | charge utile |
| `-ContentType` | type |

## Exemples

**GET JSON**

```powershell
Invoke-RestMethod https://api.github.com/users/torvalds
```

**Avec token**

```powershell
Invoke-RestMethod https://api.site -Headers @{Authorization="Bearer $t"}
```

*Mots-clés : api rest json requête appel endpoint bearer irm invoke-restmethod*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
