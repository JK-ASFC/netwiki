---
title: "cd"
description: "Bash — cd (Navigation / Répertoires) : Change de répertoire courant."
tags: [bash, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Navigation / Répertoires |
| **Commande type** | `cd /var/log` |

## Rôle

Change de répertoire courant.

## En détail

Change de dossier courant : la commande pour se déplacer dans l'arborescence. cd seul ramene à votre dossier personnel.

## Options

| Option | Rôle |
| --- | --- |
| `..` | remonte d'un niveau |
| `-` | répertoire précédent |
| `~` | home |
| `(sans arg)` | home |

## Exemples

**Aller quelque part**

```bash
cd /var/log
```

**Revenir**

```bash
cd -
```

**Remonter**

```bash
cd ..
```

## Dans les autres shells

- [[27-commandes/03-macos/15-navigation-fichiers/cd|cd (macOS)]]

*Mots-clés : naviguer répertoire dossier changer cd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
