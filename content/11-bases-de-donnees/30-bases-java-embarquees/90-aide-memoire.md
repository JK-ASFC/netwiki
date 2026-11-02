---
title: H2, HSQLDB, Derby et Realm — aide-mémoire
description: Commandes et requêtes H2 (Server, Shell, Script, RunScript, Recover, BACKUP TO), HSQLDB (SqlTool, DatabaseManagerSwing, CHECKPOINT DEFRAG, BACKUP DATABASE, SHUTDOWN COMPACT), Derby (ij, dblook, sysinfo, SYSCS_BACKUP_DATABASE, SYSCS_COMPRESS_TABLE) et Realm Studio, avec exemples.
tags: [aide-mémoire, h2, hsqldb, derby, realm]
icon: terminal
---

Explications : [[01-h2-hsqldb-derby|H2, HSQLDB et Derby]] · [[02-realm|Realm]].

```bash
java -cp h2.jar org.h2.tools.Shell -url jdbc:h2:file:/srv/appli/data/base -user sa
java -cp h2.jar org.h2.tools.Recover -dir /srv/appli/data -db base       # tenter de récupérer une base corrompue
java -jar sqltool.jar --inlineRc=url=jdbc:hsqldb:file:/srv/db/base,user=SA,password=
java -cp derbytools.jar:derby.jar org.apache.derby.tools.dblook -d jdbc:derby:/srv/appli/derbydb -o schema.sql
java -cp derbytools.jar:derby.jar org.apache.derby.tools.sysinfo
```

```sql
-- H2
BACKUP TO '/sauv/base.zip'; SCRIPT TO '/sauv/base.sql'; SHUTDOWN COMPACT;
-- HSQLDB
CHECKPOINT DEFRAG; BACKUP DATABASE TO '/sauv/hsqldb/' BLOCKING; SHUTDOWN COMPACT;
-- Derby (ij)
CALL SYSCS_UTIL.SYSCS_BACKUP_DATABASE('/sauv/derby'); CALL SYSCS_UTIL.SYSCS_COMPRESS_TABLE('APP', 'EVENEMENTS', 1);
```
