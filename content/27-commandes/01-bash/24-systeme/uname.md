---
title: "uname"
description: "Bash — uname (Inventaire & compatibilité) : Identité du noyau, version et architecture."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Inventaire & compatibilité |
| **Commande type** | `uname -a` |

## Rôle

Identité du noyau, version et architecture.

## En détail

Affiche l'identité du système : nom du noyau, version et type de processeur. On l'utilise pour savoir rapidement sur quelle machine et quel Linux on se trouve.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | toutes les infos |
| `-r` | version du noyau |
| `-m` | architecture (x86_64, arm64) |
| `-s` | nom du noyau |

## Exemples

**Tout en une ligne**

```bash
uname -a
```

**Version du noyau (driver)**

```bash
uname -r
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/uname|uname (macOS)]]

*Mots-clés : noyau version architecture kernel info uname*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
