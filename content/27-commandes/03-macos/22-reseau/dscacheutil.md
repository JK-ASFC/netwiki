---
title: "dscacheutil"
description: "macOS — dscacheutil (Cache DNS) : Interroge et vide le cache de résolution du système."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Cache DNS |
| **Commande type** | `dscacheutil -q host -a name example.com` |

## Rôle

Interroge et vide le cache de résolution du système.

## Options

| Option | Rôle |
| --- | --- |
| `-q host -a name ‹nom›` | résout via le cache système |
| `-flushcache` | vide le cache d'annuaire et DNS |

## Exemples

**Résoudre via le cache**

```zsh
dscacheutil -q host -a name example.com
```

**Vider le cache DNS**

```zsh
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

## Dans les autres shells

- [[27-commandes/03-macos/06-comptes-utilisateurs/dscacheutil|dscacheutil (macOS)]]

*Mots-clés : dns cache dscacheutil résolution vider flush*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
