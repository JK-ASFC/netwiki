---
title: Bareos — aide-mémoire des commandes
description: Commandes Bareos avec exemples — services, test de configuration (bareos-dir -t), bconsole (status, run, restore, list, llist, messages, cancel, label, update volume, prune, purge, reload, configure add), journaux, sauvegarde du catalogue et diagnostic des clients.
tags: [aide-mémoire, bareos, bconsole, sauvegarde]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|Bareos]].

## Services et configuration

```bash
systemctl status bareos-dir bareos-sd bareos-fd
sudo -u bareos bareos-dir -t && sudo -u bareos bareos-sd -t && bareos-fd -t   # tester la configuration
ls /etc/bareos/bareos-dir.d/{client,job,fileset,schedule,pool,storage}
journalctl -u bareos-dir -f ; tail -f /var/log/bareos/bareos.log
```

## bconsole

```text
status director
status client=srv-web-01-fd
status storage=File
run job=srv-web-01 level=Full yes
run job=BackupCatalog yes
messages
list jobs last
list jobs client=srv-web-01-fd jobstatus=E
llist jobid=1234
list files jobid=1234
cancel jobid=1235
restore client=srv-web-01-fd select current all done yes
restore client=srv-web-01-fd fileset=LinuxServeur before="2026-11-01 23:59:59" file=/etc/nginx/nginx.conf where=/tmp/restauration yes
list volumes pool=Incremental
update volume=Incremental-0042 volstatus=Used
prune volume=Incremental-0042 yes
label storage=File pool=Full volume=Full-0100
reload
configure add client name=srv-db-01-fd address=srv-db-01.corp.exemple.fr password=MotDePasse
show client=srv-db-01-fd
estimate job=srv-web-01 listing
```
