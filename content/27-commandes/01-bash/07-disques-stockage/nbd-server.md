---
title: "nbd-server"
description: "Bash — nbd-server (Stockage réseau) : Publie un fichier image ou un périphérique comme disque réseau (NBD), accessible par nbd-client."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Stockage réseau |
| **Commande type** | `nbd-server 10809 /srv/nbd/disk.img` |

## Rôle

Publie un fichier image ou un périphérique comme disque réseau (NBD), accessible par nbd-client.

## Options

| Option | Rôle |
| --- | --- |
| `-r` | export en LECTURE SEULE : les clients ne peuvent pas écrire |
| `-C ‹fichier.conf›` | utilise un fichier de configuration (par défaut /etc/nbd-server/config) |
| `-p ‹fichier.pid›` | écrit le PID du serveur dans ce fichier |
| `-d` | reste en avant-plan sans se détacher (débogage) |
| `-l ‹fichier›` | fichier listant les adresses IP autorisées à se connecter |
| `-o ‹décalage›` | ne publie l'image qu'à partir de cet offset en octets |

## Exemples

**Publier une image**

```bash
sudo nbd-server 10809 /srv/nbd/disk.img
```

**Lecture seule**

```bash
sudo nbd-server 10809 /srv/nbd/disk.img -r
```

**Par fichier de conf**

```bash
sudo nbd-server -C /etc/nbd-server/config
```

*Mots-clés : nbd serveur export disque réseau partage bloc publier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
