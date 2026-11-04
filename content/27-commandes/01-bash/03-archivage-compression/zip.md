---
title: "zip"
description: "Bash — zip (Archivage / ZIP) : Crée et met à jour des archives ZIP (compatibles Windows)."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Archivage / ZIP |
| **Commande type** | `zip -r ‹archive.zip› ‹dossier›` |

## Rôle

Crée et met à jour des archives ZIP (compatibles Windows).

## Options

| Option | Rôle |
| --- | --- |
| `-r` | récursif (inclut les sous-dossiers) |
| `-9` | compression maximale (0 = stockage, 1 = rapide) |
| ⚠️ `-e` | chiffre l'archive avec un mot de passe |
| `-x ‹motif›` | exclut des fichiers (ex. "*.log") |
| `-u` | met à jour (ajoute/remplace) |
| `-d` | supprime des fichiers de l'archive |

> [!WARNING]
> Options à manier avec précaution : `-e`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Compresser un dossier**

```bash
zip -r site.zip ./site
```

**Compression max**

```bash
zip -9 -r site.zip ./site
```

**Exclure les .log**

```bash
zip -r site.zip ./site -x "*.log"
```

## Dans les autres shells

- [[27-commandes/03-macos/03-archivage-compression/zip|zip (macOS)]]

*Mots-clés : zip archive compression dossier compresser windows compatible niveau*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
