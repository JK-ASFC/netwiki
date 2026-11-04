---
title: "Get-Service"
description: "PowerShell — Get-Service (Supervision système) : État des services Windows."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Supervision système |
| **Commande type** | `Get-Service \| Where-Object Status -eq Running` |

## Rôle

État des services Windows.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | par nom |
| `-DisplayName ‹nom affiche›` | nom affiche |
| `\| Where-Object` | filtre |
| `-DependentServices` | dépendances |

## Exemples

**Auto mais arrêtés**

```powershell
Get-Service | Where StartType -eq Automatic | Where Status -ne Running
```

**Préfixe**

```powershell
Get-Service Win*
```

*Mots-clés : service démarrer arrêter état windows running get-service*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
