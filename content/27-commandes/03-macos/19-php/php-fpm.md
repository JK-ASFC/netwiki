---
title: "php-fpm"
description: "macOS — php-fpm (Service / FastCGI) : Gestionnaire de processus FastCGI (sert PHP à Apache/Nginx)."
tags: [macos, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | PHP |
| **Contexte** | Service / FastCGI |
| **Commande type** | `php-fpm -t` |

## Rôle

Gestionnaire de processus FastCGI (sert PHP à Apache/Nginx).

## Options

| Option | Rôle |
| --- | --- |
| `-t` | teste la configuration |
| `-v` | version |
| `-D` | lance en arrière-plan (daemon) |
| `-F` | reste au premier plan (foreground, conteneurs) |
| `-y ‹fichier.conf›` | fichier de config FPM |
| `-c ‹php.ini›` | php.ini à utiliser |

## Exemples

**Tester la config**

```zsh
php-fpm -t
```

**Version**

```zsh
php-fpm -v
```

**Recharger le service**

```zsh
systemctl reload php8.3-fpm
```

## Dans les autres shells

- [[27-commandes/01-bash/18-php/php-fpm|php-fpm (Bash)]]

*Mots-clés : php-fpm fpm fastcgi pool processus service test config socket lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
