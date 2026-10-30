---
title: Installation et configuration
description: Installer Bacula Community (Director, Storage Daemon, catalogue PostgreSQL, File Daemons Linux, Windows et macOS), écrire bacula-dir.conf (Director, JobDefs, Job, FileSet, Schedule, Client, Storage, Pool, Catalog, Messages), bacula-sd.conf (périphérique disque et changeur de bandes) et bacula-fd.conf, mots de passe et TLS, chiffrement des données côté client, vérifier et recharger la configuration.
tags: [bacula, installation, bacula-dir.conf, fileset, pool, bacula-sd, bacula-fd, tls]
icon: settings-2
---

## Installation

```bash
# Serveur Debian / Ubuntu (paquets de la distribution) avec catalogue PostgreSQL
sudo apt install postgresql bacula-director-pgsql bacula-sd bacula-console
# Dépôt officiel Bacula Community : ajouter le dépôt fourni après inscription, puis
# sudo apt install bacula-postgresql

# Client Linux
sudo apt install bacula-fd            # ou dnf install bacula-client
sudo firewall-cmd --permanent --add-port=9102/tcp && sudo firewall-cmd --reload
```

Clients **Windows** : installateur du File Daemon (64 bits) depuis bacula.org — renseigner le nom du Director et le mot de passe ; il utilise **VSS** automatiquement. Clients **macOS** : paquet du File Daemon ou `brew install bacula-fd`.

Ports à ouvrir : 9101 (consoles → Director), 9102 (Director → clients), 9103 (clients et Director → Storage Daemon).

## bacula-dir.conf

```bacula /etc/bacula/bacula-dir.conf (extraits)
Director {
  Name = srv-sav-01-dir
  DIRport = 9101
  QueryFile = "/etc/bacula/scripts/query.sql"
  WorkingDirectory = "/var/lib/bacula"
  PidDirectory = "/run/bacula"
  Maximum Concurrent Jobs = 20
  Password = "MotDePasseConsole"
  Messages = Daemon
}

JobDefs {
  Name = "DefautLinux"
  Type = Backup
  Level = Incremental
  FileSet = "Linux-Base"
  Schedule = "Cycle-Mensuel"
  Storage = Disque1
  Messages = Standard
  Pool = Incr-Pool
  Full Backup Pool = Full-Pool
  Differential Backup Pool = Diff-Pool
  Incremental Backup Pool = Incr-Pool
  Priority = 10
  Write Bootstrap = "/var/lib/bacula/%c.bsr"
}

Job {
  Name = "srv-web-01"
  JobDefs = "DefautLinux"
  Client = srv-web-01-fd
  ClientRunBeforeJob = "/usr/local/sbin/vidages-bdd.sh"
}

FileSet {
  Name = "Linux-Base"
  Include {
    Options {
      signature = MD5
      compression = LZO
      onefs = no
      fstype = ext4
      fstype = xfs
    }
    File = /etc
    File = /srv
    File = /var/backups
  }
  Exclude {
    File = /srv/tmp
    File = /proc
    File = /sys
  }
}

Schedule {
  Name = "Cycle-Mensuel"
  Run = Full 1st sun at 23:05
  Run = Differential 2nd-5th sun at 23:05
  Run = Incremental mon-sat at 23:05
}

Client {
  Name = srv-web-01-fd
  Address = srv-web-01.corp.exemple.fr
  FDPort = 9102
  Catalog = Catalogue
  Password = "MotDePasseFD-srv-web-01"
  File Retention = 60 days
  Job Retention = 6 months
  AutoPrune = yes
}

Storage {
  Name = Disque1
  Address = srv-sav-01.corp.exemple.fr
  SDPort = 9103
  Password = "MotDePasseSD"
  Device = FichierDisque1
  Media Type = File1
  Maximum Concurrent Jobs = 10
}

Pool {
  Name = Full-Pool
  Pool Type = Backup
  Recycle = yes
  AutoPrune = yes
  Volume Retention = 6 months
  Maximum Volume Bytes = 50G
  Maximum Volumes = 100
  Label Format = "Full-"
}

Pool {
  Name = Incr-Pool
  Pool Type = Backup
  Recycle = yes
  AutoPrune = yes
  Volume Retention = 40 days
  Maximum Volume Jobs = 1
  Label Format = "Incr-"
}

Catalog {
  Name = Catalogue
  dbname = "bacula"
  dbuser = "bacula"
  dbpassword = "MotDePasseBdd"
}

Messages {
  Name = Standard
  mailcommand = "/usr/sbin/bsmtp -h smtp.corp.exemple.fr -f \"Bacula <bacula@corp.exemple.fr>\" -s \"Bacula : %t %e de %c %l\" %r"
  mail on error = admins-sauvegarde@corp.exemple.fr = all, !skipped
  console = all, !skipped, !saved
  append = "/var/log/bacula/bacula.log" = all, !skipped
  catalog = all
}
```

