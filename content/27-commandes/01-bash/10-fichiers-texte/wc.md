---
title: "wc"
description: "Bash — wc (Fichiers / Comptage) : Compte lignes, mots et octets."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
wc -l acces.log
```

**Mots**

```bash
wc -w texte.txt
```

**Lignes d'une sortie**

```bash
ls | wc -l
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/wc|wc (macOS)]]

*Mots-clés : compter lignes mots octets wc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
