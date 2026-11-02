---
title: Woodpecker et Drone — aide-mémoire des commandes
description: Commandes woodpecker-cli (setup, info, repo ls/add/sync, pipeline ls/start/logs/stop/approve, secret add/ls, exec local, lint) et drone CLI (info, repo, build ls/restart/logs, secret add, exec), variables d'environnement serveur et agent, journaux Docker.
tags: [aide-mémoire, woodpecker, drone, ci]
icon: terminal
---

Explications : [[01-presentation-installation|Woodpecker et Drone]].

```bash
woodpecker-cli setup --server https://ci.corp.exemple.fr        # jeton depuis l'interface (profil)
woodpecker-cli info ; woodpecker-cli repo ls ; woodpecker-cli repo add infra/outils
woodpecker-cli pipeline ls infra/outils ; woodpecker-cli pipeline start infra/outils --branch main
woodpecker-cli pipeline logs infra/outils 42 ; woodpecker-cli pipeline stop infra/outils 42
woodpecker-cli repo secret add --repository infra/outils --name registre_mdp --value "$MDP"
woodpecker-cli lint .woodpecker.yaml ; woodpecker-cli exec .woodpecker.yaml       # exécuter en local
docker compose logs -f woodpecker-server woodpecker-agent
export DRONE_SERVER=https://drone.corp.exemple.fr DRONE_TOKEN=…
drone info ; drone build ls infra/outils ; drone build restart infra/outils 42 ; drone secret add --repository infra/outils --name mdp --data "$MDP" ; drone exec
```
