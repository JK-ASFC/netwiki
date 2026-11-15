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

## Installation et service

```bash
# Debian 12 : dépôt officiel openresty.org (RHEL : fichier .repo fourni sur openresty.org)
wget -O - https://openresty.org/package/pubkey.gpg | sudo gpg --dearmor -o /usr/share/keyrings/openresty.gpg
echo "deb [signed-by=/usr/share/keyrings/openresty.gpg] http://openresty.org/package/debian bookworm openresty" | sudo tee /etc/apt/sources.list.d/openresty.list
sudo apt update && sudo apt install openresty
sudo systemctl enable --now openresty
docker run -d --name openresty -p 80:80 -v /srv/openresty/conf.d:/etc/nginx/conf.d openresty/openresty:alpine
```

## Tester un point de terminaison Lua

```nginx /usr/local/openresty/nginx/conf/conf.d/sante.conf
server {
    listen 8080;
    location = /sante {
        default_type application/json;
        content_by_lua_block {
            local cjson = require "cjson"
            ngx.say(cjson.encode({ statut = "ok", heure = ngx.localtime() }))
        }
    }
}
```

```bash
sudo openresty -t && sudo openresty -s reload
curl -s http://127.0.0.1:8080/sante | jq .
```
