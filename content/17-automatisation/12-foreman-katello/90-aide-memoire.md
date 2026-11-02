---
title: Foreman et Katello — aide-mémoire des commandes
description: Commandes foreman-installer (--scenario, --help, mise à jour), foreman-maintain (service status/restart, health check, backup, upgrade), hammer (host list/info, hostgroup, repository synchronize, content-view publish/promote, activation-key, erratum list, job-invocation create, task list) et sur les hôtes (subscription-manager, dnf updateinfo) avec exemples.
tags: [aide-mémoire, foreman, katello, hammer]
icon: terminal
---

Explications : [[01-presentation-installation|Foreman et Katello]].

```bash
sudo foreman-maintain service status ; sudo foreman-maintain service restart ; sudo foreman-maintain health check
sudo foreman-maintain backup offline /sauv/foreman ; sudo foreman-maintain upgrade list-versions
hammer host list --search "os = Rocky" ; hammer host info --name srv-web-01.corp.exemple.fr ; hammer hostgroup list
hammer repository synchronize --id 3 --async ; hammer content-view publish --name cv-rocky9 --organization Corp
hammer content-view version promote --content-view cv-rocky9 --version 4 --to-lifecycle-environment Production --organization Corp
hammer erratum list --search "type = security" --organization Corp | head
hammer job-invocation create --job-template "Run Command - Script Default" --inputs command="uptime" --search-query "hostgroup = web"
hammer task list --search "state = running"
sudo subscription-manager identity ; sudo dnf updateinfo list --security        # sur un hôte enregistré
```
