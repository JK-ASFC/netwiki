---
title: "more"
description: "Bash — more (Lecture paginée (basique)) : Pager basique : affiche page par page (Espace pour avancer, q pour quitter). Plus limité que less, mais présent partout. Souvent en bout de tube."
tags: [bash, commande, pagers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
more /etc/services
```

**Démarrer à une ligne**

```bash
more +20 long.txt
```

**Sortie d'une commande**

```bash
ps aux | more
```

## Dans les autres shells

- [[27-commandes/03-macos/16-pagers/more|more (macOS)]]

*Mots-clés : more pager lire fichier pagination defiler basique espace consulter tube*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
