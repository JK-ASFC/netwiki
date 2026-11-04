---
title: "more"
description: "macOS — more (Lecture paginée (basique)) : Pager basique : affiche page par page (Espace pour avancer, q pour quitter). Plus limité que less, mais présent partout. Souvent en bout de tube."
tags: [macos, commande, pagers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Pagers |
| **Contexte** | Lecture paginée (basique) |
| **Commande type** | `more fichier` |

## Rôle

Pager basique : affiche page par page (Espace pour avancer, q pour quitter). Plus limité que less, mais présent partout. Souvent en bout de tube.

## Options

| Option | Rôle |
| --- | --- |
| `-d` | affiche l'aide en bas (Espace/q) |
| `-s` | fusionne les lignes vides consécutives |
| `-u` | supprime les soulignements et retours chariot |
| `(Espace)` | page suivante |
| `(Entrée)` | ligne suivante |
| `(q)` | quitter |

## Exemples

**Lire un fichier**

```zsh
more /etc/services
```

**Démarrer à une ligne**

```zsh
more +20 long.txt
```

**Sortie d'une commande**

```zsh
ps aux | more
```

## Dans les autres shells

- [[27-commandes/01-bash/16-pagers/more|more (Bash)]]

*Mots-clés : more pager lire fichier pagination defiler basique espace consulter tube*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
