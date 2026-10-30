---
title: Kamailio et OpenSIPS — aide-mémoire des commandes
description: Commandes Kamailio (kamailio -c, kamctl, kamcmd : abonnés, enregistrements, dispatcher, htable, statistiques) et OpenSIPS (opensips -C, opensips-cli : base, utilisateurs, commandes MI) avec exemples, rtpengine, journaux.
tags: [aide-mémoire, kamailio, opensips, kamctl, kamcmd, opensips-cli]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-kamailio|Kamailio]] et [[02-opensips|OpenSIPS]].

## Kamailio

```bash
kamailio -c -f /etc/kamailio/kamailio.cfg          # vérifier le script
sudo systemctl restart kamailio
kamctl add 1001 'MotDePasseLong2026'
kamctl rm 1001
kamctl ul show
kamcmd ul.dump
kamcmd dispatcher.list
kamcmd dispatcher.reload
kamcmd htable.dump ipban
kamcmd htable.delete ipban 203.0.113.50
kamcmd stats.get_statistics all
kamcmd core.uptime
sudo journalctl -u kamailio -f
```

## OpenSIPS

```bash
opensips -C -f /etc/opensips/opensips.cfg
sudo systemctl restart opensips
opensips-cli -x database create
opensips-cli -x user add 1001@sip.exemple.fr 'MotDePasseLong2026'
opensips-cli -x mi ul_dump
opensips-cli -x mi dlg_list
opensips-cli -x mi lb_list
opensips-cli -x mi dr_reload
opensips-cli -x mi get_statistics all
sudo journalctl -u opensips -f
```

## rtpengine

```bash
sudo systemctl status rtpengine
rtpengine-ctl list sessions all
rtpengine-ctl list totals
```
