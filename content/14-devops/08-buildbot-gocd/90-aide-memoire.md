---
title: Buildbot et GoCD — aide-mémoire des commandes
description: Commandes Buildbot (create-master, checkconfig, start, stop, restart, reconfig, upgrade-master, buildbot-worker create-worker/start/stop, try, sendchange) et GoCD (services go-server et go-agent, journaux, API REST : pipelines, déclenchement, agents, sauvegarde) avec exemples.
tags: [aide-mémoire, buildbot, gocd]
icon: terminal
---

Explications : [[01-buildbot|Buildbot]] · [[02-gocd|GoCD]].

## Buildbot

```bash
buildbot create-master /srv/buildbot/maitre ; buildbot upgrade-master /srv/buildbot/maitre
buildbot checkconfig /srv/buildbot/maitre ; buildbot start|stop|restart|reconfig /srv/buildbot/maitre
tail -f /srv/buildbot/maitre/twistd.log
buildbot-worker create-worker DIR maitre:9989 nom motdepasse ; buildbot-worker start|stop DIR
buildbot sendchange --master maitre:9989 --auth util:mdp --who jk --branch main fichier.txt
```

## GoCD

```bash
sudo systemctl status go-server go-agent ; sudo tail -f /var/log/go-server/go-server.log /var/log/go-agent/go-agent.log
API=https://gocd.corp.exemple.fr/go/api ; H='Accept: application/vnd.go.cd+json'
curl -s -u admin:$MDP -H "$H" $API/admin/pipelines/outils-reseau | jq .name
curl -s -u admin:$MDP -H 'Accept: application/vnd.go.cd.v1+json' -H 'X-GoCD-Confirm: true' -X POST $API/pipelines/outils-reseau/schedule
curl -s -u admin:$MDP -H "$H" $API/agents | jq '._embedded.agents[] | {hostname, agent_state}'
curl -s -u admin:$MDP -H 'Accept: application/vnd.go.cd.v2+json' -H 'X-GoCD-Confirm: true' -X POST $API/backups
```
