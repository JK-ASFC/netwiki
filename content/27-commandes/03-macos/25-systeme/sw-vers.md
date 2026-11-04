---
title: "sw_vers"
description: "macOS — sw_vers (Version macOS) : Affiche la version de macOS (nom, numéro, build)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Version macOS |
| **Commande type** | `sw_vers` |

## Rôle

Affiche la version de macOS (nom, numéro, build).

## Options

| Option | Rôle |
| --- | --- |
| `-productName` | nom du produit (macOS) |
| `-productVersion` | numéro de version (ex. 14.5) |
| `-buildVersion` | numéro de build |

## Exemples

**Version complète**

```zsh
sw_vers
```

**Juste le numéro**

```zsh
sw_vers -productVersion
```

*Mots-clés : version macos système sw_vers os build*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
