---
title: "tart"
description: "macOS — tart (VM macOS/Linux (Apple Silicon)) : Virtualise macOS et Linux sur Apple Silicon avec le framework natif Virtualization (brew install cirruslabs/cli/tart)."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | VM macOS/Linux (Apple Silicon) |
| **Commande type** | `tart run monvm` |

## Rôle

Virtualise macOS et Linux sur Apple Silicon avec le framework natif Virtualization (brew install cirruslabs/cli/tart).

## Options

| Option | Rôle |
| --- | --- |
| `clone ‹source nom›` | clone une image de VM |
| `run ‹nom›` | démarre une VM |
| `list` | liste les VM locales |
| `stop ‹nom›` | arrête une VM |
| `delete ‹nom›` | supprime une VM |
| `ip ‹nom›` | adresse IP de la VM |

## Exemples

**Cloner une image**

```zsh
tart clone ghcr.io/cirruslabs/macos-sonoma-base:latest monvm
```

**Démarrer**

```zsh
tart run monvm
```

**IP de la VM**

```zsh
tart ip monvm
```

*Mots-clés : tart vm macos linux apple silicon virtualization brew*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
