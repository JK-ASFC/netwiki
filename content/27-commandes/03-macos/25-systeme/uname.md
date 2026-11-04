---
title: "uname"
description: "macOS — uname (Noyau & architecture) : Identité du noyau Darwin, version et architecture."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Noyau & architecture |
| **Commande type** | `uname -a` |

## Rôle

Identité du noyau Darwin, version et architecture.

## En détail

Affiche l'identité du système : nom du noyau, version et type de processeur. On l'utilise pour savoir rapidement sur quelle machine et quel Linux on se trouve.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | toutes les infos |
| `-s` | nom du noyau (Darwin) |
| `-r` | version du noyau |
| `-m` | architecture (arm64 sur Apple Silicon, x86_64 sur Intel) |
| `-p` | type de processeur |

## Exemples

**Tout**

```zsh
uname -a
```

**Architecture (Apple Silicon ?)**

```zsh
uname -m
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/uname|uname (Bash)]]

*Mots-clés : noyau kernel darwin architecture arm64 uname version*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
