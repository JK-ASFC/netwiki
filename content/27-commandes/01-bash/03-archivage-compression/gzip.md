---
title: "gzip"
description: "Bash — gzip (Fichiers / Compression) : Compresse ou décompresse en .gz."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
gzip acces.log
```

**Garder l'original**

```bash
gzip -k acces.log
```

**Décompresser**

```bash
gzip -d acces.log.gz
```

## Dans les autres shells

- [[27-commandes/03-macos/03-archivage-compression/gzip|gzip (macOS)]]

*Mots-clés : compresser décompresser archive gzip gunzip*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
