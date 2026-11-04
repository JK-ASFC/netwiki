---
title: "uniq"
description: "Bash — uniq (Dédupliquer) : Supprime ou compte les lignes consécutives identiques (trie d'abord avec sort)."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
sort acces.log | uniq
```

**Top des IP**

```bash
sort ips.txt | uniq -c | sort -rn
```

**Doublons seuls**

```bash
sort liste.txt | uniq -d
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/uniq|uniq (macOS)]]

*Mots-clés : uniq unique doublon dedupliquer compter lignes sort consécutives*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
