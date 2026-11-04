---
title: "APFS snapshots"
description: "macOS — APFS snapshots (Instantanés APFS) : APFS permet des instantanés du système de fichiers, utilisés par Time Machine (tmutil)."
tags: [macos, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Disques & stockage |
| **Contexte** | Instantanés APFS |
| **Commande type** | `tmutil localsnapshot` |

## Rôle

APFS permet des instantanés du système de fichiers, utilisés par Time Machine (tmutil).

## Options

| Option | Rôle |
| --- | --- |
| `tmutil localsnapshot` | crée un instantané APFS local |
| `tmutil listlocalsnapshots /` | liste les instantanés d'un volume |
| `tmutil deletelocalsnapshots ‹date›` | supprime un instantané |
| `diskutil apfs listSnapshots ‹disque›` | liste via diskutil |

## Exemples

**Créer un instantané**

```zsh
tmutil localsnapshot
```

**Lister**

```zsh
tmutil listlocalsnapshots /
```

**Supprimer**

```zsh
sudo tmutil deletelocalsnapshots 2025-07-01-000000
```

*Mots-clés : snapshot instantané apfs tmutil time machine sauvegarde*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
