---
title: "apropos"
description: "Bash — apropos (Aide & manuel) : Cherche dans les noms et descriptions des pages de manuel."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Aide & manuel |
| **Commande type** | `apropos "copy files"` |

## Rôle

Cherche dans les noms et descriptions des pages de manuel.

## Options

| Option | Rôle |
| --- | --- |
| `-s ‹section›` | limite à une section du manuel |
| `-a` | exige tous les mots-clés |
| `-e` | correspondance exacte |

## Exemples

**Trouver une commande**

```bash
apropos "copy files"
```

**Section 8 seulement**

```bash
apropos -s 8 mount
```

## Dans les autres shells

- [[27-commandes/03-macos/25-systeme/apropos|apropos (macOS)]]

*Mots-clés : aide manuel man chercher mot-clé commande apropos whatis*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
