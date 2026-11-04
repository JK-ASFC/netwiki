---
title: "unxz"
description: "Bash — unxz (Fichiers / Compression) : Décompresse les fichiers .xz (= xz -d)."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Fichiers / Compression |
| **Commande type** | `unxz archive.tar.xz` |

## Rôle

Décompresse les fichiers .xz (= xz -d).

## En détail

Décompresse un fichier .xz, un format à forte compression. Équivaut à xz -d.

## Options

| Option | Rôle |
| --- | --- |
| `-k` | garde l'original |
| `(arg)` | fichier .xz |
| `xz` | pour compresser |
| `xzcat` | lit sans extraire |

## Exemples

**Décompresser**

```bash
unxz archive.tar.xz
```

**Garder l'original**

```bash
unxz -k data.xz
```

**Compresser (inverse)**

```bash
xz -9 data
```

## Dans les autres shells

- [[27-commandes/03-macos/03-archivage-compression/unxz|unxz (macOS)]]

*Mots-clés : décompresser xz archive unxz*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
