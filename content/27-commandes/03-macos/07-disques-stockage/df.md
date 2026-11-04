---
title: "df"
description: "macOS — df (Espace disque) : Affiche l'espace libre et utilisé par système de fichiers."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Espace disque |
| **Commande type** | `df -h` |

## Rôle

Affiche l'espace libre et utilisé par système de fichiers.

## En détail

Affiche l'espace disque de chaque partition : total, utilise, libre. Le réflexe quand un disque se remplit. -h pour des tailles lisibles.

## Options

| Option | Rôle |
| --- | --- |
| `-h` | tailles lisibles (Ko, Mo, Go) |
| `-H` | tailles en base 1000 (comme les fabricants) |
| `-i` | affiche les inodes |
| `-l` | volumes locaux seulement |

## Exemples

**Espace lisible**

```zsh
df -h
```

**Volumes locaux**

```zsh
df -hl
```

## Dans les autres shells

- [[27-commandes/01-bash/07-disques-stockage/df|df (Bash)]]

*Mots-clés : espace disque df libre utilise volume stockage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
