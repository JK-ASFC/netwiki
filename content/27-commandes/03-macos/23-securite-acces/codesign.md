---
title: "codesign"
description: "macOS — codesign (Signature de code) : Vérifie et applique la signature de code des applications et binaires."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Signature de code |
| **Commande type** | `codesign -dv --verbose=4 app.app` |

## Rôle

Vérifie et applique la signature de code des applications et binaires.

## Options

| Option | Rôle |
| --- | --- |
| `-dv ‹app›` | affiche les infos de signature |
| `--verify ‹app›` | vérifie la validité de la signature |
| `--verbose=4` | détail maximal |
| `-s ‹identité› ‹binaire›` | signe avec une identité de certificat |

## Exemples

**Info de signature**

```zsh
codesign -dv --verbose=4 /Applications/MonApp.app
```

**Vérifier**

```zsh
codesign --verify --deep --strict /Applications/MonApp.app
```

*Mots-clés : signature codesign certificat vérifier binaire application sécurité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
