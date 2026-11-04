---
title: "fsutil"
description: "PowerShell — fsutil (Systèmes de fichiers) : Paramètres bas niveau d'un volume NTFS : l'équivalent Windows de tune2fs/blkid."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Systèmes de fichiers |
| **Commande type** | `fsutil fsinfo volumeinfo C:` |

## Rôle

Paramètres bas niveau d'un volume NTFS : l'équivalent Windows de tune2fs/blkid.

## Options

| Option | Rôle |
| --- | --- |
| `fsinfo volumeinfo ‹C:›` | affiche le nom, le numéro de série et les caractéristiques du volume (proche de blkid) |
| `fsinfo drives` | liste tous les lecteurs présents |
| `fsinfo ntfsinfo ‹C:›` | détaille les paramètres NTFS : taille de cluster, MFT, secteurs (proche de tune2fs -l) |
| `volume diskfree ‹C:›` | espace libre, total et disponible |
| `dirty query ‹C:›` | indique si le volume est marqué « sale » (vérification requise au prochain démarrage) |
| `behavior query DisableLastAccess` | lit le réglage d'horodatage du dernier accès (équivalent du relatime/noatime) |

## Exemples

**Infos du volume**

```powershell
fsutil fsinfo volumeinfo C:
```

**Détail NTFS**

```powershell
fsutil fsinfo ntfsinfo C:
```

**Espace libre**

```powershell
fsutil volume diskfree C:
```

*Mots-clés : ntfs volume superbloc tune2fs blkid équivalent uuid label système fichiers*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
