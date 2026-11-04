---
title: "port"
description: "macOS — port (MacPorts) : Le gestionnaire de paquets MacPorts (alternative à Homebrew, installe sous /opt/local)."
tags: [macos, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | MacPorts |
| **Commande type** | `sudo port install wget` |

## Rôle

Le gestionnaire de paquets MacPorts (alternative à Homebrew, installe sous /opt/local).

## Options

| Option | Rôle |
| --- | --- |
| `install ‹paquet›` | installe un paquet |
| `uninstall ‹paquet›` | désinstalle |
| `selfupdate` | met à jour MacPorts et l'arbre des ports |
| `upgrade outdated` | met à jour les paquets obsolètes |
| `search ‹terme›` | cherche un port |
| `installed` | liste l'installé |

## Exemples

**Installer**

```zsh
sudo port install wget
```

**Tout mettre à jour**

```zsh
sudo port selfupdate && sudo port upgrade outdated
```

*Mots-clés : macports port paquet installer alternative homebrew*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
