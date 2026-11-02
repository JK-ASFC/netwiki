---
title: Lua
description: Lua — langage de script léger conçu pour être embarqué : versions 5.1, 5.4 et LuaJIT, installation (Linux, macOS, Windows), luarocks, syntaxe essentielle, et usages en infrastructure (OpenResty/NGINX, HAProxy, Redis et Valkey EVAL, Nmap NSE, Wireshark, Neovim, PowerDNS, Knot Resolver, Suricata, Pandoc) avec exemples.
tags: [lua, luajit, luarocks, script embarqué, haproxy, redis, nmap]
icon: info
---

**Lua** (MIT) est un petit langage de script (quelques centaines de Ko) que de nombreux logiciels **embarquent** pour se laisser programmer. L'administrateur le rencontre rarement seul, mais souvent **à l'intérieur** d'un autre outil.

| Version | Où |
| --- | --- |
| **5.1 / LuaJIT** | [[12-openresty/01-presentation-installation\|OpenResty]], Redis/Valkey, Neovim, Knot Resolver |
| **5.3 / 5.4** | Version courante du langage ; HAProxy, Nmap, PowerDNS, Pandoc |
| Selon la version | Wireshark (dissecteurs), Suricata (scripts de détection) |

## Installation

```bash
sudo apt install lua5.4 luarocks          # Debian/Ubuntu
sudo dnf install lua luarocks             # RHEL (EPEL pour luarocks), Fedora
sudo apk add lua5.4 luarocks5.4           # Alpine
brew install lua luarocks                 # macOS
lua -v ; luac -p script.lua               # vérifier la syntaxe sans exécuter
luarocks install --local luasocket ; luarocks list
```

Windows : binaires **LuaBinaries** ou `scoop install lua`.

## Bases du langage

```lua
-- tables (tableaux et dictionnaires), indices à partir de 1
local serveurs = { "srv-web-01", "srv-web-02" }
local ports = { http = 80, https = 443 }
for i, nom in ipairs(serveurs) do print(i, nom) end
for service, port in pairs(ports) do print(service, port) end

local function est_prive(ip)
  return ip:match("^10%.") ~= nil or ip:match("^192%.168%.") ~= nil
end
print(est_prive("10.0.20.5"))   --> true
```

## Exemples d'intégration

```lua
-- HAProxy (global : lua-load /etc/haproxy/entete.lua) : ajouter un en-tête
core.register_action("marquer", { "http-req" }, function(txn)
  txn.http:req_add_header("X-Passerelle", "haproxy-01")
end)
-- dans un frontend : http-request lua.marquer
```

```bash
# Redis / Valkey : script atomique (incrément plafonné)
redis-cli EVAL "local v = redis.call('INCR', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('SET', KEYS[1], ARGV[1]) end; return v" 1 compteur 100
# Nmap : scripts NSE écrits en Lua
nmap --script http-title,ssl-cert -p 443 10.0.20.0/24
```

Voir aussi [[01-haproxy/04-http-avance|HAProxy]] et [[02-reseau-diagnostic/03-nmap|Nmap]]. Commandes : [[90-aide-memoire|aide-mémoire]].
