---
title: "mkdir"
description: "macOS — mkdir (Fichiers / Répertoires) : Crée des répertoires."
tags: [macos, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Répertoires |
| **Commande type** | `mkdir -p projet/src/api` |

## Rôle

Crée des répertoires.

## En détail

Crée un nouveau dossier. L'option -p crée au passage tous les dossiers parents manquants.

## Options

| Option | Rôle |
| --- | --- |
| `-p` | crée les parents manquants (équivaut à --parents) |
| `-m ‹mode›` | droits à la création |
| `-v` | verbeux |
| `(plusieurs)` | en une fois |

## Exemples

**Un dossier**

```zsh
mkdir build
```

**Arborescence**

```zsh
mkdir -p projet/src/api
```

**Avec droits**

```zsh
mkdir -m 700 prive
```

## Dans les autres shells

- [[27-commandes/01-bash/15-navigation-fichiers/mkdir|mkdir (Bash)]]

*Mots-clés : créer répertoire dossier arborescence mkdir*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
