---
title: Exports, montages et autofs
description: Définir des exports NFS (/etc/exports et exports.d, désignation des clients, options rw/ro, sync, root_squash, all_squash, anonuid, sec, crossmnt), appliquer avec exportfs, monter côté client (options hard, vers, nconnect, timeo), fstab, montage automatique systemd et autofs (cartes directes, indirectes, jokers, cartes LDAP).
tags: [nfs, exports, exportfs, fstab, autofs, automount, root_squash]
icon: folder-tree
---

## Exports

```exports /etc/exports.d/projets.exports
# répertoire          client(options)                                    client(options)
/srv/nfs/projets      10.0.20.0/24(rw,sync,root_squash,no_subtree_check)  10.0.30.10(rw,sync,no_root_squash,no_subtree_check)
/srv/nfs/iso          *.corp.exemple.fr(ro,all_squash,anonuid=65534,anongid=65534)
/srv/nfs/home         10.0.0.0/8(rw,sync,sec=krb5p,no_subtree_check)
/srv/nfs/vmware       10.0.40.11(rw,sync,no_root_squash) 10.0.40.12(rw,sync,no_root_squash)
```

> [!WARNING]
> **Pas d'espace** entre le client et la parenthèse : `10.0.20.0/24 (rw)` exporte en lecture seule pour ce réseau **et en lecture-écriture pour tout le monde**.

### Désigner les clients

| Forme | Exemple |
| --- | --- |
| Hôte | `srv-app01.corp.exemple.fr`, `10.0.20.15` |
| Réseau | `10.0.20.0/24` |
| Joker DNS | `*.corp.exemple.fr` (résolution inverse requise) |
| Netgroup | `@serveurs-web` (NIS/LDAP) |
| Tous | `*` (à éviter) |

### Options

| Option | Effet |
| --- | --- |
| `rw` / `ro` | Lecture-écriture / lecture seule |
| `sync` (défaut) / `async` | `async` acquitte avant écriture sur disque : rapide mais **perte de données** possible en cas de panne |
| `root_squash` (défaut) | root du client → `nobody` |
| `no_root_squash` | root du client = root sur l'export (hyperviseurs, sauvegardes) : uniquement pour des clients de confiance |
| `all_squash` + `anonuid`/`anongid` | Tous les utilisateurs → un compte fixe (dépôt public, partage simple) |
| `sec=sys:krb5p` | Modes de sécurité acceptés (dans l'ordre) |
| `secure` (défaut) / `insecure` | Exiger un port source < 1024 (`insecure` pour certains clients macOS, conteneurs) |
| `no_subtree_check` (défaut) | Pas de vérification de sous-arborescence (plus fiable) |
| `crossmnt` / `nohide` | Exposer les systèmes de fichiers montés sous l'export |
| `fsid=<n>` / `fsid=<uuid>` | Identifiant stable (systèmes de fichiers sans UUID, cluster) |

### Appliquer

```bash
sudo exportfs -ra               # relire /etc/exports et exports.d
sudo exportfs -v                # exports actifs avec toutes les options
sudo exportfs -u 10.0.20.0/24:/srv/nfs/projets     # retirer un export à chaud
```

## Pseudo-système de fichiers NFSv4

En NFSv4, le client voit une arborescence virtuelle composée des exports : `mount nfs01:/` montre `/srv/nfs/…`. Sous Linux, l'option `fsid=0` n'est plus nécessaire : les chemins de montage sont identiques en v3 et v4.

## Montage côté client

```bash
sudo mount -t nfs -o vers=4.2,hard,proto=tcp,timeo=600,retrans=2,nconnect=4 \
     nfs01.corp.exemple.fr:/srv/nfs/projets /mnt/projets
findmnt -t nfs4 ; nfsstat -m       # options réellement négociées
```

| Option client | Recommandation |
| --- | --- |
| `hard` (défaut) | Les opérations attendent le retour du serveur : **intégrité garantie** |
| `soft` | Erreur après `retrans` tentatives : risque de corruption silencieuse en écriture ; réservé aux montages en lecture seule non critiques |
| `vers=4.2` | Fixer la version évite les négociations inattendues |
| `timeo=600,retrans=2` | Délais TCP par défaut (60 s) |
| `nconnect=4` | Plusieurs connexions TCP (débit, Linux ≥ 5.3) |
| `noatime` | Moins d'écritures de métadonnées |
| `_netdev`, `nofail` | Attendre le réseau ; ne pas bloquer le démarrage |
| `ro`, `nosuid`, `nodev`, `noexec` | Durcissement selon l'usage |

### /etc/fstab avec montage automatique systemd

```text /etc/fstab
nfs01.corp.exemple.fr:/srv/nfs/projets  /mnt/projets  nfs  vers=4.2,hard,noatime,_netdev,nofail,x-systemd.automount,x-systemd.idle-timeout=600  0 0
```

```bash
sudo systemctl daemon-reload && sudo systemctl restart remote-fs.target
ls /mnt/projets                       # déclenche le montage
```

## autofs

```text /etc/auto.master.d/nfs.autofs
/nfs        /etc/auto.nfs     --timeout=300
/home/ad    /etc/auto.home    --timeout=600
```

```text /etc/auto.nfs (carte indirecte)
projets   -rw,hard,vers=4.2           nfs01.corp.exemple.fr:/srv/nfs/projets
iso       -ro,vers=4.2                nfs01.corp.exemple.fr:/srv/nfs/iso
```

```text /etc/auto.home (joker : un montage par utilisateur)
*         -rw,hard,vers=4.2,sec=krb5p nfs01.corp.exemple.fr:/srv/nfs/home/&
```

```bash
sudo apt install autofs            # ou dnf install autofs
sudo systemctl enable --now autofs
ls /nfs/projets                    # montage à la demande
automount -m                       # cartes chargées
```

| Fonction autofs | Détail |
| --- | --- |
| Carte directe | `/-  /etc/auto.direct` puis `/chemin/absolu  options  serveur:/export` |
| Plusieurs serveurs | `nfs01,nfs02:/srv/nfs/iso` (réplicas en lecture seule, le plus proche est choisi) |
| Cartes dans l'annuaire | Cartes stockées dans LDAP/AD (`automountMap`, SSSD `autofs_provider = ldap`/`ad`) : configuration centralisée pour tous les clients |
