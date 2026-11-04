---
title: "touch"
description: "macOS — touch (Fichiers / Création) : Crée un fichier vide ou met à jour sa date."
tags: [macos, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Création |
| **Commande type** | `touch fichier.txt` |

## Rôle

Crée un fichier vide ou met à jour sa date.

## En détail

Crée un fichier vide, ou met à jour la date de modification d'un fichier existant.

## Options

| Option | Rôle |
| --- | --- |
| `-t ‹AAMMJJhhmm›` | date précise |
| `-a` | date d'accès seule |
| `-c` | ne crée pas si absent |
| `(plusieurs)` | en une fois |

## Exemples

**Créer**

```zsh
touch app.log
```

**Plusieurs**

```zsh
touch a.txt b.txt c.txt
```

**Toucher sans créer**

```zsh
touch -c rapport.pdf
```

## Dans les autres shells

- [[27-commandes/01-bash/15-navigation-fichiers/touch|touch (Bash)]]

*Mots-clés : créer fichier vide horodatage date touch*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
