---
title: XFS
description: XFS — système de fichiers journalisé haute performance, par défaut sur RHEL, Rocky et Alma : forces (gros fichiers et volumes, parallélisme), création (mkfs.xfs, alignement RAID, reflink), montage et options, agrandissement à chaud (xfs_growfs, pas de réduction), quotas utilisateur et projet, défragmentation, sauvegarde xfsdump/xfsrestore, vérification et réparation (xfs_repair), informations (xfs_info, xfs_db) et bonnes pratiques.
tags: [xfs, système de fichiers, rhel, quotas, xfs_repair, linux]
icon: info
---

**XFS** est le système de fichiers par défaut de la [[02-famille-red-hat/01-presentation-installation|famille Red Hat]] : excellent sur les gros volumes, les fichiers volumineux et les charges parallèles (bases de données, stockage de sauvegardes, briques [[25-glusterfs/01-presentation-installation|GlusterFS]], machines virtuelles).

## Création et montage

```bash
sudo mkfs.xfs -L donnees /dev/vg_data/lv_donnees                 # reflink activé par défaut (copies légères)
sudo mkfs.xfs -d su=256k,sw=4 /dev/sdb                            # aligné sur un RAID matériel (bande de 256 Kio, 4 disques de données)
echo 'LABEL=donnees /srv/donnees xfs defaults,noatime,prjquota 0 0' | sudo tee -a /etc/fstab
sudo mount -a && xfs_info /srv/donnees
```

## Agrandir (jamais réduire)

```bash
sudo lvextend -L +200G /dev/vg_data/lv_donnees && sudo xfs_growfs /srv/donnees   # à chaud
# Ou en une étape : sudo lvextend -r -L +200G /dev/vg_data/lv_donnees
```

XFS **ne se réduit pas** : prévoir des volumes de taille raisonnable et les agrandir au besoin avec [[29-lvm-mdadm/01-lvm2|LVM]].

## Quotas de projet (par répertoire)

```bash
echo '10:/srv/donnees/equipe-web' | sudo tee -a /etc/projects && echo 'equipe-web:10' | sudo tee -a /etc/projid
sudo xfs_quota -x -c 'project -s equipe-web' /srv/donnees
sudo xfs_quota -x -c 'limit -p bhard=500g equipe-web' /srv/donnees
sudo xfs_quota -x -c 'report -h -p' /srv/donnees
```

## Vérification, réparation, sauvegarde

```bash
sudo umount /srv/donnees && sudo xfs_repair -n /dev/vg_data/lv_donnees      # vérifier sans modifier
sudo xfs_repair /dev/vg_data/lv_donnees                                      # réparer (démonté)
sudo xfsdump -l 0 -f /sauv/donnees.xfsdump /srv/donnees ; sudo xfsrestore -f /sauv/donnees.xfsdump /srv/restaure
sudo xfs_fsr /srv/donnees                                                    # défragmentation en ligne
```

Si `xfs_repair` signale un journal à rejouer : monter puis démonter le volume ; `-L` (effacer le journal) fait perdre les dernières écritures et ne s'utilise qu'en dernier recours.

Commandes : [[90-aide-memoire|aide-mémoire]].
