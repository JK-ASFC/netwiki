---
title: "xz"
description: "macOS — xz (Archivage / Compression) : Compresse/décompresse en .xz (très bon ratio, LZMA). Remplace le fichier par défaut."
tags: [macos, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Archivage & compression |
| **Contexte** | Archivage / Compression |
| **Commande type** | `xz ‹fichier›` |

## Rôle

Compresse/décompresse en .xz (très bon ratio, LZMA). Remplace le fichier par défaut.

## Options

| Option | Rôle |
| --- | --- |
| `-d` | décompresse (équivaut à unxz) |
| `-k` | garde le fichier d'origine (keep) |
| `-9` | compression maximale |
| `-e` | mode extrême (plus lent, un peu mieux) |
| `-T ‹0›` | threads (0 = auto, multicœur) |
| `-l` | infos sur une archive .xz |
| `-c` | écrit sur la sortie standard |

## Exemples

**Compresser**

```zsh
xz -k gros.log
```

**Décompresser**

```zsh
xz -d gros.log.xz
```

**Max + multicœur**

```zsh
xz -9 -e -T 0 -k dump.sql
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/xz|xz (Bash)]]

*Mots-clés : xz compression décompression lzma ratio fichier keep décompresser archive*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
