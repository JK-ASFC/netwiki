---
title: "mkdir"
description: "Bash — mkdir (Fichiers / Répertoires) : Crée des répertoires."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
mkdir build
```

**Arborescence**

```bash
mkdir -p projet/src/api
```

**Avec droits**

```bash
mkdir -m 700 prive
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/mkdir|mkdir (macOS)]]

*Mots-clés : créer répertoire dossier arborescence mkdir*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
