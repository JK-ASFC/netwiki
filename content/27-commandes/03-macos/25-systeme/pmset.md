---
title: "pmset"
description: "macOS — pmset (Énergie & veille) : Gère les réglages d'alimentation et de veille (batterie, secteur, mise en veille)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Énergie & veille |
| **Commande type** | `pmset -g` |

## Rôle

Gère les réglages d'alimentation et de veille (batterie, secteur, mise en veille).

## Options

| Option | Rôle |
| --- | --- |
| `-g` | affiche les réglages actifs |
| `-g batt` | état de la batterie |
| `-g assertions` | ce qui empêche la veille |
| `sleepnow` | met en veille immédiatement |
| `displaysleepnow` | éteint l'écran |
| `-a sleep ‹minutes›` | délai de veille (tous modes) |
| `-c ‹clé valeur›` | réglage sur secteur uniquement |
| `-b ‹clé valeur›` | réglage sur batterie uniquement |

## Exemples

**Réglages actuels**

```zsh
pmset -g
```

**État batterie**

```zsh
pmset -g batt
```

**Veille dans 30 min sur secteur**

```zsh
sudo pmset -c sleep 30
```

*Mots-clés : energie veille batterie alimentation pmset sleep power*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
