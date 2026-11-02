---
title: Présentation, comparatif et outils
description: Moteurs de stockage clé-valeur embarqués — RocksDB (Meta, arbres LSM, utilisé par Ceph BlueStore, TiKV, Kafka Streams, MyRocks), LevelDB (Google, Chrome, Bitcoin Core), LMDB (Symas, B+arbre mappé en mémoire : OpenLDAP back-mdb, Knot DNS, Postfix, Monero) et BadgerDB (Go, Dgraph) : où on les rencontre, principes LSM et B+arbre, réglages qui comptent pour l'administrateur (taille de map LMDB, compaction RocksDB), outils d'inspection et de sauvegarde (ldb, sst_dump, mdb_stat, mdb_copy, mdb_dump, badger), et pannes typiques.
tags: [rocksdb, leveldb, lmdb, badgerdb, embarqué, lsm, openldap, ceph]
icon: info
---

Ces moteurs ne sont pas des serveurs : ce sont des **bibliothèques** intégrées à d'autres logiciels. L'administrateur les découvre quand un service ralentit, qu'un disque se remplit ou qu'il faut sauvegarder « la base » d'un annuaire ou d'un cluster de stockage.

| Moteur | Structure | Où on le trouve | Langage |
| --- | --- | --- | --- |
| **RocksDB** | Arbre **LSM** (écritures rapides, compaction en arrière-plan) | Ceph **BlueStore** (métadonnées), TiKV ([[12-sql-distribue/03-tidb\|TiDB]]), Kafka Streams, MyRocks, Flink | C++ |
| **LevelDB** | LSM (ancêtre de RocksDB) | Chrome/IndexedDB, Bitcoin Core, anciens outils | C++ |
| **LMDB** | **B+arbre** mappé en mémoire, transactions ACID, lectures sans verrou | **OpenLDAP** `back-mdb`, Knot DNS, Postfix (tables `lmdb:`), Monero | C |
| **BadgerDB** | LSM avec séparation clés/valeurs | [[22-bases-graphes/03-dgraph\|Dgraph]], outils Go | Go |

## LMDB : le cas OpenLDAP

La base `back-mdb` d'[[02-openldap/01-presentation-installation|OpenLDAP]] est un fichier `data.mdb` de taille maximale **fixée** par `olcDbMaxSize` : quand elle est atteinte, les écritures échouent (`MDB_MAP_FULL`).

```bash
sudo mdb_stat -e /var/lib/ldap                 # taille de la map, pages utilisées, lecteurs
sudo mdb_stat -r /var/lib/ldap                 # transactions de lecture ouvertes (lecteurs bloqués)
sudo mdb_copy -c /var/lib/ldap /sauv/ldap-mdb  # copie cohérente et compactée, à chaud
mdb_dump -a /var/lib/ldap > ldap.dump ; mdb_load -f ldap.dump /var/lib/ldap-nouveau
```

Paquet : `lmdb-utils` (Debian/Ubuntu), `lmdb` (RHEL, Alpine). Pour OpenLDAP, la sauvegarde de référence reste `slapcat`.

## RocksDB : compaction et outils

Un RocksDB qui « gonfle » ou des latences en dents de scie traduisent souvent une **compaction** en retard (disque lent, trop d'écritures). Réglages exposés par l'application hôte : taille des *memtables*, niveaux, compression (LZ4/ZSTD), cache de blocs.

```bash
ldb --db=/var/lib/appli/rocksdb scan --max_keys=5      # outil ldb (paquet rocksdb-tools ou compilation)
ldb --db=/var/lib/appli/rocksdb manual_compaction
sst_dump --file=/var/lib/appli/rocksdb/000123.sst --show_properties
# Ceph : ceph-bluestore-tool et « ceph tell osd.N compact » plutôt qu'un accès direct
```

## BadgerDB et LevelDB

```bash
go install github.com/dgraph-io/badger/v4/badger@latest
badger info --dir /srv/appli/badger ; badger backup --dir /srv/appli/badger -f sauv.bak ; badger flatten --dir /srv/appli/badger
```

LevelDB n'a pas d'outil standard d'administration : arrêter l'application et copier le répertoire, ou utiliser l'export de l'application.

> [!WARNING]
> Ne copiez jamais le répertoire d'un moteur LSM ou LMDB pendant que l'application écrit : utilisez l'outil de copie cohérente (`mdb_copy`, sauvegarde de l'application, instantané de volume) ou arrêtez le service.

Commandes : [[90-aide-memoire|aide-mémoire]].
