---
title: Amanda — aide-mémoire des commandes
description: Commandes Amanda avec exemples — amcheck, amdump, amreport, amstatus, amadmin (find, info, due, force, balance), amtape, amlabel, amrecover (sethost, setdisk, cd, add, extract), amfetchdump, amservice.
tags: [aide-mémoire, amanda]
icon: terminal
---

Explications : [[01-presentation-installation|Amanda]].

```bash
amcheck Quotidien ; amdump Quotidien ; amstatus Quotidien ; amreport Quotidien
amadmin Quotidien find srv-web-01 /etc ; amadmin Quotidien info srv-web-01 ; amadmin Quotidien due ; amadmin Quotidien force srv-web-01 /srv ; amadmin Quotidien balance
amtape Quotidien show ; amlabel Quotidien Quotidien-01 slot 1
amfetchdump Quotidien srv-web-01 /etc 20261101       # extraire une image de sauvegarde
amrecover Quotidien      # amrecover> sethost srv-web-01 ; setdisk /etc ; setdate 2026-11-01 ; cd nginx ; add nginx.conf ; extract
```
