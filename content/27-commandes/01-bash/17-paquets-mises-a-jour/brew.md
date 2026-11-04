---
title: "brew"
description: "Bash — brew (macOS / Linux) : Gestionnaire de paquets de macOS (et Linux) : installe des outils en ligne de commande (formules) et des applications (casks), sans droits root."
tags: [bash, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | macOS / Linux |
| **Commande type** | `brew install wget` |

## Rôle

Gestionnaire de paquets de macOS (et Linux) : installe des outils en ligne de commande (formules) et des applications (casks), sans droits root.

## Options

| Option | Rôle |
| --- | --- |
| `install ‹formule›` | installe une formule (outil CLI) |
| `install --cask ‹app›` | installe une application graphique |
| `uninstall ‹formule›` | désinstalle un paquet |
| `update` | met à jour Homebrew et l'index des formules |
| `upgrade` | met à jour les paquets installés |
| `search ‹terme›` | cherche une formule ou un cask |
| `info ‹formule›` | affiche les détails d'un paquet |
| `list` | liste ce qui est installé |
| `cleanup` | supprime les vieilles versions et le cache |
| `doctor` | diagnostique l'installation |

## Exemples

**Installer un outil**

```bash
brew install wget
```

**Mettre à jour tout**

```bash
brew update && brew upgrade
```

**Installer une app (cask)**

```bash
brew install --cask visual-studio-code
```

## Dans les autres shells

- [[27-commandes/03-macos/17-paquets-mises-a-jour/brew|brew (macOS)]]

*Mots-clés : brew homebrew paquet macos installer formule cask mac mise à jour package linux*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
