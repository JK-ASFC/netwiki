---
title: "composer"
description: "PowerShell — composer (Dépendances / PHP) : Gestionnaire de dépendances PHP (composer.bat sous Windows)."
tags: [powershell, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | PHP |
| **Contexte** | Dépendances / PHP |
| **Commande type** | `composer require ‹vendor/paquet›` |

## Rôle

Gestionnaire de dépendances PHP (composer.bat sous Windows).

## Options

| Option | Rôle |
| --- | --- |
| `install` | installe d'après composer.lock |
| `update` | met à jour et régénère le lock |
| `require ‹vendor/paquet›` | ajoute une dépendance |
| `remove ‹vendor/paquet›` | retire une dépendance |
| `--no-dev` | sans les dépendances de dev |
| `dump-autoload` | régénère l'autoloader |
| `--optimize-autoloader` | autoloader optimisé (prod) |

## Exemples

**Installer (prod)**

```powershell
composer install --no-dev --optimize-autoloader
```

**Ajouter une lib**

```powershell
composer require guzzlehttp/guzzle
```

**Mettre à jour**

```powershell
composer update
```

## Dans les autres shells

- [[27-commandes/01-bash/18-php/composer|composer (Bash)]]
- [[27-commandes/03-macos/19-php/composer|composer (macOS)]]

*Mots-clés : composer dépendances paquet require install update autoload vendor php windows wamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
