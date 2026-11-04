---
title: "php"
description: "macOS — php (Langage / CLI) : Interpréteur PHP en ligne de commande : version, modules, lint, serveur de dev."
tags: [macos, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | PHP |
| **Contexte** | Langage / CLI |
| **Commande type** | `php -l ‹fichier.php›` |

## Rôle

Interpréteur PHP en ligne de commande : version, modules, lint, serveur de dev.

## Options

| Option | Rôle |
| --- | --- |
| `-v` | version de PHP |
| `-m` | liste les modules/extensions chargés |
| `-i` | configuration complète (phpinfo) |
| `-l ‹fichier.php›` | vérifie la syntaxe (lint) |
| `-r ‹code›` | exécute du code PHP directement |
| `-S ‹hôte:port›` | serveur web de développement intégré |
| `-a` | shell interactif (REPL) |
| `-c ‹php.ini›` | utilise un fichier de config précis |

## Exemples

**Version**

```zsh
php -v
```

**Vérifier la syntaxe**

```zsh
php -l index.php
```

**Serveur de dev**

```zsh
php -S localhost:8000 -t public
```

## Dans les autres shells

- [[27-commandes/01-bash/18-php/php|php (Bash)]]
- [[27-commandes/02-powershell/18-php/php|php (PowerShell)]]

*Mots-clés : php cli interpréteur version module lint serveur repl exécuter code lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
