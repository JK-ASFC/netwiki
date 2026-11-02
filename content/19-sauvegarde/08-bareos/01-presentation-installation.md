---
title: Présentation, installation et configuration
description: Bareos (Backup Archiving Recovery Open Sourced) — fork de Bacula, architecture (Director, Storage Daemon, File Daemon, catalogue PostgreSQL, WebUI), dépôts communautaires et abonnement, installation sur Debian/Ubuntu et RHEL (add_bareos_repositories.sh), clients Linux, Windows et macOS, configuration par ressources (Client, FileSet, Schedule, Job, Pool, Storage), sauvegarde sur disque et S3, rotation, chiffrement, restauration, sauvegarde du catalogue et dépannage.
tags: [bareos, sauvegarde, bacula, director, file daemon, postgresql, restauration]
icon: info
---

**Bareos** (AGPL) est une solution de sauvegarde réseau d'entreprise issue de [[03-bacula/01-presentation-architecture|Bacula]] : sauvegardes complètes, différentielles et incrémentales, sur disque, bandes (LTO) ou stockage objet, avec catalogue en base de données, rétention par pools et interface web. Éditeur : Bareos GmbH (dépôts communautaires gratuits, abonnement pour les dépôts testés et le support).

| Composant | Rôle | Port |
| --- | --- | --- |
| **Director** (`bareos-dir`) | Orchestration : planification, tâches, catalogue | 9101 |
| **Storage Daemon** (`bareos-sd`) | Écrit les volumes (fichiers, bandes, S3) | 9103 |
| **File Daemon** (`bareos-fd`) | Client sur chaque machine sauvegardée | 9102 |
| Catalogue | PostgreSQL : index des fichiers et volumes | 5432 |
| **WebUI** | Interface web (PHP) | 80/443 |
| `bconsole` | Console en ligne de commande | — |

## Installation (serveur Debian 12/13 ou Ubuntu, RHEL/Rocky/Alma)

```bash
wget https://download.bareos.org/current/Debian_12/add_bareos_repositories.sh   # adapter la distribution (EL_9, xUbuntu_24.04…)
sudo sh ./add_bareos_repositories.sh && sudo apt update
sudo apt install bareos postgresql bareos-database-postgresql bareos-webui      # dnf install … sur RHEL et dérivés
sudo -u postgres /usr/lib/bareos/scripts/create_bareos_database
sudo -u postgres /usr/lib/bareos/scripts/make_bareos_tables
sudo -u postgres /usr/lib/bareos/scripts/grant_bareos_privileges
sudo systemctl enable --now bareos-dir bareos-sd bareos-fd
```

(Selon la version, l'installateur des paquets propose de créer la base automatiquement via `dbconfig-common`.)

Clients : paquet `bareos-filedaemon` (Linux), installateur `winbareos-*.exe` (Windows, mode silencieux possible), paquet macOS.

## Configuration

Fichiers par ressource dans `/etc/bareos/bareos-dir.d/<type>/<nom>.conf`.

```text /etc/bareos/bareos-dir.d/client/srv-web-01.conf
Client {
  Name = srv-web-01-fd
  Address = srv-web-01.corp.exemple.fr
  Password = "MotDePasseClientLong"
  TLS Enable = yes
}
```

```text /etc/bareos/bareos-dir.d/fileset/LinuxServeur.conf
FileSet {
  Name = "LinuxServeur"
  Include {
    Options { Signature = XXH128; Compression = LZ4; One FS = No; FS Type = ext4; FS Type = xfs }
    File = /etc
    File = /var/www
    File = /home
  }
  Exclude { File = /var/cache; File = /tmp }
}
```

```text /etc/bareos/bareos-dir.d/job/srv-web-01.conf
Job {
  Name = "srv-web-01"
  JobDefs = "DefaultJob"
  Client = srv-web-01-fd
  FileSet = "LinuxServeur"
  Schedule = "WeeklyCycle"
}
```

Côté client, le Director est autorisé dans `/etc/bareos/bareos-fd.d/director/bareos-dir.conf` (même mot de passe). Rechargement : `echo reload | bconsole`.

| Ressource | Rôle |
| --- | --- |
| **Schedule** | `WeeklyCycle` : complète mensuelle, différentielle hebdomadaire, incrémentale quotidienne |
| **Pool** | Rétention (`Volume Retention`), taille maximale des volumes, recyclage — pools *Full*, *Differential*, *Incremental* |
| **Storage** | Périphérique du Storage Daemon : fichiers (`/var/lib/bareos/storage`), bandes, **S3** (droplet/dplcompat) |
| **JobDefs** | Valeurs par défaut communes |

**Plug-ins** : PostgreSQL, MariaDB/MySQL, VMware, **Proxmox** (selon version), LDAP, MSSQL (VSS sous Windows), stockage objet.

## Restauration

```bash
sudo bconsole
*restore client=srv-web-01-fd select current all done   # puis choisir les fichiers (mark, done) et confirmer
*status director
*list jobs client=srv-web-01-fd
```

Par défaut, les fichiers sont restaurés dans `/tmp/bareos-restores` du client (paramètre `where`) : pratique pour comparer avant d'écraser.

## Bonnes pratiques

- Sauvegarde du **catalogue** (tâche `BackupCatalog` fournie) et copie hors site des volumes (tâche *Copy* ou *Migrate* vers un second stockage, S3 avec verrouillage objet).
- **Chiffrement** côté client (PKI : `PKI Signatures`, `PKI Encryption`) et TLS entre composants.
- Tests de restauration réguliers ; surveillance des tâches en échec (e-mail, [[04-zabbix/01-presentation-installation|Zabbix]]).

Interface : [[03-interface-graphique|Bareos WebUI]] · commandes : [[90-aide-memoire|aide-mémoire]].
