---
title: "diff"
description: "Bash — diff (Fichiers / Comparaison) : Compare deux fichiers ligne à ligne."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
diff ancien.conf nouveau.conf
```

**Format patch**

```bash
diff -u a.txt b.txt
```

**Deux dossiers**

```bash
diff -r dir1/ dir2/
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/diff|diff (macOS)]]

*Mots-clés : comparer différence fichiers patch diff*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
