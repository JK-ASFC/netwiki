---
title: Rudder — aide-mémoire des commandes
description: Commandes Rudder sur les nœuds (rudder agent info, run, inventory, update, check, policy-server, reinit, history) et sur le serveur (rudder server create-user), API REST (jeton, nœuds, conformité), avec exemples.
tags: [aide-mémoire, rudder]
icon: terminal
---

Explications : [[01-presentation-installation|Rudder]].

```bash
sudo rudder agent info ; sudo rudder agent run ; sudo rudder agent run -u      # -u : mettre à jour la politique avant
sudo rudder agent inventory ; sudo rudder agent check ; sudo rudder agent history ; sudo rudder agent reinit
sudo rudder server create-user -u jk
curl -s -H "X-API-Token: $JETON" "https://rudder.corp.exemple.fr/rudder/api/latest/nodes?include=minimal" | jq '.data.nodes[].hostname'
curl -s -H "X-API-Token: $JETON" "https://rudder.corp.exemple.fr/rudder/api/latest/compliance/nodes" | jq '.data.nodes[] | {name, compliance}'
```
