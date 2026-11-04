---
title: "mas"
description: "macOS — mas (App Store en CLI) : Installe et met à jour les applications du Mac App Store en ligne de commande (brew install mas)."
tags: [macos, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | App Store en CLI |
| **Commande type** | `mas list` |

## Rôle

Installe et met à jour les applications du Mac App Store en ligne de commande (brew install mas).

## Options

| Option | Rôle |
| --- | --- |
| `list` | applications App Store installées (avec leur ID) |
| `search ‹nom›` | cherche une app (donne son ID) |
| `install ‹ID›` | installe une app par son identifiant |
| `upgrade` | met à jour toutes les apps App Store |
| `outdated` | apps ayant une mise à jour |

## Exemples

**Apps installées**

```zsh
mas list
```

**Chercher**

```zsh
mas search Xcode
```

**Mettre à jour**

```zsh
mas upgrade
```

*Mots-clés : app store mas application installer mise à jour cli*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
