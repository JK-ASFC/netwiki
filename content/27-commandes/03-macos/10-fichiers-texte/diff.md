---
title: "diff"
description: "macOS — diff (Fichiers / Comparaison) : Compare deux fichiers ligne à ligne."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Comparaison |
| **Commande type** | `diff ancien.conf nouveau.conf` |

## Rôle

Compare deux fichiers ligne à ligne.

## En détail

Compare deux fichiers et montre ce qui diffère, ligne par ligne. Sert à voir les modifications entre deux versions.

## Options

| Option | Rôle |
| --- | --- |
| `-u` | format unifié (patch) |
| `-r` | récursif (dossiers) |
| `-y` | côté a côté |
| `-i` | ignore la casse |

## Exemples

**Comparer**

```zsh
diff ancien.conf nouveau.conf
```

**Format patch**

```zsh
diff -u a.txt b.txt
```

**Deux dossiers**

```zsh
diff -r dir1/ dir2/
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/diff|diff (Bash)]]

*Mots-clés : comparer différence fichiers patch diff*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
