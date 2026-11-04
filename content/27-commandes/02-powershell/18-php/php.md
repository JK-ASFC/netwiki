---
title: "php"
description: "PowerShell — php (Langage / CLI) : Interpréteur PHP sous Windows (php.exe) : version, modules, lint, serveur de dev."
tags: [powershell, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | PHP |
| **Contexte** | Langage / CLI |
| **Commande type** | `php.exe -l ‹fichier.php›` |

## Rôle

Interpréteur PHP sous Windows (php.exe) : version, modules, lint, serveur de dev.

## Options

| Option | Rôle |
| --- | --- |
| `-v` | version de PHP |
| `-m` | liste les modules/extensions |
| `-i` | configuration complète (phpinfo) |
| `--ini` | indique quel php.ini est chargé |
| `-l ‹fichier.php›` | vérifie la syntaxe (lint) |
| `-r ‹code›` | exécute du code PHP |
| `-S ‹hôte:port›` | serveur de dev intégré |
| `-c ‹php.ini›` | config précise |

## Exemples

**Version**

```powershell
php.exe -v
```

**Quel php.ini ?**

```powershell
php.exe --ini
```

**Serveur de dev**

```powershell
php.exe -S localhost:8000 -t public
```

## Dans les autres shells

- [[27-commandes/01-bash/18-php/php|php (Bash)]]
- [[27-commandes/03-macos/19-php/php|php (macOS)]]

*Mots-clés : php cli interpréteur version module lint serveur repl exécuter code windows wamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
