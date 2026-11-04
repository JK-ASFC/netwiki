---
title: "incus file"
description: "Bash — incus file (Virtualisation / Fichiers) : Transfère des fichiers entre l'hôte et une instance (push/pull)."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Fichiers |
| **Commande type** | `incus file push ‹local› ‹instance›/‹chemin›` |

## Rôle

Transfère des fichiers entre l'hôte et une instance (push/pull).

## Options

| Option | Rôle |
| --- | --- |
| `push` | envoie un fichier vers l'instance |
| `pull` | récupère un fichier depuis l'instance |
| `-r` | récursif (dossier) |
| `-p` | crée les dossiers parents |
| `--mode ‹0644›` | droits du fichier |

## Exemples

**Envoyer**

```bash
incus file push ./app.conf web/etc/app.conf
```

**Récupérer**

```bash
incus file pull web/var/log/app.log .
```

**Dossier complet**

```bash
incus file push -r ./site web/var/www/
```

*Mots-clés : incus lxd file push pull copier fichier transfert conteneur vm hôte*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
