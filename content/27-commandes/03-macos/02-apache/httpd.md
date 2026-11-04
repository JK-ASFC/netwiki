---
title: "httpd"
description: "macOS — httpd (Binaire Apache) : Le binaire du serveur Apache : version, test, modules."
tags: [macos, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Apache |
| **Contexte** | Binaire Apache |
| **Commande type** | `httpd -v` |

## Rôle

Le binaire du serveur Apache : version, test, modules.

## Options

| Option | Rôle |
| --- | --- |
| `-v` | version |
| `-t` | teste la configuration |
| `-M` | liste les modules |
| `-S` | liste les hôtes virtuels |
| `-f ‹conf›` | utilise un fichier de configuration précis |

## Exemples

**Version**

```zsh
httpd -v
```

**Tester**

```zsh
httpd -t
```

**Modules**

```zsh
httpd -M
```

## Dans les autres shells

- [[27-commandes/02-powershell/02-apache/httpd|httpd (PowerShell)]]

*Mots-clés : apache httpd serveur web binaire version modules*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
