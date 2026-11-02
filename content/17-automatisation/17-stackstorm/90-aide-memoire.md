---
title: StackStorm — aide-mémoire des commandes
description: Commandes st2 avec exemples — login, apikey create, action list/get/execute, run, execution list/get/re-run/cancel, rule list/get/enable/disable, trigger list, trace list/get, sensor list, pack install/list/remove/config, key set/get/list (datastore, --encrypt), webhook, st2ctl status/restart/reload.
tags: [aide-mémoire, stackstorm, st2]
icon: terminal
---

Explications : [[01-presentation-installation|StackStorm]].

```bash
st2 login st2admin ; st2 apikey create -k -m '{"usage":"supervision"}'
st2 action list --pack=corp ; st2 action get core.remote ; st2 run core.local cmd="date" ; st2 run corp.diagnostic hote=srv-web-01
st2 execution list -n 20 ; st2 execution get <id> ; st2 execution re-run <id> ; st2 execution cancel <id>
st2 rule list ; st2 rule get corp.redemarrer_nginx_sur_alerte ; st2 rule disable corp.redemarrer_nginx_sur_alerte
st2 trigger list ; st2 sensor list ; st2 trace list -n 5 ; st2 trace get <id>
st2 pack list ; st2 pack install netbox ; st2 pack config netbox ; st2 pack remove ancien
st2 key set mdp_vcenter 'secret' --encrypt ; st2 key get mdp_vcenter --decrypt ; st2 key list
curl -X POST https://st2.corp.exemple.fr/api/v1/webhooks/alertes -H "St2-Api-Key: $CLE" -H 'Content-Type: application/json' -d '{"alertname":"Test"}'
sudo st2ctl status ; sudo st2ctl restart ; sudo st2ctl reload --register-all
```
