---
title: "findmnt"
description: "Bash — findmnt (Inspection) : Affiche les montages sous forme d'arbre, avec leurs options."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Inspection |
| **Commande type** | `findmnt /dev/vda1` |

## Rôle

Affiche les montages sous forme d'arbre, avec leurs options.

## Options

| Option | Rôle |
| --- | --- |
| `-t ‹type›` | filtre par type de FS |
| `-S ‹source›` | par source (périphérique) |
| `-T ‹cible›` | par point de montage |
| `--real` | exclut les pseudo-FS |
| `-D` | sortie façon df |

## Exemples

**Options d'un montage**

```bash
findmnt /dev/vda1
```

**Tout l'arbre**

```bash
findmnt
```

*Mots-clés : montage findmnt options arbre source cible fstab findmnt*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
