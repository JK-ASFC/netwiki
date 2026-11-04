---
title: "history"
description: "macOS — history (Historique zsh) : Historique des commandes tapées (stocké dans ~/.zsh_history sous zsh)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Historique zsh |
| **Commande type** | `history` |

## Rôle

Historique des commandes tapées (stocké dans ~/.zsh_history sous zsh).

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | affiche l'historique numéroté |
| `-‹N›` | les N dernières commandes |
| ⚠️ `‹N›` | rejoue la commande numéro N |
| ⚠️ `` | rejoue la dernière commande |

> [!WARNING]
> Options à manier avec précaution : `‹N›`, ``. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Voir**

```zsh
history
```

**20 dernières**

```zsh
history -20
```

**Rechercher**

```zsh
history | grep ssh
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/history|history (Bash)]]

*Mots-clés : historique history commandes zsh rappel*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
