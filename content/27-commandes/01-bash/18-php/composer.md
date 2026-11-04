---
title: "composer"
description: "Bash — composer (Dépendances / PHP) : Gestionnaire de dépendances PHP : installe et met à jour les bibliothèques."
tags: [bash, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | PHP |
| **Contexte** | Dépendances / PHP |
| **Commande type** | `composer require ‹vendor/paquet›` |

## Rôle

Gestionnaire de dépendances PHP : installe et met à jour les bibliothèques.

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

```bash
composer install --no-dev --optimize-autoloader
```

**Ajouter une lib**

```bash
composer require monolog/monolog
```

**Mettre à jour**

```bash
composer update
```

## Dans les autres shells

- [[27-commandes/02-powershell/18-php/composer|composer (PowerShell)]]
- [[27-commandes/03-macos/19-php/composer|composer (macOS)]]

*Mots-clés : composer dépendances paquet require install update autoload vendor php lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
