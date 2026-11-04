---
title: "defaults"
description: "macOS — defaults (Préférences (plist)) : Lit et écrit les préférences des applications et du système (fichiers .plist)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Préférences (plist) |
| **Commande type** | `defaults read com.apple.dock` |

## Rôle

Lit et écrit les préférences des applications et du système (fichiers .plist).

## Options

| Option | Rôle |
| --- | --- |
| `read ‹domaine›` | lit toutes les clés d'un domaine |
| `read ‹domaine clé›` | lit une clé précise |
| `write ‹domaine clé› -bool ‹true/false›` | écrit un booléen |
| `write ‹domaine clé› -int ‹N›` | écrit un entier |
| `write ‹domaine clé› -string ‹valeur›` | écrit une chaîne |
| `delete ‹domaine clé›` | supprime une clé |
| `domains` | liste tous les domaines de préférences |

## Exemples

**Afficher les fichiers cachés dans le Finder**

```zsh
defaults write com.apple.finder AppleShowAllFiles -bool true; killall Finder
```

**Lire une préférence du Dock**

```zsh
defaults read com.apple.dock autohide
```

**Accélérer l'auto-masquage du Dock**

```zsh
defaults write com.apple.dock autohide-time-modifier -float 0.15; killall Dock
```

*Mots-clés : préférences plist defaults réglages application écrire lire dock finder*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
