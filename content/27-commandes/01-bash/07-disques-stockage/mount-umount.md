---
title: "mount / umount"
description: "Bash — mount / umount (Montage) : Monte (mount) ou démonte (umount) un système de fichiers dans l'arborescence. Les montages permanents se déclarent dans /etc/fstab."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Montage |
| **Commande type** | `mount /dev/sdb1 /mnt` |

## Rôle

Monte (mount) ou démonte (umount) un système de fichiers dans l'arborescence. Les montages permanents se déclarent dans /etc/fstab.

## Options

| Option | Rôle |
| --- | --- |
| `-o ‹options›` | [mount] options séparées par des virgules : ro (lecture seule), noexec (interdit l'exécution), nosuid (ignore les bits setuid), noatime (n'écrit pas la date d'accès), remount (réapplique sans démonter) |
| `-t ‹type›` | [mount] force le type de système de fichiers (ext4, xfs, vfat, nfs, cifs) au lieu de le détecter |
| `-a` | monte (ou démonte) TOUT ce qui est déclaré dans /etc/fstab |
| `-r` | [mount] monte en LECTURE SEULE (équivaut à -o ro) |
| `--bind ‹dossier›` | [mount] rend un dossier déjà existant visible à un second endroit, sans copie ni lien |
| `-v` | mode verbeux : détaille chaque opération |
| ⚠️ `-f` | [umount] FORCE le démontage : à réserver à un partage réseau injoignable (risque de perte de données non écrites) |
| `-l` | [umount] démontage PARESSEUX (lazy) : détache immédiatement l'arborescence et libère réellement quand plus aucun processus ne l'utilise |
| `-R` | [umount] démonte RÉCURSIVEMENT tous les points de montage situés en dessous |
| `-n` | n'écrit pas l'opération dans /etc/mtab |
| `--fake` | [mount] SIMULATION : effectue tout sauf l'appel système de montage |

> [!WARNING]
> Options à manier avec précaution : `-f`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Monter**

```bash
sudo mount /dev/sdb1 /mnt
```

**Lecture seule et durci**

```bash
sudo mount -o ro,noexec,nosuid /dev/sdb1 /mnt
```

**Tout monter depuis fstab**

```bash
sudo mount -a
```

**Démonter**

```bash
sudo umount /mnt
```

**Démontage paresseux**

```bash
sudo umount -l /mnt
```

**Remonter la racine en écriture**

```bash
sudo mount -o remount,rw /
```

*Mots-clés : monter montage démonter partition disque fstab mount umount périphérique point*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
