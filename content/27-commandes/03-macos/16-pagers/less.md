---
title: "less"
description: "macOS — less (Lecture paginée) : Affiche un fichier page par page sans le charger en entier (rapide même sur de gros logs). Navigation au clavier, recherche avec /, on quitte avec q."
tags: [macos, commande, pagers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Pagers |
| **Contexte** | Lecture paginée |
| **Commande type** | `less fichier` |

## Rôle

Affiche un fichier page par page sans le charger en entier (rapide même sur de gros logs). Navigation au clavier, recherche avec /, on quitte avec q.

## En détail

Ouvre un fichier en lecture pour le parcourir page par page, avec recherche. On quitte avec la touche q. Idéal pour lire un long fichier sans tout charger.

## Options

| Option | Rôle |
| --- | --- |
| `-N` | affiche les numéros de ligne |
| `-S` | coupe les lignes trop longues au lieu de les enrouler |
| `-i` | recherche insensible à la casse |
| `+F` | suit le fichier en direct, comme tail -f (Ctrl+C pour reprendre) |
| `-p ‹motif›` | ouvre directement à la première occurrence |
| `(Espace / b)` | page suivante / précédente |
| `(/motif)` | cherche dans le fichier (n = suivant, N = précédent) |
| `(g / G)` | aller au début / à la fin du fichier |
| `(q)` | quitter le pager |

## Exemples

**Lire un gros log**

```zsh
less /var/log/syslog
```

**Suivre un log en direct**

```zsh
less +F app.log
```

**Avec numéros de ligne**

```zsh
less -N nginx.conf
```

## Dans les autres shells

- [[27-commandes/01-bash/16-pagers/less|less (Bash)]]

*Mots-clés : less pager lire fichier log pagination defiler rechercher consulter gros tail*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
