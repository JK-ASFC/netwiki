---
title: Oxidized, RANCID, Netdisco et Batfish — aide-mémoire
description: Commandes et API d'Oxidized (nodes.json, collecte forcée, historique Git), RANCID (rancid-run, clogin), Netdisco (port web) et Batfish (Docker, requêtes pybatfish).
tags: [aide-mémoire, oxidized, rancid, netdisco, batfish, sauvegarde configuration]
icon: terminal
---

Explications : [[01-oxidized-rancid-netdisco-batfish|Oxidized, RANCID, Netdisco et Batfish]].

| Outil | Port / accès |
| --- | --- |
| Oxidized | 8888 (API et interface) |
| Netdisco | 5000 (interface web) |
| Batfish | 9996/9997 (service pour pybatfish) |

```bash
# Oxidized
curl -s http://127.0.0.1:8888/nodes.json | jq '.[] | {name, status}'
curl -s http://127.0.0.1:8888/node/next/rtr-lyon        # forcer la collecte d'un nœud
git -C /srv/oxidized/configs.git log --oneline -20
git -C /srv/oxidized/configs.git show HEAD              # dernier changement

# RANCID
su - rancid -c 'rancid-run'
su - rancid -c 'clogin rtr-lyon'
tail -f /var/log/rancid/*

# Batfish
docker run -d -p 9996:9996 -p 9997:9997 batfish/allinone
python3 -m pip install pybatfish
python3 -c "from pybatfish.client.session import Session; bf=Session(host='127.0.0.1'); bf.set_network('n'); bf.init_snapshot('./configs', name='s', overwrite=True); print(bf.q.undefinedReferences().answer().frame())"
```
