---
title: "softwareupdate"
description: "macOS — softwareupdate (Mises à jour macOS) : Gère les mises à jour du système macOS (l'équivalent d'apt upgrade pour l'OS)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Mises à jour macOS |
| **Commande type** | `softwareupdate -l` |

## Rôle

Gère les mises à jour du système macOS (l'équivalent d'apt upgrade pour l'OS).

## Options

| Option | Rôle |
| --- | --- |
| `-l` | liste les mises à jour disponibles |
| `-i ‹nom›` | installe une mise à jour précise |
| `-i -a` | installe toutes les mises à jour |
| `-i -a -R` | installe tout puis redémarre si besoin |
| `--fetch-full-installer` | télécharge l'installateur complet de macOS |
| `--list-full-installers` | liste les versions de macOS installables |

## Exemples

**Voir les mises à jour**

```zsh
softwareupdate -l
```

**Tout installer**

```zsh
sudo softwareupdate -i -a
```

**Installer et redémarrer**

```zsh
sudo softwareupdate -i -a -R
```

## Dans les autres shells

- [[27-commandes/03-macos/17-paquets-mises-a-jour/softwareupdate|softwareupdate (macOS)]]

*Mots-clés : mise à jour update macos softwareupdate système sécurité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
