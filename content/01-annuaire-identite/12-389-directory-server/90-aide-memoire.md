---
title: 389 Directory Server — aide-mémoire des commandes
description: Commandes 389-DS avec exemples — dscreate, dsctl (status, start, stop, restart, db2ldif, ldif2db, bak2db, healthcheck), dsconf (config, backend, security, pwpolicy, plugin, replication, repl-agmt, backup), dsidm (user, group, account), ldapsearch, ldapmodify et journaux.
tags: [aide-mémoire, 389 directory server, dsconf, dsidm, ldap]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|389 Directory Server]].

```bash
dscreate create-template > instance.inf ; sudo dscreate from-file instance.inf
dsctl -l ; sudo dsctl corp status ; sudo dsctl corp restart
sudo dsctl corp healthcheck                          # contrôle de santé (TLS, réplication, index…)
sudo dsconf corp config get nsslapd-require-secure-binds
sudo dsconf corp backend suffix list
sudo dsconf corp backend index list userroot
sudo dsconf corp backend index add --attr mail --index-type eq --reindex userroot
sudo dsconf corp security get ; sudo dsconf corp security certificate list
sudo dsconf corp pwpolicy get
sudo dsconf corp plugin list ; sudo dsconf corp plugin memberof status
sudo dsconf corp replication status --suffix dc=corp,dc=exemple,dc=fr
sudo dsconf corp replication monitor
sudo dsconf corp repl-agmt list --suffix dc=corp,dc=exemple,dc=fr
sudo dsconf corp backup create ; sudo dsctl corp db2ldif userroot /tmp/export.ldif
sudo dsidm corp user list ; sudo dsidm corp user get alice
sudo dsidm corp account lock uid=bob,ou=people,dc=corp,dc=exemple,dc=fr
sudo dsidm corp group members admins-linux
ldapsearch -H ldaps://ldap-01.corp.exemple.fr -D "cn=Directory Manager" -W -b dc=corp,dc=exemple,dc=fr "(uid=alice)"
ldapmodify -H ldaps://ldap-01.corp.exemple.fr -D "cn=Directory Manager" -W -f modif.ldif
tail -f /var/log/dirsrv/slapd-corp/errors /var/log/dirsrv/slapd-corp/access
```
