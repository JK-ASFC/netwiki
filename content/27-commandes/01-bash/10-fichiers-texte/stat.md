---
title: "stat"
description: "Bash — stat (Fichiers / Métadonnées) : Affiche les métadonnées (taille, droits, dates, inode)."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Métadonnées |
| **Commande type** | `stat fichier.txt` |

## Rôle

Affiche les métadonnées (taille, droits, dates, inode).

## En détail

Affiche les détails d'un fichier : taille exacte, dates de création et modification, permissions, propriétaire. Plus complet que ls.

## Options

| Option | Rôle |
| --- | --- |
| `-c ‹format›` | format personnalisé |
| `%s` | taille |
| `%y` | date de modif |
| `(sans arg)` | infos complètes |

## Exemples

**Tout**

```bash
stat fichier.txt
```

**Taille seule**

```bash
stat -c %s gros.iso
```

**Date de modif**

```bash
stat -c %y app.log
```

## Dans les autres shells

- [[27-commandes/03-macos/07-disques-stockage/stat|stat (macOS)]]

*Mots-clés : métadonnées inode droits dates taille stat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
