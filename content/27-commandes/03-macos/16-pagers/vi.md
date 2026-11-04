---
title: "vi"
description: "macOS — vi (Éditeur modal (vim)) : Éditeur modal puissant, présent sur tous les Unix. Deux modes : Normal (commandes) et Insertion (frappe). Plus rude à apprendre, mais incontournable côté serveur."
tags: [macos, commande, pagers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Pagers |
| **Contexte** | Éditeur modal (vim) |
| **Commande type** | `vi fichier` |

## Rôle

Éditeur modal puissant, présent sur tous les Unix. Deux modes : Normal (commandes) et Insertion (frappe). Plus rude à apprendre, mais incontournable côté serveur.

## Options

| Option | Rôle |
| --- | --- |
| `-R` | ouvre en lecture seule (pas de modification) |
| `-d ‹fichier2›` | compare deux fichiers (mode diff) |
| `-O` | ouvre les fichiers côte à côte (split vertical) |
| `-p` | ouvre les fichiers en onglets |

## Exemples

**Éditer un fichier**

```zsh
vi /etc/ssh/sshd_config
```

**Ouvrir directement à une ligne**

```zsh
vi +42 app.log
```

**Comparer deux fichiers**

```zsh
vi -d ancien.conf nouveau.conf
```

## Dans les autres shells

- [[27-commandes/01-bash/16-pagers/vi|vi (Bash)]]

*Mots-clés : vi vim éditeur modal serveur normal insertion commande fichier modifier incontournable pager*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
