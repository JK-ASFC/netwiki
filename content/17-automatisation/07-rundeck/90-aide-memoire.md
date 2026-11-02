---
title: Rundeck — aide-mémoire des commandes
description: Commandes Rundeck (service rundeckd, journaux, rd CLI : projects list/create, jobs list/load/run, executions follow/list/kill, nodes list, keys create, adhoc) et API REST (jeton, lancement de tâche), avec exemples.
tags: [aide-mémoire, rundeck, rd]
icon: terminal
---

Explications : [[01-presentation-installation|Rundeck]].

```bash
sudo systemctl status rundeckd ; sudo tail -f /var/log/rundeck/service.log
export RD_URL=https://rundeck.corp.exemple.fr RD_TOKEN=…        # rd : CLI officielle (paquet rundeck-cli)
rd projects list ; rd projects create -p infra ; rd jobs list -p infra ; rd jobs load -p infra -f taches.yaml -F yaml
rd run -p infra -j "exploitation/web/Redémarrer le service web" -- -serveur srv-web-01 ; rd executions follow -e 1234
rd executions list -p infra ; rd executions kill -e 1234 ; rd nodes list -p infra ; rd adhoc -p infra -F 'tags: web' -- uptime
rd keys create -p keys/projet/infra/cle-ssh -t privateKey -f ~/.ssh/id_rundeck
curl -s -H "X-Rundeck-Auth-Token: $RD_TOKEN" -H 'Accept: application/json' -X POST "$RD_URL/api/47/job/<uuid>/run" -d '{"options":{"serveur":"srv-web-02"}}'
```
