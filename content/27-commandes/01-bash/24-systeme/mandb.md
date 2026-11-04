---
title: "mandb"
description: "Bash — mandb (Aide & manuel) : Reconstruit l'index (base de données) des pages de manuel, pour que « man -k » et « apropos » retrouvent les commandes récemment installées."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Aide & manuel |
| **Commande type** | `mandb` |

## Rôle

Reconstruit l'index (base de données) des pages de manuel, pour que « man -k » et « apropos » retrouvent les commandes récemment installées.

## En détail

Reconstruit l'index des pages de manuel. À lancer après avoir installé des outils si « man -k » ou apropos ne les trouvent pas encore.

## Options

| Option | Rôle |
| --- | --- |
| `-c` | reconstruit entièrement les index (repart de zéro) |
| `-q` | mode silencieux |
| `-f ‹fichier›` | ne traite qu'une page précise |

## Exemples

**Mettre à jour l'index**

```bash
sudo mandb
```

**Reconstruire tout**

```bash
sudo mandb -c
```

*Mots-clés : man manuel index base apropos whatis reconstruire mandb*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
