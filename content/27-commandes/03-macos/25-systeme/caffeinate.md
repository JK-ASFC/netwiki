---
title: "caffeinate"
description: "macOS — caffeinate (Empêcher la veille) : Empêche la mise en veille pendant une commande ou une durée."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Empêcher la veille |
| **Commande type** | `caffeinate -d` |

## Rôle

Empêche la mise en veille pendant une commande ou une durée.

## Options

| Option | Rôle |
| --- | --- |
| `-d` | empêche la veille de l'écran |
| `-i` | empêche la veille système (inactivité) |
| `-m` | empêche la veille du disque |
| `-s` | empêche la veille sur secteur |
| `-t ‹secondes›` | durée en secondes |
| `-u` | simule une activité utilisateur |
| `-w ‹PID›` | reste actif tant que ce PID vit |

## Exemples

**Garder éveillé pendant une commande**

```zsh
caffeinate -i ./long_traitement.sh
```

**Empêcher la veille 1 h**

```zsh
caffeinate -t 3600
```

**Écran allumé pendant un téléchargement**

```zsh
caffeinate -d curl -O https://exemple/gros.iso
```

*Mots-clés : veille empêcher caffeinate sleep maintenir eveille*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
