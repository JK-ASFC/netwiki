---
title: "file"
description: "Bash — file (Identifier un fichier) : Devine le type réel d'un fichier d'après son contenu, pas son extension."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
file image.bin
```

**Type MIME**

```bash
file -i document
```

**Tout un dossier**

```bash
file *
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/file|file (macOS)]]

*Mots-clés : file type magic contenu identifier mime binaire texte*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
