---
title: Lighttpd, H2O et Cherokee — aide-mémoire des commandes
description: Commandes Lighttpd (lighttpd -t, -tt, -p, -f, lighty-enable-mod, lighty-disable-mod, journaux), H2O (h2o -t, -c, -v, mode daemon, journaux) et Cherokee (cherokee-admin, fichier de configuration) avec exemples.
tags: [aide-mémoire, lighttpd, h2o, cherokee]
icon: terminal
---

Explications : [[01-lighttpd|Lighttpd]] · [[02-h2o|H2O]] · [[03-cherokee|Cherokee]].

## Lighttpd

```bash
lighttpd -v ; lighttpd -V                         # version, fonctions compilées
sudo lighttpd -t -f /etc/lighttpd/lighttpd.conf   # syntaxe
sudo lighttpd -tt -f /etc/lighttpd/lighttpd.conf  # syntaxe + chargement des modules
sudo lighttpd -p -f /etc/lighttpd/lighttpd.conf   # configuration résolue
sudo lighty-enable-mod ssl ; sudo lighty-disable-mod ssl   # Debian/Ubuntu
sudo systemctl reload lighttpd
sudo tail -f /var/log/lighttpd/error.log
```

## H2O

```bash
h2o -v
sudo h2o -t -c /etc/h2o/h2o.conf
sudo h2o -m daemon -c /etc/h2o/h2o.conf
sudo systemctl restart h2o ; journalctl -u h2o -f
curl -sI --http2 https://www.corp.exemple.fr/ | head -1
```

## Cherokee

```bash
sudo cherokee-admin -b 127.0.0.1 -p 9090
grep -E '^vserver!' /etc/cherokee/cherokee.conf | cut -d! -f2 | sort -u   # hôtes virtuels
```
