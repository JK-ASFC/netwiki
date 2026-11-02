---
title: collectd et StatsD — aide-mémoire des commandes
description: Commandes collectd (collectd -t, -T, collectdctl listval/getval/flush, unixsock, journaux) et StatsD (format des messages c, g, ms, s, h, taux d'échantillonnage, test avec nc, statsd_exporter, Telegraf inputs.statsd) avec exemples.
tags: [aide-mémoire, collectd, statsd]
icon: terminal
---

Explications : [[01-presentation-installation|collectd et StatsD]].

```bash
sudo collectd -t ; sudo collectd -T                         # tester la configuration / une seule collecte
collectdctl listval | head ; collectdctl getval srv-web-01/load/load ; collectdctl flush     # greffon unixsock requis
sudo journalctl -u collectd -f
echo "app.erreurs:1|c|@0.1" | nc -u -w0 statsd 8125          # compteur échantillonné à 10 %
echo "app.utilisateurs:jk|s" | nc -u -w0 statsd 8125         # ensemble (valeurs uniques)
statsd_exporter --statsd.listen-udp=:8125 --web.listen-address=:9102 --statsd.mapping-config=mapping.yml
```
