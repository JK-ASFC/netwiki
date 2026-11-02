---
title: Présentation, installation et exploitation
description: FoundationDB — base clé-valeur ordonnée, distribuée et transactionnelle (ACID, sérialisable) d'Apple (Apache 2.0), utilisée comme socle par d'autres systèmes (Snowflake, Apple CloudKit, Record Layer) : architecture (coordinateurs, processus stateless et stockage), installation (paquets foundationdb-clients et foundationdb-server pour Debian/Ubuntu et RHEL, macOS, Docker), fichier fdb.cluster, foundationdb.conf, fdbcli (status, configure, coordinators, exclude, include), modes de redondance et moteurs de stockage, sauvegarde fdbbackup et restauration, supervision.
tags: [foundationdb, clé-valeur, acid, distribué, apple, fdbcli]
icon: info
---

**FoundationDB** fournit un magasin **clé-valeur trié** avec des **transactions ACID** sur tout le cluster. On l'utilise rarement directement : il sert de **socle** à des « couches » (documents, files, index) développées au-dessus. Il est réputé pour sa robustesse (tests de simulation déterministes).

## Installation

```bash
# Debian/Ubuntu : paquets des versions GitHub (apple/foundationdb)
VER=7.3.57     # version courante sur la page des versions
wget https://github.com/apple/foundationdb/releases/download/${VER}/foundationdb-clients_${VER}-1_amd64.deb \
     https://github.com/apple/foundationdb/releases/download/${VER}/foundationdb-server_${VER}-1_amd64.deb
sudo apt install ./foundationdb-clients_${VER}-1_amd64.deb ./foundationdb-server_${VER}-1_amd64.deb
fdbcli --exec status
```

RHEL : RPM équivalents. macOS : paquet `.pkg`. Docker : `foundationdb/foundationdb`. Windows : plus de version serveur maintenue (clients uniquement selon les versions).

## Passer en cluster

1. Copier le même `/etc/foundationdb/fdb.cluster` sur tous les nœuds (format `description:id@ip:port,ip:port,…`).
2. Dans `/etc/foundationdb/foundationdb.conf`, déclarer un processus `[fdbserver.4500]`, `[fdbserver.4501]`… par cœur et `public-address`.
3. Configurer la redondance et les coordinateurs :

```text
fdbcli> configure new triple ssd-redwood-1      # nouvelle base : 3 copies, moteur Redwood
fdbcli> configure double                        # base existante : 2 copies
fdbcli> coordinators auto
fdbcli> status details
fdbcli> exclude 10.0.20.183:4500                # retirer proprement un processus (migration des données)
fdbcli> include 10.0.20.183:4500
```

## Sauvegarde

```bash
sudo systemctl enable --now foundationdb   # backup_agent est lancé par foundationdb.conf ([backup_agent])
fdbbackup start -d file:///sauv/fdb -z      # sauvegarde continue (-z : instantanée puis flux)
fdbbackup status ; fdbbackup discontinue
fdbrestore start -r file:///sauv/fdb/backup-2026-11-02-01-00-00.123456 --dest-cluster-file /etc/foundationdb/fdb.cluster
```

`status json` alimente la supervision (exporteurs Prometheus communautaires). Commandes : [[90-aide-memoire|aide-mémoire]].
