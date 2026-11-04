---
title: "mdfind"
description: "macOS — mdfind (Recherche Spotlight) : Cherche des fichiers via l'index Spotlight (très rapide, tout le disque)."
tags: [macos, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Système |
| **Contexte** | Recherche Spotlight |
| **Commande type** | `mdfind facture` |

## Rôle

Cherche des fichiers via l'index Spotlight (très rapide, tout le disque).

## Options

| Option | Rôle |
| --- | --- |
| `‹requête›` | cherche partout dans l'index Spotlight |
| `-onlyin ‹dossier›` | limite la recherche à un dossier |
| `-name ‹nom›` | cherche par nom de fichier |
| `-count` | affiche seulement le nombre de résultats |
| `-live` | met à jour les résultats en continu |

## Exemples

**Chercher un mot**

```zsh
mdfind rapport annuel
```

**Dans un dossier**

```zsh
mdfind -onlyin ~/Documents facture
```

**Par nom**

```zsh
mdfind -name budget.xlsx
```

*Mots-clés : recherche spotlight mdfind index fichier rapide métadonnées*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
