---
title: Firebird — aide-mémoire des commandes
description: Commandes Firebird avec exemples — isql (connexion, SHOW, INPUT, SET STATS), gbak (-b, -c, -rep, -v, -se, -par), nbackup (-B, -R, -L, -N), gfix (-sweep, -shut, -online, -validate, -mend, -housekeeping), gstat (-h, -a, -r), fbtracemgr, gsec, gestion du service.
tags: [aide-mémoire, firebird, gbak, isql]
icon: terminal
---

Explications : [[01-presentation-installation|Firebird]].

```bash
isql -user SYSDBA -password "$MDP" localhost:compta          # SQL> SHOW TABLES; SHOW TABLE ECRITURES; INPUT script.sql; SET STATS ON; QUIT;
isql -user SYSDBA -password "$MDP" -i script.sql localhost:compta
gbak -b -v -par 4 -user SYSDBA -password "$MDP" localhost:compta /sauv/compta.fbk
gbak -c -v -user SYSDBA -password "$MDP" /sauv/compta.fbk localhost:/srv/firebird/compta-restaure.fdb
gbak -rep -user SYSDBA -password "$MDP" /sauv/compta.fbk localhost:compta     # remplacer (base fermée)
gbak -b -se localhost:service_mgr -user SYSDBA -password "$MDP" compta /sauv/compta.fbk   # via le gestionnaire de services
nbackup -U SYSDBA -P "$MDP" -B 1 compta /sauv/compta.nbk1 ; nbackup -U SYSDBA -P "$MDP" -R /srv/firebird/compta-r.fdb /sauv/compta.nbk0 /sauv/compta.nbk1
gfix -validate -full -user SYSDBA -password "$MDP" localhost:compta ; gfix -mend -user SYSDBA -password "$MDP" localhost:compta
gfix -housekeeping 0 -user SYSDBA -password "$MDP" localhost:compta          # désactiver le sweep automatique
gstat -h localhost:compta ; gstat -a -r localhost:compta > stats.txt
sudo systemctl status firebird ; ss -tlnp | grep 3050
```
