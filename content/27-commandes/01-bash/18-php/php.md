---
title: "php"
description: "Bash — php (Langage / CLI) : Interpréteur PHP en ligne de commande : version, modules, lint, serveur de dev."
tags: [bash, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
php -v
```

**Vérifier la syntaxe**

```bash
php -l index.php
```

**Serveur de dev**

```bash
php -S localhost:8000 -t public
```

## Dans les autres shells

- [[27-commandes/02-powershell/18-php/php|php (PowerShell)]]
- [[27-commandes/03-macos/19-php/php|php (macOS)]]

*Mots-clés : php cli interpréteur version module lint serveur repl exécuter code lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
