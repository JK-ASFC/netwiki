---
title: "dd"
description: "Bash — dd (Gestion du stockage) : Copie bloc à bloc : images, clés USB, clonage."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Gestion du stockage |
| **Commande type** | `dd if=image.iso of=/dev/sdb bs=4M status=progress` |

## Rôle

Copie bloc à bloc : images, clés USB, clonage.

## En détail

Copie des données bloc par bloc : créer une clé USB bootable, cloner un disque. Très puissant donc dangereux, une erreur de cible efface tout.

## Options

| Option | Rôle |
| --- | --- |
| `if= ‹source›` | fichier ou périphérique LU (/dev/zéro, /dev/urandom, une image .iso, un disque /dev/sdX) |
| ⚠️ `of= ‹destination›` | fichier ou périphérique ÉCRIT : un mauvais /dev efface tout le disque |
| `bs= ‹taille de bloc (4M)›` | taille de chaque bloc lu/écrit : 4M accélère nettement les gros transferts |
| `count= ‹nombre de blocs›` | s'arrête après N blocs : total copié = bs × count (ex : bs=1M count=1024 → 1 Gio) |
| `status=progress` | affiche la progression en direct |
| `conv= ‹fsync,noerror,sync›` | conversions : fsync (vide le cache avant de rendre la main), noerror (continue malgré les erreurs), sync (complète les blocs incomplets) |
| `iflag= ‹direct,fullblock›` | drapeaux de LECTURE : direct (contourne le cache), fullblock (lit des blocs complets) |
| `oflag= ‹direct,sync,dsync›` | drapeaux d'ÉCRITURE : direct (contourne le cache page), sync/dsync (écriture synchrone, mesure réelle du disque) |
| `seek= ‹n›` | saute N blocs à la DESTINATION avant d'écrire |
| `skip= ‹n›` | saute N blocs à la SOURCE avant de lire |

> [!WARNING]
> Options à manier avec précaution : `of= ‹destination›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**ISO sur clé USB (vérifie of=)**

```bash
sudo dd if=parrot.iso of=/dev/sdb bs=4M status=progress conv=fsync
```

## Dans les autres shells

- [[27-commandes/03-macos/07-disques-stockage/dd|dd (macOS)]]

*Mots-clés : copie bloc image disque cloner iso usb dd flash*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
