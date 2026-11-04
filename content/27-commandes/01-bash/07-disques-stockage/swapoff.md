---
title: "swapoff"
description: "Bash — swapoff (Disques / Swap) : Désactive l'espace d'échange."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / Swap |
| **Commande type** | `swapoff -a` |

## Rôle

Désactive l'espace d'échange.

## En détail

Désactive une zone de swap, par exemple avant de la supprimer ou de la redimensionner.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | désactive TOUTES les zones d'échange actives |
| `-v` | mode verbeux : détaille ce qui est désactivé |

## Exemples

**Tout désactiver**

```bash
swapoff -a
```

**Un fichier**

```bash
swapoff /swapfile
```

**Vérifier**

```bash
swapon --show
```

*Mots-clés : désactiver swap échange swapoff*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
