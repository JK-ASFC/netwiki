---
title: "xcode-select"
description: "macOS — xcode-select (Outils de développement) : Installe les Command Line Tools d'Apple (compilateur, git, make), prérequis de nombreux outils."
tags: [macos, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Outils de développement |
| **Commande type** | `xcode-select --install` |

## Rôle

Installe les Command Line Tools d'Apple (compilateur, git, make), prérequis de nombreux outils.

## Options

| Option | Rôle |
| --- | --- |
| `--install` | installe les Command Line Tools |
| `-p` | affiche le chemin des outils actifs |
| `--reset` | réinitialise le chemin par défaut |

## Exemples

**Installer les outils**

```zsh
xcode-select --install
```

**Vérifier le chemin**

```zsh
xcode-select -p
```

*Mots-clés : xcode outils développement compilateur git make command line tools*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
