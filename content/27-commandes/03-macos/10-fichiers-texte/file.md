---
title: "file"
description: "macOS — file (Identifier un fichier) : Devine le type réel d'un fichier d'après son contenu, pas son extension."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Identifier un fichier |
| **Commande type** | `file fichier` |

## Rôle

Devine le type réel d'un fichier d'après son contenu, pas son extension.

## Options

| Option | Rôle |
| --- | --- |
| `-i` | affiche le type MIME (ex. text/plain) |
| `-b` | réponse seule, sans le nom du fichier |
| `-z` | regarde dans les fichiers compressés |

## Exemples

**Type d'un fichier**

```zsh
file image.bin
```

**Type MIME**

```zsh
file -i document
```

**Tout un dossier**

```zsh
file *
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/file|file (Bash)]]

*Mots-clés : file type magic contenu identifier mime binaire texte*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
