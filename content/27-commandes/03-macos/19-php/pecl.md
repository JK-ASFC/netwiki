---
title: "pecl"
description: "macOS — pecl (Extensions / PECL) : Installe des extensions PHP compilées depuis le dépôt PECL."
tags: [macos, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | PHP |
| **Contexte** | Extensions / PECL |
| **Commande type** | `pecl install ‹extension›` |

## Rôle

Installe des extensions PHP compilées depuis le dépôt PECL.

## Options

| Option | Rôle |
| --- | --- |
| `install ‹extension›` | compile et installe une extension |
| `uninstall ‹extension›` | désinstalle une extension |
| `list` | extensions installées |
| `search ‹terme›` | cherche une extension |
| `update-channels` | met à jour la liste des canaux |

## Exemples

**Installer redis**

```zsh
pecl install redis
```

**Lister**

```zsh
pecl list
```

**Désinstaller**

```zsh
pecl uninstall xdebug
```

## Dans les autres shells

- [[27-commandes/01-bash/18-php/pecl|pecl (Bash)]]

*Mots-clés : pecl extension installer compiler redis xdebug imagick php pear lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
