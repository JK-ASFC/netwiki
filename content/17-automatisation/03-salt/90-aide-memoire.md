---
title: Salt — aide-mémoire des commandes
description: Commandes Salt avec exemples — clés des minions (salt-key), ciblage (glob, grains, liste, composé, nodegroups), exécution distante (test.ping, cmd.run, pkg, service, grains, pillar), états (state.apply, test=True, highstate), salt-call en local, salt-run (jobs, manage), salt-ssh sans agent, salt-proxy pour les équipements réseau (napalm), journaux.
tags: [aide-mémoire, salt, saltstack, salt-key, state.apply, salt-ssh]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Salt]].

## Clés

```bash
sudo salt-key -L
sudo salt-key -a srv-web01
sudo salt-key -A -y
sudo salt-key -d ancien-minion -y
sudo salt-key -f srv-web01                  # empreinte (à comparer avec salt-call --local key.finger sur le minion)
```

## Ciblage et exécution

```bash
sudo salt '*' test.ping
sudo salt 'srv-web*' cmd.run 'uptime'
sudo salt -G 'os:Debian' pkg.upgrade
sudo salt -L 'srv-web01,srv-web02' service.restart nginx
sudo salt -C 'G@role:web and G@site:paris' grains.item osrelease
sudo salt -N serveurs-paris test.version
sudo salt '*' grains.items | less
sudo salt '*' pillar.items
sudo salt '*' saltutil.refresh_pillar
sudo salt '*' saltutil.sync_all
sudo salt --batch-size 25% '*' state.apply      # par lots
```

## États

```bash
sudo salt 'srv-web01' state.apply nginx test=True
sudo salt 'srv-web01' state.apply nginx
sudo salt '*' state.highstate
sudo salt-call state.apply ntp -l debug          # sur le minion
sudo salt-call --local grains.items              # sans maître
```

```yaml
# /srv/salt/nginx/init.sls
nginx:
  pkg.installed: []
  service.running:
    - enable: true
    - watch:
      - file: /etc/nginx/conf.d/intranet.conf
/etc/nginx/conf.d/intranet.conf:
  file.managed:
    - source: salt://nginx/intranet.conf.j2
    - template: jinja
```

## Tâches et maître

```bash
sudo salt-run jobs.list_jobs | tail
sudo salt-run jobs.lookup_jid 20261030103015123456
sudo salt-run manage.status
sudo salt-run manage.down
```

## Sans agent et équipements réseau

```bash
sudo salt-ssh -i 'srv-dmz01' test.ping          # roster : /etc/salt/roster
sudo salt-ssh 'srv-dmz01' state.apply base
sudo salt 'sw-paris-01' net.arp                  # minion proxy NAPALM
sudo salt 'sw-paris-01' net.cli "show version"
```

## Journaux

```bash
sudo tail -f /var/log/salt/master /var/log/salt/minion
```
