---
title: "sfc"
description: "PowerShell — sfc (Maintenance corrective) : Vérifie/répare les fichiers système Windows."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Maintenance corrective |
| **Commande type** | `sfc /scannow` |

## Rôle

Vérifie/répare les fichiers système Windows.

## Options

| Option | Rôle |
| --- | --- |
| `/scannow` | analyse + répare |
| `/verifyonly` | vérifie sans réparer |

## Exemples

**Réparer le système**

```powershell
sfc /scannow
```

*Mots-clés : réparer fichiers système corruption intégrité sfc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
