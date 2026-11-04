---
title: "csrutil"
description: "macOS — csrutil (Protection SIP) : Affiche l'état de la protection d'intégrité du système (SIP) — se modifie uniquement en mode Recovery."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Protection SIP |
| **Commande type** | `csrutil status` |

## Rôle

Affiche l'état de la protection d'intégrité du système (SIP) — se modifie uniquement en mode Recovery.

## Options

| Option | Rôle |
| --- | --- |
| `status` | indique si SIP est activé |
| `enable` | active SIP (depuis le mode Recovery uniquement) |
| `disable` | désactive SIP (Recovery uniquement, déconseillé) |

## Exemples

**État de SIP**

```zsh
csrutil status
```

*Mots-clés : sip intégrité système csrutil protection sécurité recovery*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
