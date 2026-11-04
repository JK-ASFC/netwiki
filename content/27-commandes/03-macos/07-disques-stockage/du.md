---
title: "du"
description: "macOS — du (Taille des dossiers) : Mesure la place occupée par des fichiers et dossiers."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Taille des dossiers |
| **Commande type** | `du -sh *` |

## Rôle

Mesure la place occupée par des fichiers et dossiers.

## En détail

Mesure la place occupée par des fichiers et dossiers. Sert à trouver ce qui prend le plus d'espace.

## Options

| Option | Rôle |
| --- | --- |
| `-s` | total par élément (pas le détail) |
| `-h` | tailles lisibles |
| `-d ‹N›` | profondeur maximale (BSD : -d au lieu de --max-depth) |
| `-c` | ajoute un total général |
| `-x` | reste sur le même système de fichiers |

## Exemples

**Taille des sous-dossiers**

```zsh
du -sh *
```

**Top 10 des plus gros**

```zsh
du -sh * | sort -rh | head
```

**Un niveau de profondeur**

```zsh
du -h -d 1 ~/Documents
```

## Dans les autres shells

- [[27-commandes/01-bash/07-disques-stockage/du|du (Bash)]]

*Mots-clés : taille dossier du espace occupe mesurer stockage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
