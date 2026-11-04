---
title: "vi"
description: "Bash — vi (Éditeur modal (vim)) : Éditeur modal puissant, présent sur tous les Unix. Deux modes : Normal (commandes) et Insertion (frappe). Plus rude à apprendre, mais incontournable côté serveur."
tags: [bash, commande, pagers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
vi /etc/ssh/sshd_config
```

**Ouvrir directement à une ligne**

```bash
vi +42 app.log
```

**Comparer deux fichiers**

```bash
vi -d ancien.conf nouveau.conf
```

## Dans les autres shells

- [[27-commandes/03-macos/16-pagers/vi|vi (macOS)]]

*Mots-clés : vi vim éditeur modal serveur normal insertion commande fichier modifier incontournable pager*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
