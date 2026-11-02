---
title: RethinkDB
description: RethinkDB — base documentaire JSON open source (Apache 2.0) pensée pour le temps réel (changefeeds) : état du projet (communautaire, version 2.4), installation (dépôt pour Debian, Ubuntu et RHEL, macOS, Docker), ports (8080 interface web, 28015 clients, 29015 cluster), fichier d'instance, cluster et réplication, langage ReQL, sécurité (mot de passe admin, interface à ne pas exposer), sauvegarde rethinkdb dump/restore.
tags: [rethinkdb, nosql, json, temps réel, changefeeds, reql]
icon: info
---

**RethinkDB** pousse les modifications vers les applications (**changefeeds**) au lieu de les obliger à interroger la base. Après la fermeture de la société en 2016, le projet est maintenu par la communauté (Linux Foundation) ; il reste fonctionnel mais évolue lentement — à réserver aux applications qui l'utilisent déjà.

## Installation

```bash
# Debian/Ubuntu : dépôt download.rethinkdb.com (clé et sources selon la documentation), puis
sudo apt install rethinkdb
sudo cp /etc/rethinkdb/default.conf.sample /etc/rethinkdb/instances.d/instance1.conf
sudo systemctl enable --now rethinkdb
docker run -d -p 8080:8080 -p 28015:28015 -p 29015:29015 rethinkdb:2.4
```

```ini
# /etc/rethinkdb/instances.d/instance1.conf
bind=all
server-name=rdb1
join=10.0.20.131:29015
http-port=8080
driver-port=28015
cluster-port=29015
```

Mot de passe administrateur : `r.db('rethinkdb').table('users').get('admin').update({password: 'MdpAdmin2026'})` (depuis l'onglet *Data Explorer*). L'interface web (8080) n'a pas d'authentification : la lier à `127.0.0.1` (`bind-http=127.0.0.1` selon version) ou la protéger par un reverse proxy authentifié.

```bash
rethinkdb dump -c localhost:28015 -f sauvegarde.tar.gz -p      # mot de passe demandé
rethinkdb restore sauvegarde.tar.gz -c localhost:28015 -p
```

Interface : [[05-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
