---
title: "scutil"
description: "macOS — scutil (Config réseau/hôte) : Interroge et modifie la configuration dynamique du système (noms d'hôte, réseau)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Config réseau/hôte |
| **Commande type** | `scutil --get HostName` |

## Rôle

Interroge et modifie la configuration dynamique du système (noms d'hôte, réseau).

## Options

| Option | Rôle |
| --- | --- |
| `--get HostName` | nom d'hôte |
| `--get LocalHostName` | nom Bonjour local (.local) |
| `--get ComputerName` | nom convivial de l'ordinateur |
| `--set HostName ‹nom›` | définit le nom d'hôte (avec sudo) |
| `--dns` | affiche la configuration DNS résolue |
| `--proxy` | affiche la configuration proxy |
| `--nwi` | état des interfaces réseau |

## Exemples

**Nom d'hôte**

```zsh
scutil --get HostName
```

**Changer le nom**

```zsh
sudo scutil --set HostName mac-dexter
```

**Config DNS active**

```zsh
scutil --dns
```

*Mots-clés : hostname nom machine réseau scutil configuration dynamique dns*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
