---
title: Présentation, installation et exploitation
description: GlusterFS — système de fichiers distribué en espace utilisateur (Red Hat, GPL) : état du projet (fin de Red Hat Gluster Storage, maintenance communautaire), briques, pools de confiance, types de volumes (distribué, répliqué, arbitre, dispersé), installation sur Debian/Ubuntu et RHEL, création d'un volume répliqué à 3 ou 2 + arbitre, montage client FUSE et options, quotas, auto-réparation (heal), split-brain, géo-réplication, instantanés et supervision.
tags: [glusterfs, stockage distribué, réplication, fuse, briques]
icon: info
---

**GlusterFS** assemble des répertoires (« **briques** ») de plusieurs serveurs en un **volume** unique monté par les clients. Simple à comprendre (des fichiers ordinaires sur XFS), il a longtemps servi pour le partage entre serveurs web, la virtualisation ou les NAS évolutifs. Red Hat a arrêté son produit commercial (fin de support fin 2024) ; le projet communautaire est maintenu à un rythme réduit — pour un nouveau déploiement, comparez avec [[24-ceph/01-presentation-installation|CephFS]].

| Type de volume | Principe |
| --- | --- |
| Distribué | Fichiers répartis, aucune redondance |
| **Répliqué 3** | Chaque fichier sur 3 briques |
| **Répliqué 2 + arbitre** | 2 copies + 1 brique de métadonnées (évite le split-brain à moindre coût) |
| Dispersé | Codage d'effacement (n briques dont k de redondance) |

## Installation

```bash
sudo apt install glusterfs-server              # Debian/Ubuntu (PPA gluster pour les versions récentes)
sudo dnf install centos-release-gluster11 && sudo dnf install glusterfs-server   # Rocky/Alma/CentOS Stream
sudo systemctl enable --now glusterd
# Brique sur un disque dédié formaté en XFS
sudo mkfs.xfs -i size=512 /dev/sdb && sudo mkdir -p /srv/gluster && echo '/dev/sdb /srv/gluster xfs defaults 0 0' | sudo tee -a /etc/fstab && sudo mount -a
sudo mkdir -p /srv/gluster/web
```

```bash
# Depuis gl1
sudo gluster peer probe gl2 && sudo gluster peer probe gl3 && sudo gluster peer status
sudo gluster volume create web replica 3 arbiter 1 gl1:/srv/gluster/web gl2:/srv/gluster/web gl3:/srv/gluster/web
sudo gluster volume set web auth.allow 10.0.20.*
sudo gluster volume start web && sudo gluster volume info web
```

Ports : 24007 (glusterd), 49152 et suivants (une par brique) — à ouvrir entre serveurs et clients.

## Clients

```bash
sudo apt install glusterfs-client
sudo mount -t glusterfs -o backup-volfile-servers=gl2:gl3 gl1:/web /var/www/partage
echo 'gl1:/web /var/www/partage glusterfs defaults,_netdev,backup-volfile-servers=gl2:gl3 0 0' | sudo tee -a /etc/fstab
```

Windows : pas de client natif (exporter via [[01-samba/01-presentation|Samba]] avec le module `vfs_glusterfs`).

## Exploitation

```bash
sudo gluster volume status web detail
sudo gluster volume heal web info ; sudo gluster volume heal web info split-brain
sudo gluster volume quota web enable && sudo gluster volume quota web limit-usage /clients 500GB
sudo gluster volume replace-brick web gl3:/srv/gluster/web gl4:/srv/gluster/web commit force   # remplacer un serveur
sudo gluster snapshot create avant-maj web       # nécessite des briques sur LVM thin
```

Commandes : [[90-aide-memoire|aide-mémoire]].
