---
title: "sort"
description: "Bash — sort (Fichiers / Tri) : Trie les lignes d'un fichier ou d'un flux."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Tri |
| **Commande type** | `sort acces.log` |

## Rôle

Trie les lignes d'un fichier ou d'un flux.

## En détail

Trie les lignes d'un fichier (alphabétique, numérique, inverse). Souvent combine avec uniq pour éliminer les doublons.

## Options

| Option | Rôle |
| --- | --- |
| `-n` | tri numérique |
| `-r` | ordre inverse |
| `-u` | supprime les doublons |
| `-k ‹champ›` | par colonne |

## Exemples

**Alphabétique**

```bash
sort noms.txt
```

**Numérique inverse**

```bash
sort -nr tailles.txt
```

**Uniques**

```bash
sort -u emails.txt
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/sort|sort (macOS)]]

*Mots-clés : trier ordonner lignes numérique sort*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
