---
title: "ping"
description: "macOS — ping (Test de connectivité) : Vérifie qu'une machine répond et mesure le temps de réponse."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Test de connectivité |
| **Commande type** | `ping -c 4 1.1.1.1` |

## Rôle

Vérifie qu'une machine répond et mesure le temps de réponse.

## En détail

Vérifie si une machine distante répond et mesure le temps de réponse. Le premier test quand on doute d'une connexion.

## Options

| Option | Rôle |
| --- | --- |
| `-c ‹N›` | envoie N paquets puis s'arrête |
| `-i ‹secondes›` | intervalle entre paquets |
| `-t ‹secondes›` | délai total (BSD : -t = timeout, pas TTL) |
| `-a` | émet un son à chaque réponse |

## Exemples

**Quatre paquets**

```zsh
ping -c 4 1.1.1.1
```

**Test rapide**

```zsh
ping -c 1 example.com
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/ping|ping (Bash)]]

*Mots-clés : ping connectivité réseau test latence icmp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
