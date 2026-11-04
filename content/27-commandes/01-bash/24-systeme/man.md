---
title: "man"
description: "Bash — man (Référence & apprentissage) : Manuel d'une commande ; -k cherche par thème."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Référence & apprentissage |
| **Commande type** | `man ssh` |

## Rôle

Manuel d'une commande ; -k cherche par thème.

## En détail

Le manuel intégré : ouvre la documentation complète d'une commande. Le réflexe à avoir quand on ne se souvient plus d'une option.

## Options

| Option | Rôle |
| --- | --- |
| `-k ‹mot›` | recherche par mot-clé |
| `-f ‹commande›` | description courte |
| `N cmd` | section précise |

## Exemples

**Trouver par thème**

```bash
man -k firewall
```

**Format d'un fichier**

```bash
man 5 crontab
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/man|man (macOS)]]

*Mots-clés : aide documentation manuel apprendre référence man apropos*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
