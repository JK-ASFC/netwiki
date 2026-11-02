---
title: Pen et Balance
description: Pen et Balance — petits répartiteurs de charge TCP en espace utilisateur pour Linux et BSD : installation, syntaxe de lancement (port d'écoute, serveurs amont, connexions maximales), persistance par adresse client, en-tête X-Forwarded-For (Pen), port de contrôle penctl, mode interactif de Balance, service systemd, cas d'usage (laboratoire, petite répartition TCP) et limites face à HAProxy et LVS.
tags: [pen, balance, répartition de charge, tcp, proxy]
icon: info
---

**Pen** et **Balance** sont des répartiteurs **TCP** minimalistes : une ligne de commande suffit pour répartir un port entre plusieurs serveurs. Ils dépannent en laboratoire ou pour un service interne simple ; pour la production, préférez [[01-haproxy/01-presentation|HAProxy]] (contrôles de santé riches, TLS, statistiques) ou [[02-lvs-ipvs|LVS]] (performance noyau).

## Pen

```bash
sudo apt install pen                         # Debian/Ubuntu ; FreeBSD : pkg install pen ; autres : compilation
# Écoute sur 80, répartition tourniquet (-r) entre deux serveurs, X-Forwarded-For (-H), port de contrôle local
sudo pen -u nobody -r -H -C 127.0.0.1:10080 -p /run/pen-web.pid 80 10.0.20.21:8080 10.0.20.22:8080
penctl 127.0.0.1:10080 servers               # état des serveurs
penctl 127.0.0.1:10080 status
```

Sans `-r`, Pen garde un client sur le même serveur (persistance par adresse IP). Option `-f` pour rester au premier plan (service systemd de type `simple`). Pen gère aussi UDP (`-U`) et, selon la compilation, la terminaison TLS.

## Balance

```bash
sudo apt install balance                     # selon la distribution, sinon compilation (inlab.net)
sudo balance -f 80 10.0.20.21:8080 10.0.20.22:8080        # -f : premier plan
sudo balance 3306 10.0.20.31:3306 ! 10.0.20.32:3306       # « ! » : groupe de secours utilisé si le premier échoue
```

Commandes : [[90-aide-memoire|aide-mémoire]].
