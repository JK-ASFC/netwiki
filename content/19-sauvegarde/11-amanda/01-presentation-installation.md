---
title: Présentation, installation et exploitation
description: Amanda (Advanced Maryland Automatic Network Disk Archiver) — sauvegarde réseau historique (licence BSD-like) d'un serveur vers bandes ou disques virtuels : architecture (serveur, clients amandad, configurations, cycle de sauvegarde, niveaux complets et incrémentaux planifiés automatiquement), installation (paquets amanda-server et amanda-client sur Debian/Ubuntu et RHEL), amanda.conf, disklist, bandes virtuelles (chg-disk), .amandahosts, amcheck, amdump, amreport, amrecover, état du projet et alternatives.
tags: [amanda, sauvegarde réseau, bandes, unix, historique]
icon: info
---

**Amanda** sauvegarde de nombreux clients Unix/Linux (et Windows via un agent) depuis un **serveur central** vers des **bandes** ou des **bandes virtuelles** sur disque. Son planificateur répartit automatiquement les sauvegardes complètes au fil du **cycle** (par exemple 7 jours) pour lisser la charge. Les formats sont standard (`tar`, `dump`) : on peut restaurer sans Amanda. Le projet évolue peu ; pour un nouveau déploiement, [[08-bareos/01-presentation-installation|Bareos]], [[03-bacula/01-presentation-architecture|Bacula]] ou [[04-urbackup/01-presentation-installation|UrBackup]] sont plus actifs.

## Installation

```bash
sudo apt install amanda-server amanda-client      # serveur (Debian/Ubuntu) ; clients : amanda-client
sudo dnf install amanda-server amanda-client      # RHEL (EPEL) ; utilisateur système « backup » (Debian) ou « amandabackup » (RHEL)
```

## Configuration (serveur)

```text
# /etc/amanda/Quotidien/amanda.conf — extraits
org "Corp"
mailto "admin@corp.exemple.fr"
dumpcycle 7 days
runspercycle 7
tapecycle 15 tapes
tpchanger "chg-disk:/srv/amanda/vtapes/Quotidien"
labelstr "Quotidien-[0-9][0-9]"
autolabel "Quotidien-%%" empty
define dumptype comp-user-tar { program "GNUTAR" compress client fast index yes }
```

```text
# /etc/amanda/Quotidien/disklist
srv-web-01.corp.exemple.fr  /etc   comp-user-tar
srv-web-01.corp.exemple.fr  /srv   comp-user-tar
```

Côté client, autoriser le serveur dans `~backup/.amandahosts` : `amanda.corp.exemple.fr backup amdump`.

```bash
sudo -u backup amcheck Quotidien          # vérifier serveur, bandes et clients
sudo -u backup amdump Quotidien           # sauvegarde (à planifier chaque nuit par cron)
sudo -u backup amreport Quotidien         # rapport
sudo amrecover Quotidien -s amanda -t amanda    # sur le client, en root : restauration interactive
```

Commandes : [[90-aide-memoire|aide-mémoire]].
