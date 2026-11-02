---
title: OpenResty — aide-mémoire des commandes
description: Commandes OpenResty avec exemples — openresty -v, -V, -t, -T, -s reload/quit, systemctl, resty -e et scripts, opm search/get/list/remove, journaux, test d'une location Lua avec curl, emplacement des fichiers.
tags: [aide-mémoire, openresty, nginx, lua, opm]
icon: terminal
---

Explications : [[01-presentation-installation|OpenResty]].

```bash
openresty -v ; openresty -V 2>&1 | tr ' ' '\n' | grep lua
sudo openresty -t                                   # tester la configuration
sudo openresty -T | less                            # configuration complète résolue
sudo openresty -s reload ; sudo systemctl reload openresty
resty -e 'local cjson = require "cjson"; print(cjson.encode({a = 1}))'
resty script.lua
opm search jwt ; sudo opm get SkyLothar/lua-resty-jwt ; opm list ; sudo opm remove SkyLothar/lua-resty-jwt
sudo tail -f /usr/local/openresty/nginx/logs/error.log
curl -s http://api.corp.exemple.fr/sante | jq .
ls /usr/local/openresty/{nginx/conf,lualib,site/lualib}
```
