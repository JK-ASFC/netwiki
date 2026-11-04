---
title: "gzip"
description: "macOS — gzip (Fichiers / Compression) : Compresse ou décompresse en .gz."
tags: [macos, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Archivage & compression |
| **Contexte** | Fichiers / Compression |
| **Commande type** | `gzip acces.log` |

## Rôle

Compresse ou décompresse en .gz.

## En détail

Compresse un fichier au format .gz, le standard rapide sous Linux. -d (ou gunzip) pour décompresser.

## Options

| Option | Rôle |
| --- | --- |
| `-d` | décompresse (= gunzip) |
| `-k` | garde l'original |
| `-9` | compression maximale |
| `zcat` | lit sans extraire |

## Exemples

**Compresser**

```zsh
gzip acces.log
```

**Garder l'original**

```zsh
gzip -k acces.log
```

**Décompresser**

```zsh
gzip -d acces.log.gz
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/gzip|gzip (Bash)]]

*Mots-clés : compresser décompresser archive gzip gunzip*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
