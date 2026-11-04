---
title: "df"
description: "Bash — df (Gestion du stockage) : Espace par système de fichiers monte."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Gestion du stockage |
| **Commande type** | `df -hT` |

## Rôle

Espace par système de fichiers monte.

## En détail

Affiche l'espace disque de chaque partition : total, utilise, libre. Le réflexe quand un disque se remplit. -h pour des tailles lisibles.

## Options

| Option | Rôle |
| --- | --- |
| `-h` | tailles lisibles |
| `-T` | type de FS |
| `-i` | inodes |

## Exemples

**Ou ca saturé**

```bash
df -h | sort -k5 -hr
```

**Inodes epuises**

```bash
df -i
```

## Dans les autres shells

- [[27-commandes/03-macos/07-disques-stockage/df|df (macOS)]]

*Mots-clés : disque espace stockage partition plein saturé place df*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
