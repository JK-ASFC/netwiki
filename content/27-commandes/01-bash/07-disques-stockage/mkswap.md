---
title: "mkswap"
description: "Bash — mkswap (Disques / Swap) : Prépare une partition ou un fichier comme swap."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Disques / Swap |
| **Commande type** | `mkswap /swapfile` |

## Rôle

Prépare une partition ou un fichier comme swap.

## En détail

Prépare un fichier ou une partition pour servir de swap. Étape préalable avant swapon.

## Options

| Option | Rôle |
| --- | --- |
| `-L ‹label›` | étiquette du volume d'échange (utilisable comme LABEL=... dans /etc/fstab) |
| `-f` | force, même si la taille dépasse le périphérique ou si un FS est détecté |
| `-c` | vérifie les blocs défectueux avant de créer la zone |
| `-U ‹UUID›` | impose un UUID précis (sinon généré aléatoirement) |
| `-p ‹taille de page›` | taille de page mémoire à utiliser (rare : archi non standard) |

## Exemples

**Créer le fichier**

```bash
fallocate -l 2G /swapfile
```

**Formater en swap**

```bash
mkswap /swapfile
```

**Activer ensuite**

```bash
swapon /swapfile
```

*Mots-clés : créer formater swap fichier mkswap*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
