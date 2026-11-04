---
title: "brew"
description: "macOS — brew (Homebrew) : Le gestionnaire de paquets de référence sur macOS : outils en ligne de commande (formules) et applications (casks), sans droits root."
tags: [macos, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Homebrew |
| **Commande type** | `brew install wget` |

## Rôle

Le gestionnaire de paquets de référence sur macOS : outils en ligne de commande (formules) et applications (casks), sans droits root.

## Options

| Option | Rôle |
| --- | --- |
| `install ‹formule›` | installe un outil en ligne de commande |
| `install --cask ‹app›` | installe une application graphique |
| `uninstall ‹nom›` | désinstalle |
| `update` | met à jour Homebrew et l'index |
| `upgrade` | met à jour les paquets installés |
| `search ‹terme›` | cherche une formule ou un cask |
| `info ‹nom›` | détails d'un paquet |
| `list` | liste l'installé |
| `cleanup` | supprime les anciennes versions |
| `doctor` | diagnostique l'installation |
| `services list` | services gérés par brew |

## Exemples

**Installer un outil**

```zsh
brew install ripgrep
```

**Installer une app**

```zsh
brew install --cask visual-studio-code
```

**Tout mettre à jour**

```zsh
brew update && brew upgrade
```

## Dans les autres shells

- [[27-commandes/01-bash/17-paquets-mises-a-jour/brew|brew (Bash)]]

*Mots-clés : brew homebrew paquet macos formule cask installer mise à jour*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
