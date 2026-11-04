---
title: "man"
description: "macOS — man (Manuel) : Ouvre la documentation d'une commande."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Manuel |
| **Commande type** | `man ls` |

## Rôle

Ouvre la documentation d'une commande.

## En détail

Le manuel intégré : ouvre la documentation complète d'une commande. Le réflexe à avoir quand on ne se souvient plus d'une option.

## Options

| Option | Rôle |
| --- | --- |
| `-k ‹mot›` | cherche dans toutes les pages (= apropos) |
| `-f ‹cmd›` | description courte (= whatis) |
| `‹section› ‹cmd›` | page d'une section précise (ex. man 5 crontab) |

## Exemples

**Aide d'une commande**

```zsh
man rsync
```

**Chercher par mot-clé**

```zsh
man -k réseau
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/man|man (Bash)]]

*Mots-clés : manuel aide documentation man page*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
