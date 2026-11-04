---
title: "sysctl"
description: "macOS — sysctl (Paramètres noyau (BSD)) : Lit et modifie les paramètres du noyau XNU (mémoire, CPU, réseau)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Paramètres noyau (BSD) |
| **Commande type** | `sysctl -a` |

## Rôle

Lit et modifie les paramètres du noyau XNU (mémoire, CPU, réseau).

## En détail

Lit et modifie des réglages internes du noyau (réseau, mémoire, sécurité) sans redémarrer. Réserve plutôt à l'administration avancée.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | liste tous les paramètres |
| `-n ‹clé›` | affiche seulement la valeur |
| `hw.ncpu` | nombre de cœurs (= nproc) |
| `hw.memsize` | mémoire physique en octets |
| `hw.model` | modèle de la machine |
| `machdep.cpu.brand_string` | nom du processeur |
| `-w ‹clé=valeur›` | modifie un paramètre (avec sudo) |

## Exemples

**Nombre de cœurs**

```zsh
sysctl -n hw.ncpu
```

**Mémoire totale**

```zsh
sysctl -n hw.memsize
```

**Modèle du CPU**

```zsh
sysctl -n machdep.cpu.brand_string
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/sysctl|sysctl (Bash)]]

*Mots-clés : noyau kernel paramètres sysctl hw mémoire cpu bsd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
