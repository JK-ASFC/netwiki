---
title: "unzip"
description: "macOS — unzip (Archivage / ZIP) : Extrait et inspecte des archives ZIP."
tags: [macos, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
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

```zsh
unzip site.zip
```

**Vers un dossier**

```zsh
unzip site.zip -d /var/www
```

**Lister le contenu**

```zsh
unzip -l site.zip
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/unzip|unzip (Bash)]]

*Mots-clés : unzip extraire décompresser archive lister dossier zip*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
