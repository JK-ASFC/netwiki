---
title: "watch"
description: "Bash — watch (Supervision système) : Reexecute une commande à intervalle et affiche la sortie."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Supervision système |
| **Commande type** | `watch -n 2 'df -h'` |

## Rôle

Reexecute une commande à intervalle et affiche la sortie.

## En détail

Répète une commande à intervalle régulier et affiche le résultat qui se met à jour. Pratique pour surveiller quelque chose en direct (espace disque, processus).

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹N›` | intervalle (s) |
| `-d` | surligne les changements |
| `-t` | sans en-tête |
| `-g` | stoppe au 1er changement |

## Exemples

**Surveiller le disque**

```bash
watch -n 5 'df -h'
```

**Connexions en direct**

```bash
watch -d 'ss -tn state established'
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/watch|watch (macOS)]]

*Mots-clés : surveiller répéter intervalle moniteur watch temps réel*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
