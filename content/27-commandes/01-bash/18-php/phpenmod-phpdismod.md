---
title: "phpenmod / phpdismod"
description: "Bash — phpenmod / phpdismod (Configuration / Module) : Active (phpenmod) ou désactive (phpdismod) un module PHP sur Debian/Ubuntu."
tags: [bash, commande, php]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | PHP |
| **Contexte** | Configuration / Module |
| **Commande type** | `phpenmod ‹module›` |

## Rôle

Active (phpenmod) ou désactive (phpdismod) un module PHP sur Debian/Ubuntu.

## Options

| Option | Rôle |
| --- | --- |
| `-v ‹version›` | cible une version de PHP (ex. 8.3) |
| `-s ‹sapi›` | cible un SAPI (cli, fpm, apache2) |
| `(phpdismod ‹module› fait l'inverse)` | désactive le module |
| `(à recharger ensuite)` | systemctl reload php8.3-fpm |

## Exemples

**Activer mbstring**

```bash
phpenmod mbstring
```

**Pour FPM seulement**

```bash
phpenmod -s fpm opcache
```

**Désactiver**

```bash
phpdismod xdebug
```

## Dans les autres shells

- [[27-commandes/03-macos/19-php/phpenmod-phpdismod|phpenmod / phpdismod (macOS)]]

*Mots-clés : php module extension activer désactiver phpenmod phpdismod ini sapi debian lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
