---
title: "unzip"
description: "Bash — unzip (Archivage / ZIP) : Extrait et inspecte des archives ZIP."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Archivage / ZIP |
| **Commande type** | `unzip ‹archive.zip›` |

## Rôle

Extrait et inspecte des archives ZIP.

## Options

| Option | Rôle |
| --- | --- |
| `-d ‹dossier›` | extrait dans un dossier précis |
| `-l` | liste le contenu sans extraire |
| `-o` | écrase sans demander |
| `-n` | n'écrase jamais |
| `-x ‹motif›` | exclut des fichiers |
| `-P ‹motdepasse›` | mot de passe de l'archive |

## Exemples

**Extraire ici**

```bash
unzip site.zip
```

**Vers un dossier**

```bash
unzip site.zip -d /var/www
```

**Lister le contenu**

```bash
unzip -l site.zip
```

## Dans les autres shells

- [[27-commandes/03-macos/03-archivage-compression/unzip|unzip (macOS)]]

*Mots-clés : unzip extraire décompresser archive lister dossier zip*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
