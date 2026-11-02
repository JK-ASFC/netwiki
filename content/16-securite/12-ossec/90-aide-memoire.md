---
title: OSSEC — aide-mémoire des commandes
description: Commandes OSSEC avec exemples — ossec-control (start, stop, restart, status), manage_agents, agent_control (-l, -lc, -i, -r), ossec-logtest, syscheck_control, rootcheck_control, list_agents, clear_stats, journaux /var/ossec/logs (ossec.log, alerts.log).
tags: [aide-mémoire, ossec, hids]
icon: terminal
---

Explications : [[01-presentation-installation|OSSEC]].

```bash
sudo /var/ossec/bin/ossec-control status ; sudo /var/ossec/bin/ossec-control restart
sudo /var/ossec/bin/manage_agents -l ; sudo /var/ossec/bin/agent_control -lc ; sudo /var/ossec/bin/agent_control -i 001 ; sudo /var/ossec/bin/agent_control -r -u 001
sudo /var/ossec/bin/ossec-logtest            # coller une ligne de journal pour voir la règle déclenchée
sudo /var/ossec/bin/syscheck_control -i 001 ; sudo /var/ossec/bin/syscheck_control -u 001   # modifications de fichiers / relance
sudo /var/ossec/bin/rootcheck_control -i 001 ; sudo /var/ossec/bin/list_agents -a
sudo tail -f /var/ossec/logs/alerts/alerts.log /var/ossec/logs/ossec.log
```
