---
title: "blkid"
description: "Bash — blkid (Systèmes de fichiers) : Affiche l'UUID, le LABEL et le TYPE de chaque périphérique de bloc : la source pour remplir /etc/fstab."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Systèmes de fichiers |
| **Commande type** | `blkid` |

## Rôle

Affiche l'UUID, le LABEL et le TYPE de chaque périphérique de bloc : la source pour remplir /etc/fstab.

## Options

| Option | Rôle |
| --- | --- |
| `-o ‹value/export/list/full/device›` | format de sortie : value (valeur seule), export (KEY=valeur, exploitable en script), list (tableau), device (chemins seuls) |
| `-s ‹UUID/LABEL/TYPE/PARTUUID›` | n'affiche qu'un champ précis (combiner avec -o value pour récupérer la valeur brute) |
| `-p` | sonde le périphérique EN DIRECT au lieu de lire le cache (résultat toujours à jour) |
| `-c /dev/null` | ignore complètement le cache /run/blkid/blkid.tab |
| `-U ‹uuid›` | retrouve le périphérique portant cet UUID |
| `-L ‹label›` | retrouve le périphérique portant ce label |
| `-t ‹TYPE=ext4›` | ne liste que les périphériques correspondant au critère (TYPE=, LABEL=, UUID=) |

## Exemples

**Tout lister**

```bash
sudo blkid
```

**UUID d'une partition**

```bash
sudo blkid -s UUID -o value /dev/sda1
```

**Ligne pour fstab**

```bash
sudo blkid -o export /dev/sda1
```

**Chercher par label**

```bash
sudo blkid -L donnees
```

*Mots-clés : blkid uuid label type fstab périphérique partition identifiant système fichiers*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
