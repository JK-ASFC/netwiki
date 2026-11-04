---
title: "zstd"
description: "Bash — zstd (Archivage / Compression) : Compression Zstandard : très rapide avec un excellent ratio (moderne)."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Archivage / Compression |
| **Commande type** | `zstd ‹fichier›` |

## Rôle

Compression Zstandard : très rapide avec un excellent ratio (moderne).

## Options

| Option | Rôle |
| --- | --- |
| `-d` | décompresse |
| `-k` | garde l'original (keep) |
| `-19` | niveau élevé (1 à 19, défaut 3) |
| `--ultra` | débloque les niveaux 20 à 22 |
| `-T0` | multithread (tous les cœurs) |
| `-r` | récursif (dossier) |
| `-o ‹fichier.zst›` | nom du fichier de sortie |

## Exemples

**Compresser**

```bash
zstd -k backup.tar
```

**Décompresser**

```bash
zstd -d backup.tar.zst
```

**Niveau maximal**

```bash
zstd --ultra -22 -k -T0 backup.tar
```

## Dans les autres shells

- [[27-commandes/03-macos/03-archivage-compression/zstd|zstd (macOS)]]

*Mots-clés : zstd zstandard compression rapide moderne ratio décompresser fichier multicoeur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
