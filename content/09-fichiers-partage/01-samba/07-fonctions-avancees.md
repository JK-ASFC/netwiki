---
title: Corbeille, versions précédentes, macOS, DFS, CTDB
description: Fonctions avancées de Samba — corbeille réseau (vfs_recycle), « Versions précédentes » sur instantanés ZFS, Btrfs ou LVM (vfs_shadow_copy2), clients macOS et sauvegarde Time Machine (vfs_fruit), espace de noms DFS, serveur d'impression, et cluster actif-actif avec CTDB.
tags: [samba, vfs, recycle, shadow_copy2, fruit, time machine, dfs, ctdb, impression]
icon: sparkles
---

> [!NOTE]
> Les modules `vfs objects` s'**enchaînent** dans l'ordre indiqué, et une ligne `vfs objects` dans un partage **remplace** celle de `[global]` : répétez-y `acl_xattr` si nécessaire.

## Corbeille réseau

```smb
[donnees]
   path = /srv/samba/donnees
   read only = no
   vfs objects = acl_xattr recycle
   recycle:repository = .corbeille/%U
   recycle:keeptree = yes
   recycle:versions = yes
   recycle:touch = yes
   recycle:directory_mode = 0770
   recycle:exclude = *.tmp, ~$*, *.lnk
   recycle:exclude_dir = .corbeille, tmp
   recycle:maxsize = 2147483648
```

```bash
# Purge des éléments de plus de 30 jours (cron quotidien)
find /srv/samba/donnees/.corbeille -type f -atime +30 -delete
find /srv/samba/donnees/.corbeille -mindepth 1 -type d -empty -delete
```

## Versions précédentes (instantanés)

Le module `shadow_copy2` présente les instantanés du système de fichiers dans l'onglet **Versions précédentes** de l'Explorateur Windows.

```smb
[donnees]
   vfs objects = acl_xattr shadow_copy2
   # ZFS (zfs-auto-snapshot)
   shadow:snapdir = .zfs/snapshot
   shadow:format = zfs-auto-snap_hourly-%Y-%m-%d-%H%M
   shadow:sort = desc
   shadow:localtime = no
```

| Stockage | Mise en œuvre |
| --- | --- |
| **ZFS** | `zfs-auto-snapshot` ou sanoid ; `shadow:snapdir = .zfs/snapshot` |
| **Btrfs** + snapper | Module `vfs_snapper` (ou `shadow_copy2` avec `shadow:snapdir = .snapshots` et `shadow:snapdirseverywhere`) |
| LVM thin | Instantanés montés sous un répertoire au format attendu (`@GMT-%Y.%m.%d-%H.%M.%S`) |

> [!TIP]
> Les instantanés protègent efficacement contre les suppressions accidentelles et les **rançongiciels** (s'ils ne sont pas modifiables depuis le partage) ; ils ne remplacent pas une sauvegarde externe.

## Clients macOS et Time Machine

```smb
[global]
   vfs objects = catia fruit streams_xattr acl_xattr
   fruit:metadata = stream
   fruit:model = MacSamba
   fruit:posix_rename = yes
   fruit:veto_appledouble = no
   fruit:nfs_aces = no
   fruit:wipe_intentionally_left_blank_rfork = yes
   fruit:delete_empty_adfiles = yes

[timemachine]
   path = /srv/timemachine
   valid users = @sauvegarde-mac
   read only = no
   fruit:time machine = yes
   fruit:time machine max size = 1T
```

- `fruit` gère les métadonnées et *resource forks* Apple, les noms de fichiers avec caractères spéciaux (`catia`) et améliore les performances du Finder.
- Avec Avahi installé, Samba annonce automatiquement le service SMB et la destination Time Machine (Bonjour).
- Le système de fichiers doit prendre en charge des attributs étendus volumineux (ext4, XFS, ZFS conviennent).

## Espace de noms DFS

```smb
[global]
   host msdfs = yes

[dfs]
   path = /srv/samba/dfs
   msdfs root = yes
   read only = yes
```

```bash
cd /srv/samba/dfs
sudo ln -s 'msdfs:fs01\projets,fs02\projets' projets        # deux cibles (redondance côté client)
sudo ln -s 'msdfs:fs03.corp.exemple.fr\archives' archives
```

Les clients accèdent à `\\fs01\dfs\projets` et sont redirigés vers la cible. La **réplication** entre cibles (DFS-R) n'existe pas dans Samba : utilisez rsync, Syncthing ou un stockage partagé.

## Serveur d'impression

```smb
[global]
   printing = cups
   printcap name = cups
   load printers = yes
   rpc_server:spoolss = external
   rpc_daemon:spoolssd = fork

[printers]
   path = /var/spool/samba
   printable = yes
   browseable = no

[print$]
   path = /var/lib/samba/printers
   read only = yes
   write list = @"admins du domaine"
```

Depuis *PrintNightmare*, Windows restreint l'installation de pilotes par *Point and Print* : préférez l'impression **IPP** directe ou des pilotes déployés par GPO/Intune, et réservez Samba au partage de files d'attente CUPS existantes.

## Cluster avec CTDB

**CTDB** permet à plusieurs nœuds Samba de servir **les mêmes partages** en actif-actif sur un système de fichiers en cluster (CephFS, GlusterFS, GPFS, OCFS2).

```text /etc/ctdb/nodes
10.0.30.11
10.0.30.12
10.0.30.13
```

```text /etc/ctdb/public_addresses
10.0.20.50/24 ens192
10.0.20.51/24 ens192
```

```smb
[global]
   clustering = yes
   # idmap et secrets partagés via CTDB ; stockage commun monté sur tous les nœuds
```

| Élément | Rôle |
| --- | --- |
| Adresses publiques | Réparties entre les nœuds, déplacées en cas de panne (enregistrements DNS multiples vers ces IP) |
| Base TDB en cluster | Verrous, sessions, idmap partagés |
| Fichier de verrou de récupération | Sur le stockage partagé, arbitre les élections |

```bash
ctdb status
ctdb ip
```
