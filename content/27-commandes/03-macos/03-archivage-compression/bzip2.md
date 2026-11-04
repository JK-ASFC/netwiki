---
title: "bzip2"
description: "macOS — bzip2 (Fichiers / Compression) : Compresse ou décompresse en .bz2."
tags: [macos, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Archivage & compression |
| **Contexte** | Fichiers / Compression |
| **Commande type** | `bzip2 gros.log` |

## Rôle

Compresse ou décompresse en .bz2.

## En détail

Compresse un fichier au format .bz2 pour gagner de la place (taux eleve, un peu plus lent). -d pour décompresser.

## Options

| Option | Rôle |
| --- | --- |
| `-d` | décompresse |
| `-k` | garde l'original |
| `-9` | compression maximale |
| `bzcat` | lit sans extraire |

## Exemples

**Compresser**

```zsh
bzip2 gros.log
```

**Garder l'original**

```zsh
bzip2 -k gros.log
```

**Décompresser**

```zsh
bzip2 -d gros.log.bz2
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/bzip2|bzip2 (Bash)]]

*Mots-clés : compresser décompresser archive bzip2*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