Pour Windows, un FileSet dédié : `File = "C:/"`, `Options { signature = MD5; IgnoreCase = yes; Exclude = yes; WildFile = "*.tmp" }`, exclusion de `pagefile.sys` et `hiberfil.sys` ; l'option `Enable VSS = yes` est active par défaut.

## bacula-sd.conf

```bacula /etc/bacula/bacula-sd.conf
Storage {
  Name = srv-sav-01-sd
  SDPort = 9103
  WorkingDirectory = "/var/lib/bacula"
  Pid Directory = "/run/bacula"
  Maximum Concurrent Jobs = 20
}

Director {
  Name = srv-sav-01-dir
  Password = "MotDePasseSD"
}

Device {
  Name = FichierDisque1
  Media Type = File1
  Archive Device = /srv/bacula/volumes
  LabelMedia = yes
  Random Access = yes
  AutomaticMount = yes
  RemovableMedia = no
  AlwaysOpen = no
  Maximum Concurrent Jobs = 5
}

# Robotique LTO
Autochanger {
  Name = Robot-LTO
  Device = LTO-1
  Changer Command = "/etc/bacula/scripts/mtx-changer %c %o %S %a %d"
  Changer Device = /dev/sg3
}

Device {
  Name = LTO-1
  Media Type = LTO-9
  Archive Device = /dev/nst0
  AutoChanger = yes
  Drive Index = 0
  AutomaticMount = yes
  AlwaysOpen = yes
  RemovableMedia = yes
  Random Access = no
}
```

## bacula-fd.conf (client)

```bacula /etc/bacula/bacula-fd.conf
Director {
  Name = srv-sav-01-dir
  Password = "MotDePasseFD-srv-web-01"
}

FileDaemon {
  Name = srv-web-01-fd
  FDport = 9102
  WorkingDirectory = /var/lib/bacula
  Pid Directory = /run/bacula
  Maximum Concurrent Jobs = 5
  # Chiffrement des données sur le client (le serveur ne peut pas les lire)
  PKI Signatures = Yes
  PKI Encryption = Yes
  PKI Keypair = "/etc/bacula/srv-web-01.pem"
  PKI Master Key = "/etc/bacula/cle-maitresse.cert"
}

Messages {
  Name = Standard
  director = srv-sav-01-dir = all, !skipped, !restored
}
```

> [!WARNING]
> Avec le chiffrement PKI, conservez la paire de clés de chaque client **et** la clé maîtresse (privée) hors ligne : sans elles, aucune restauration n'est possible (par exemple après la perte du serveur client).

## Sécurité des communications

Les **mots de passe** (différents par client) authentifient les composants entre eux. Depuis Bacula 11, les communications sont chiffrées par **TLS-PSK** automatiquement ; pour des certificats, ajoutez `TLS Enable = yes`, `TLS Require = yes`, `TLS Certificate`, `TLS Key`, `TLS CA Certificate File` dans chaque ressource.

## Vérifier et recharger

```bash
sudo bacula-dir -t -c /etc/bacula/bacula-dir.conf
sudo bacula-sd -t -c /etc/bacula/bacula-sd.conf
sudo bacula-fd -t -c /etc/bacula/bacula-fd.conf
echo "reload" | sudo bconsole
```

Suite : [[03-exploitation-restauration|exploitation et restauration]].
