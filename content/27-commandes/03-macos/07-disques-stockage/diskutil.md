---
title: "diskutil"
description: "macOS — diskutil (Disques & volumes (APFS)) : L'outil central de gestion des disques et volumes macOS (APFS/HFS+) : lister, monter, formater, gérer les conteneurs."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques & volumes (APFS) |
| **Commande type** | `diskutil list` |

## Rôle

L'outil central de gestion des disques et volumes macOS (APFS/HFS+) : lister, monter, formater, gérer les conteneurs.

## Options

| Option | Rôle |
| --- | --- |
| `list` | liste les disques, partitions et volumes |
| `info ‹disque›` | détails d'un disque ou volume |
| `mount ‹volume›` | monte un volume |
| `unmount ‹volume›` | démonte un volume |
| `eject ‹disque›` | éjecte un disque |
| `apfs list` | structure des conteneurs APFS |
| `apfs addVolume ‹disque APFS nom›` | ajoute un volume APFS |
| `eraseDisk ‹format nom disque›` | EFFACE et reformate un disque entier |
| `repairVolume ‹volume›` | vérifie et répare un volume |

## Exemples

**Lister**

```zsh
diskutil list
```

**Infos d'un volume**

```zsh
diskutil info /Volumes/Data
```

**Démonter une clé USB**

```zsh
diskutil unmount /Volumes/USB
```

**Formater une clé en ExFAT**

```zsh
diskutil eraseDisk ExFAT CLE /dev/disk4
```

*Mots-clés : disque volume apfs diskutil monter formater partition conteneur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
