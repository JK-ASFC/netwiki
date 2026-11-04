---
title: "wc"
description: "macOS — wc (Fichiers / Comptage) : Compte lignes, mots et octets."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Comptage |
| **Commande type** | `wc -l acces.log` |

## Rôle

Compte lignes, mots et octets.

## En détail

Compte les lignes, les mots ou les caractères d'un fichier ou d'une sortie. L'option -l (nombre de lignes) est la plus utilisée.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | lignes |
| `-w` | mots |
| `-c` | octets |
| `-m` | caractères |

## Exemples

**Compter les lignes**

```zsh
wc -l acces.log
```

**Mots**

```zsh
wc -w texte.txt
```

**Lignes d'une sortie**

```zsh
ls | wc -l
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/wc|wc (Bash)]]

*Mots-clés : compter lignes mots octets wc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
