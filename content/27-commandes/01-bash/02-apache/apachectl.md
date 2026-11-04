---
title: "apachectl"
description: "Bash — apachectl (Serveur web / LAMP) : Contrôle d'Apache (Debian : apache2ctl) : test de config, rechargement, diagnostics."
tags: [bash, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Apache |
| **Contexte** | Serveur web / LAMP |
| **Commande type** | `apachectl -t` |

## Rôle

Contrôle d'Apache (Debian : apache2ctl) : test de config, rechargement, diagnostics.

## Options

| Option | Rôle |
| --- | --- |
| `-k ‹start/stop/restart/graceful›` | action sur le démon |
| `-t` | teste la syntaxe de la configuration |
| `-S` | liste les vhosts et leur fichier source |
| `-M` | liste les modules chargés |
| `-V` | version + options de compilation |

## Exemples

**Tester la config**

```bash
apachectl -t
```

**Recharger sans coupure**

```bash
apachectl -k graceful
```

**Lister les vhosts**

```bash
apachectl -S
```

## Dans les autres shells

- [[27-commandes/03-macos/02-apache/apachectl|apachectl (macOS)]]

*Mots-clés : apache httpd apachectl apache2ctl configtest graceful vhost module lamp serveur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
