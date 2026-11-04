---
title: "ping"
description: "Bash — ping (Dépannage réseau) : Joignabilite et latence d'un hôte."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `ping -c 4 1.1.1.1` |

## Rôle

Joignabilite et latence d'un hôte.

## En détail

Vérifie si une machine distante répond et mesure le temps de réponse. Le premier test quand on doute d'une connexion.

## Options

| Option | Rôle |
| --- | --- |
| `-c ‹N›` | N paquets |
| `-i ‹secondes›` | intervalle |
| `-W ‹secondes›` | timeout |

## Exemples

**4 pings**

```bash
ping -c 4 1.1.1.1
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/ping|ping (macOS)]]

*Mots-clés : joignable latence réseau connectivité test ping*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
