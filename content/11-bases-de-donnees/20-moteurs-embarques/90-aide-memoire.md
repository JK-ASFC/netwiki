---
title: Moteurs embarqués — aide-mémoire des commandes
description: Commandes d'inspection et de sauvegarde des moteurs embarqués — LMDB (mdb_stat -e -r -f, mdb_copy -c, mdb_dump, mdb_load), RocksDB (ldb scan, get, dump, manual_compaction, list_column_families ; sst_dump), BadgerDB (badger info, backup, restore, flatten, stream) avec exemples.
tags: [aide-mémoire, lmdb, rocksdb, badgerdb]
icon: terminal
---

Explications : [[01-presentation-comparatif|moteurs embarqués]].

```bash
mdb_stat -e /chemin/env ; mdb_stat -r /chemin/env ; mdb_stat -f /chemin/env
mdb_copy -c /chemin/env /sauv/env ; mdb_dump -a /chemin/env > env.dump ; mdb_load -f env.dump /chemin/nouveau
ldb --db=/chemin/rocksdb list_column_families ; ldb --db=/chemin/rocksdb scan --max_keys=10 ; ldb --db=/chemin/rocksdb get cle
ldb --db=/chemin/rocksdb dump --max_keys=100 ; ldb --db=/chemin/rocksdb manual_compaction
sst_dump --file=/chemin/rocksdb/000123.sst --command=scan --read_num=5
badger info --dir /chemin/badger ; badger backup --dir /chemin/badger -f sauv.bak ; badger restore --dir /chemin/nouveau -f sauv.bak ; badger flatten --dir /chemin/badger
```
