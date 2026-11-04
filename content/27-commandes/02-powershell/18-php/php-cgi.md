---
title: "php-cgi"
description: "PowerShell — php-cgi (FastCGI / WAMP) : Exécutable FastCGI de PHP sous Windows (php-cgi.exe), branché à Apache via mod_fcgid."
tags: [powershell, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | PHP |
| **Contexte** | FastCGI / WAMP |
| **Commande type** | `php-cgi.exe -b 127.0.0.1:9000` |

## Rôle

Exécutable FastCGI de PHP sous Windows (php-cgi.exe), branché à Apache via mod_fcgid.

## Options

| Option | Rôle |
| --- | --- |
| `-b ‹hôte:port›` | écoute en FastCGI sur l'adresse |
| `-v` | version |
| `-m` | modules chargés |
| `-i` | phpinfo |
| `-c ‹php.ini›` | fichier de config |

## Exemples

**Lancer FastCGI**

```powershell
php-cgi.exe -b 127.0.0.1:9000
```

**Version**

```powershell
php-cgi.exe -v
```

**Modules**

```powershell
php-cgi.exe -m
```

*Mots-clés : php-cgi fastcgi fcgi windows wamp apache mod_fcgid port socket php*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
