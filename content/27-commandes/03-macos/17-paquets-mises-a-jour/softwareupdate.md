---
title: "softwareupdate"
description: "macOS — softwareupdate (Mises à jour système) : Gère les mises à jour de macOS lui-même (système et sécurité)."
tags: [macos, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Mises à jour système |
| **Commande type** | `softwareupdate -l` |

## Rôle

Gère les mises à jour de macOS lui-même (système et sécurité).

## Options

| Option | Rôle |
| --- | --- |
| `-l` | liste les mises à jour disponibles |
| `-i -a` | installe toutes les mises à jour |
| `-i ‹nom›` | installe une mise à jour précise |
| `-i -a -R` | installe tout puis redémarre si besoin |
| `--list-full-installers` | versions de macOS installables |

## Exemples

**Voir**

```zsh
softwareupdate -l
```

**Tout installer**

```zsh
sudo softwareupdate -i -a
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/softwareupdate|softwareupdate (macOS)]]

*Mots-clés : mise à jour update macos softwareupdate système sécurité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
