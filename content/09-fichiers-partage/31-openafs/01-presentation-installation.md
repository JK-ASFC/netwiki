---
title: Présentation, installation et exploitation
description: OpenAFS — implémentation libre d'AFS (Andrew File System, IPL) : espace de noms global /afs/<cellule>, authentification Kerberos (jetons aklog), serveurs de base de données (ptserver, vlserver) et de fichiers (fileserver/dafs), volumes, réplication en lecture seule, ACL par répertoire, quotas, cache client, installation (paquets Debian/Ubuntu et RHEL, clients Windows et macOS), commandes vos, pts, fs, bos, sauvegarde, et alternatives modernes.
tags: [openafs, afs, kerberos, système de fichiers distribué, université]
icon: info
---

**AFS** offre un **espace de noms mondial** (`/afs/corp.exemple.fr/…`) accessible de la même façon depuis n'importe quel poste, avec un **cache local** et des **ACL** par répertoire, le tout authentifié par [[04-kerberos/01-presentation-installation|Kerberos]]. OpenAFS reste en service dans des universités, laboratoires de recherche (CERN historiquement) et grandes entreprises, mais on ne le choisit plus guère pour un nouveau projet.

| Serveur | Rôle |
| --- | --- |
| `ptserver` | Utilisateurs et groupes AFS (protection) |
| `vlserver` | Emplacement des volumes |
| `fileserver` / `dafs` | Stockage des volumes (partitions `/vicepa`…) |
| `bosserver` | Supervision des processus serveur |

## Installation

```bash
# Client Debian/Ubuntu (module noyau via DKMS)
sudo apt install openafs-client openafs-modules-dkms openafs-krb5 krb5-user
# Configurer la cellule (corp.exemple.fr) à l'installation, puis
kinit jk@CORP.EXEMPLE.FR && aklog          # jeton AFS à partir du ticket Kerberos
tokens ; ls /afs/corp.exemple.fr/user/j/jk
```

Serveurs : paquets `openafs-fileserver` et `openafs-dbserver` (Debian) ou RPM du site openafs.org (RHEL). Clients Windows et macOS : installeurs openafs.org (ou Auristor, implémentation commerciale compatible).

## Administration

```bash
vos create srv-afs1 a user.jk -maxquota 10000000         # volume de 10 Go
fs mkmount /afs/.corp.exemple.fr/user/j/jk user.jk
fs setacl /afs/corp.exemple.fr/user/j/jk jk all system:anyuser none
pts createuser jk ; pts creategroup jk:projet ; pts adduser alice jk:projet
vos addsite srv-afs2 a logiciels && vos release logiciels    # réplique en lecture seule
fs listquota /afs/corp.exemple.fr/user/j/jk ; fs flushvolume /afs/corp.exemple.fr/logiciels
bos status srv-afs1 -long
vos dump user.jk -file /sauv/user.jk.dump ; vos restore srv-afs1 a user.jk.restaure -file /sauv/user.jk.dump
```

Commandes : [[90-aide-memoire|aide-mémoire]].
