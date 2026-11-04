---
title: "hostname"
description: "macOS — hostname (Nom de la machine) : Affiche le nom d'hôte courant (pour le changer durablement, préférer scutil)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Nom de la machine |
| **Commande type** | `hostname` |

## Rôle

Affiche le nom d'hôte courant (pour le changer durablement, préférer scutil).

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | affiche le nom d'hôte |
| `-s` | nom court |
| `-f` | nom complet |

## Exemples

**Nom**

```zsh
hostname
```

**Changer durablement**

```zsh
sudo scutil --set HostName mac-dexter
```

## Dans les autres shells

- [[27-commandes/01-bash/24-systeme/hostname|hostname (Bash)]]
- [[27-commandes/02-powershell/26-systeme/hostname|hostname (PowerShell)]]

*Mots-clés : hostname nom machine réseau identité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
