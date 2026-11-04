---
title: "rg (ripgrep)"
description: "Bash — rg (ripgrep) (Recherche / PCRE) : Cherche un motif (regex) dans toute une arborescence, très vite."
tags: [bash, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Recherche |
| **Contexte** | Recherche / PCRE |
| **Commande type** | `rg 'motif' .` |

## Rôle

Cherche un motif (regex) dans toute une arborescence, très vite.

## Options

| Option | Rôle |
| --- | --- |
| `-i` | insensible à la casse |
| `-w` | mot entier |
| `-n` | numéros de ligne |
| `-l` | fichiers correspondants seulement |
| `-v` | lignes NON correspondantes |
| `-F` | motif littéral (pas regex) |
| `-c` | compte les correspondances |
| `-t ‹type›` | type de fichier (py, js...) |
| `-g ‹glob›` | filtre par nom de fichier |
| `-A ‹N›` | N lignes après |
| `-B ‹N›` | N lignes avant |
| `--hidden` | inclut les fichiers caches |

## Exemples

**Tout 'TODO' sous le dossier courant**

```bash
rg 'TODO'
```

**Insensible + numéros de ligne**

```bash
rg -i -n 'erreur' /var/log
```

**Regex sur les fichiers Python**

```bash
rg -t py 'def \w+\('
```

## Dans les autres shells

- [[27-commandes/03-macos/21-recherche/rg-ripgrep|rg (ripgrep) (macOS)]]

*Mots-clés : ripgrep rg recherche regex grep récursif rapide motif*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
