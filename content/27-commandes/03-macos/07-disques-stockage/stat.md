---
title: "stat"
description: "macOS — stat (Métadonnées de fichier) : Affiche les métadonnées d'un fichier (version BSD ; -x pour un format lisible)."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Métadonnées de fichier |
| **Commande type** | `stat -x fichier` |

## Rôle

Affiche les métadonnées d'un fichier (version BSD ; -x pour un format lisible).

## En détail

Affiche les détails d'un fichier : taille exacte, dates de création et modification, permissions, propriétaire. Plus complet que ls.

## Options

| Option | Rôle |
| --- | --- |
| `-x` | format détaillé et lisible |
| `-f ‹format›` | format personnalisé (BSD, différent de GNU) |
| `-f %z ‹fichier›` | taille en octets |
| `-f %Sm ‹fichier›` | date de modification lisible |

## Exemples

**Détails lisibles**

```zsh
stat -x rapport.pdf
```

**Taille en octets**

```zsh
stat -f %z rapport.pdf
```

**Date de modif**

```zsh
stat -f %Sm rapport.pdf
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/stat|stat (Bash)]]

*Mots-clés : métadonnées fichier stat taille dates permissions inode bsd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
