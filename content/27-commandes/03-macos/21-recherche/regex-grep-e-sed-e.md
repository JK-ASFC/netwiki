---
title: "regex (grep -E / sed -E)"
description: "macOS — regex (grep -E / sed -E) (Motifs & filtrage) : Metacaracteres communs des expressions régulières."
tags: [macos, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Recherche |
| **Contexte** | Motifs & filtrage |
| **Commande type** | `grep -E "^[0-9]{3}-[0-9]{4}$"` |

## Rôle

Metacaracteres communs des expressions régulières.

## En détail

Les expressions régulières : un mini-langage pour décrire un motif de texte (toutes les adresses email, toutes les lignes d'erreur). Sert à chercher et remplacer finement.

## Options

| Option | Rôle |
| --- | --- |
| `^ $` | début / fin de ligne |
| `. *` | un caractère / 0 ou plus |
| `+ ?` | 1+ / 0 ou 1 |
| `[abc] [^abc]` | classe / négation |
| `\d \w \s` | chiffre / mot / espace (PCRE) |
| `{n,m}` | entre n et m fois |

## Exemples

**Trouver des IP**

```zsh
grep -Eo "([0-9]{1,3}\.){3}[0-9]{1,3}" f
```

**Extraire des emails**

```zsh
grep -Eo "[[:alnum:]._%+-]+@[[:alnum:].-]+" f
```

## Dans les autres shells

- [[27-commandes/01-bash/20-recherche/regex-grep-e-sed-e|regex (grep -E / sed -E) (Bash)]]

*Mots-clés : regex expression régulière motif pattern metacaractere scripting*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
