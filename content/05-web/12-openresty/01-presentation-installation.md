---
title: Présentation, installation et programmation Lua
description: OpenResty — distribution NGINX intégrant LuaJIT et les modules ngx_lua : installation Debian/Ubuntu et RHEL (dépôts openresty.org), Alpine, macOS (Homebrew), Windows (archive), Docker, arborescence /usr/local/openresty, commandes openresty et resty, phases (init, rewrite, access, content, header_filter, body_filter, log), exemples (point de terminaison JSON, contrôle d'accès par jeton, limitation de débit avec lua-resty-limit-traffic, cache partagé lua_shared_dict, appel à Redis), gestionnaire opm, performances et projets basés sur OpenResty (Kong, APISIX).
tags: [openresty, nginx, lua, luajit, api, passerelle, waf]
icon: info
---

**OpenResty** (BSD) est un [[03-nginx/01-presentation|NGINX]] enrichi de **LuaJIT** : on écrit du **Lua** exécuté dans les phases de traitement des requêtes, sans bloquer (entrées/sorties non bloquantes via *cosockets*). Il sert à bâtir des passerelles d'API, des WAF, de l'authentification sur mesure, du routage dynamique — **Kong** et **Apache APISIX** reposent dessus.

## Installation

```bash
# Debian (remplacer « debian » par « ubuntu » sur Ubuntu)
sudo apt install --no-install-recommends wget gnupg ca-certificates lsb-release
wget -O - https://openresty.org/package/pubkey.gpg | sudo gpg --dearmor -o /usr/share/keyrings/openresty.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/openresty.gpg] http://openresty.org/package/debian $(lsb_release -sc) openresty" \
  | sudo tee /etc/apt/sources.list.d/openresty.list
sudo apt update && sudo apt install openresty
sudo systemctl enable --now openresty
```

```bash
# RHEL/Rocky/Alma : fichier .repo fourni par openresty.org (package/rhel/), puis
sudo dnf install openresty openresty-resty
brew install openresty/brew/openresty                 # macOS
docker run -d -p 8080:80 -v ./nginx.conf:/usr/local/openresty/nginx/conf/nginx.conf openresty/openresty:alpine
```

Windows : archive `openresty-<version>-win64.zip` (exécuter `nginx.exe` ; usage de développement). Le paquet n'entre pas en conflit avec le NGINX du système : tout vit dans `/usr/local/openresty/`.

| Chemin / commande | Rôle |
| --- | --- |
| `/usr/local/openresty/nginx/conf/nginx.conf` | Configuration |
| `openresty -t` / `openresty -s reload` | Tester / recharger |
| `resty -e 'print(ngx.now())'` | Exécuter du Lua en ligne de commande |
| `opm get ledgetech/lua-resty-http` | Installer une bibliothèque |

## Exemples

```nginx
http {
    lua_shared_dict compteurs 10m;
    lua_shared_dict limites 10m;

    server {
        listen 80;
        server_name api.corp.exemple.fr;

        # Point de terminaison JSON entièrement en Lua
        location = /sante {
            default_type application/json;
            content_by_lua_block {
                local cjson = require "cjson"
                ngx.say(cjson.encode({ etat = "ok", heure = ngx.localtime() }))
            }
        }

        location /api/ {
            # Contrôle d'un jeton simple avant de passer au serveur amont
            access_by_lua_block {
                local jeton = ngx.var.http_authorization
                if jeton ~= "Bearer " .. os.getenv("API_TOKEN") then
                    return ngx.exit(ngx.HTTP_UNAUTHORIZED)
                end
                -- Limitation : 10 requêtes/s par adresse, rafale de 20
                local limit_req = require "resty.limit.req"
                local lim = limit_req.new("limites", 10, 20)
                local delai, err = lim:incoming(ngx.var.binary_remote_addr, true)
                if not delai and err == "rejected" then
                    return ngx.exit(429)
                end
                ngx.shared.compteurs:incr("api", 1, 0)
            }
            proxy_pass http://10.0.20.10:8080;
        }
    }
}
```

`os.getenv` exige la directive `env API_TOKEN;` au niveau principal de `nginx.conf`. Phases disponibles : `init_by_lua*`, `init_worker_by_lua*`, `rewrite_by_lua*`, `access_by_lua*`, `content_by_lua*`, `header_filter_by_lua*`, `body_filter_by_lua*`, `log_by_lua*`, `balancer_by_lua*`, `ssl_certificate_by_lua*`.

> [!TIP]
> N'utilisez que des bibliothèques **non bloquantes** (`lua-resty-redis`, `lua-resty-mysql`, `lua-resty-http`) : une bibliothèque Lua classique qui bloque sur le réseau fige tout le processus de travail.

Commandes : [[90-aide-memoire|aide-mémoire]].
