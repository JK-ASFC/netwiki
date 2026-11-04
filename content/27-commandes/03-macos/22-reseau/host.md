---
title: "host"
description: "macOS — host (Résolution simple) : Résolution DNS simple et lisible (nom vers IP et inverse)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Résolution simple |
| **Commande type** | `host example.com` |

## Rôle

Résolution DNS simple et lisible (nom vers IP et inverse).

## Options

| Option | Rôle |
| --- | --- |
| `‹nom›` | résout un nom en adresses |
| `‹IP›` | résolution inverse (IP vers nom) |
| `-t ‹type›` | type d'enregistrement (MX, TXT, NS) |

## Exemples

**Résoudre**

```zsh
host example.com
```

**Inverse**

```zsh
host 1.1.1.1
```

*Mots-clés : dns host résolution nom ip simple*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
