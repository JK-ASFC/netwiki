---
title: "apachectl"
description: "macOS — apachectl (Serveur Apache) : Pilote le serveur Apache httpd (fourni par macOS et par brew install httpd)."
tags: [macos, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Apache |
| **Contexte** | Serveur Apache |
| **Commande type** | `apachectl -t` |

## Rôle

Pilote le serveur Apache httpd (fourni par macOS et par brew install httpd).

## Options

| Option | Rôle |
| --- | --- |
| `-k start` | démarre le serveur |
| `-k stop` | arrête le serveur |
| `-k restart` | redémarre |
| `-k graceful` | recharge sans couper les connexions en cours |
| `-t` | teste la syntaxe de la configuration |
| `-S` | liste les hôtes virtuels |
| `-M` | liste les modules chargés |
| `-V` | version et options de compilation |

## Exemples

**Tester la config**

```zsh
apachectl -t
```

**Démarrer**

```zsh
sudo apachectl -k start
```

**Recharger en douceur**

```zsh
sudo apachectl -k graceful
```

## Dans les autres shells

- [[27-commandes/01-bash/02-apache/apachectl|apachectl (Bash)]]

*Mots-clés : apache httpd serveur web apachectl vhost module brew*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
