---
title: "uniq"
description: "macOS — uniq (Dédupliquer) : Supprime ou compte les lignes consécutives identiques (trie d'abord avec sort)."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Dédupliquer |
| **Commande type** | `uniq` |

## Rôle

Supprime ou compte les lignes consécutives identiques (trie d'abord avec sort).

## Options

| Option | Rôle |
| --- | --- |
| `-c` | compte les occurrences de chaque ligne |
| `-d` | n'affiche que les doublons |
| `-u` | n'affiche que les lignes uniques |
| `-i` | ignore la casse |

## Exemples

**Dédupliquer**

```zsh
sort acces.log | uniq
```

**Top des IP**

```zsh
sort ips.txt | uniq -c | sort -rn
```

**Doublons seuls**

```zsh
sort liste.txt | uniq -d
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/uniq|uniq (Bash)]]

*Mots-clés : uniq unique doublon dedupliquer compter lignes sort consécutives*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
