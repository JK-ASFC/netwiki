---
title: "zsh"
description: "macOS — zsh (Shell & scripts) : Le shell par défaut de macOS : exécute et débogue des scripts."
tags: [macos, commande, automatisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Automatisation |
| **Contexte** | Shell & scripts |
| **Commande type** | `zsh -x script.zsh` |

## Rôle

Le shell par défaut de macOS : exécute et débogue des scripts.

## Options

| Option | Rôle |
| --- | --- |
| `-x` | trace chaque commande exécutée (débogage) |
| `-n` | vérifie la syntaxe sans exécuter |
| `-e` | arrête au premier échec de commande |
| `-c ‹commande›` | exécute une commande passée en argument |
| `-l` | shell de connexion (login, recharge les profils) |

## Exemples

**Tracer un script**

```zsh
zsh -x deploiement.zsh
```

**Vérifier la syntaxe**

```zsh
zsh -n script.zsh
```

**Recharger la config**

```zsh
source ~/.zshrc
```

*Mots-clés : zsh shell script debug syntaxe macos mac exécution*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
