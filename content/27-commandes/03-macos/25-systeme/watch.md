---
title: "watch"
description: "macOS — watch (Répéter une commande) : Répète une commande à intervalle régulier (à installer via brew : brew install watch)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Répéter une commande |
| **Commande type** | `watch -n 2 df -h` |

## Rôle

Répète une commande à intervalle régulier (à installer via brew : brew install watch).

## En détail

Répète une commande à intervalle régulier et affiche le résultat qui se met à jour. Pratique pour surveiller quelque chose en direct (espace disque, processus).

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹secondes›` | intervalle entre deux exécutions |
| `-d` | surligne les différences |
| `-t` | masque l'en-tête |

## Exemples

**Surveiller l'espace disque**

```zsh
watch -n 5 df -h
```

**Suivre des processus**

```zsh
watch -n 2 'ps aux | head'
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/watch|watch (Bash)]]

*Mots-clés : watch répéter surveiller intervalle brew rafraîchir*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
