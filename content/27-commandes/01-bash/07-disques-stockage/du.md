---
title: "du"
description: "Bash — du (Gestion du stockage) : Pese chaque élément, le plus gros en haut."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Gestion du stockage |
| **Commande type** | `du -sh * \| sort -rh` |

## Rôle

Pese chaque élément, le plus gros en haut.

## En détail

Mesure la place occupée par des fichiers et dossiers. Sert à trouver ce qui prend le plus d'espace.

## Options

| Option | Rôle |
| --- | --- |
| `-s` | résume |
| `-h` | lisible |
| `-a` | inclut fichiers |
| `--max-depth=‹N›` | profondeur |

## Exemples

**Top 10 dossiers**

```bash
du -sh */ | sort -rh | head
```

## Dans les autres shells

- [[27-commandes/03-macos/07-disques-stockage/du|du (macOS)]]

*Mots-clés : taille dossier poids espace volumineux occupe gros du*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
