---
title: OpenAFS — aide-mémoire des commandes
description: Commandes OpenAFS avec exemples — client (kinit, aklog, tokens, unlog, fs whereis, fs listacl, fs setacl, fs listquota, fs checkservers, fs flush), protection (pts examine, createuser, creategroup, adduser, membership), volumes (vos listvol, examine, create, move, release, addsite, dump, restore, backup), serveurs (bos status, restart, getlog).
tags: [aide-mémoire, openafs, afs, vos, pts]
icon: terminal
---

Explications : [[01-presentation-installation|OpenAFS]].

```bash
kinit jk ; aklog ; tokens ; unlog
fs whereis /afs/corp.exemple.fr/user/j/jk ; fs listacl . ; fs setacl . alice rlidwk ; fs listquota . ; fs checkservers ; fs flush fichier
pts examine jk ; pts membership jk ; pts createuser bob ; pts creategroup jk:equipe ; pts adduser bob jk:equipe
vos listvol srv-afs1 ; vos examine user.jk ; vos move user.jk srv-afs1 a srv-afs2 a ; vos release logiciels ; vos backupsys
bos status srv-afs1 -long ; bos restart srv-afs1 -all ; bos getlog srv-afs1 FileLog
```
