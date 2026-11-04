---
title: "source"
description: "macOS — source (Environnement / Shell) : Exécute un script dans le shell courant (. est synonyme)."
tags: [macos, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Shell |
| **Commande type** | `source ~/.bashrc` |

## Rôle

Exécute un script dans le shell courant (. est synonyme).

## En détail

Exécute un script dans le shell actuel, de sorte que ses variables et fonctions restent ensuite disponibles. Sert souvent à recharger un fichier de configuration.

## Options

| Option | Rôle |
| --- | --- |
| `.` | synonyme de source |
| `~/.bashrc` | recharge la config |
| `.env` | charge des variables |
| `(scope)` | reste dans le shell courant |

## Exemples

**Recharger la config**

```zsh
source ~/.bashrc
```

**Charger des variables**

```zsh
source .env
```

**Forme courte**

```zsh
. ./script.sh
```

## Dans les autres shells

- [[27-commandes/01-bash/09-environnement-variables/source|source (Bash)]]

*Mots-clés : sourcer charger recharger environnement source point*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
