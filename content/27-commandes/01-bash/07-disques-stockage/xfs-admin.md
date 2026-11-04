---
title: "xfs_admin"
description: "Bash — xfs_admin (Disques / XFS) : Administre les paramètres d'un système XFS."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / XFS |
| **Commande type** | `xfs_admin -l /dev/sda1` |

## Rôle

Administre les paramètres d'un système XFS.

## En détail

Gère les paramètres d'un système de fichiers XFS (étiquette, identifiant). Outil spécialisé réservé à l'administration des disques XFS.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | affiche l'étiquette |
| `-L ‹label›` | définit l'étiquette |
| `-u` | affiche l'UUID |
| `-U ‹uuid›` | définit l'UUID |

## Exemples

**Voir le label**

```bash
xfs_admin -l /dev/sda1
```

**Définir un label**

```bash
xfs_admin -L data /dev/sda1
```

**Voir l'UUID**

```bash
xfs_admin -u /dev/sda1
```

*Mots-clés : xfs système fichiers label uuid xfs_admin*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
