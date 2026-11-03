---
title: "proxy_cache_purge"
description: "Directive nginx proxy_cache_purge (ngx_http_proxy_module) — Définit les conditions dans lesquelles la requête est considérée comme une demande de purge du cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », l'entrée du cache…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_purge string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.7 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit les conditions dans lesquelles la requête est considérée comme une demande de purge du cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », l'entrée du cache correspondant à la [[12-directives/proxy-cache-key|clé de cache]] est supprimée. Une opération réussie renvoie la réponse `204 No Content`.

Si la [[12-directives/proxy-cache-key|clé de cache]] d'une demande de purge se termine par un astérisque (« `*` »), toutes les entrées correspondant à cette clé générique sont supprimées du cache. Elles restent toutefois sur le disque jusqu'à leur suppression pour [[12-directives/proxy-cache-path|inactivité]], leur traitement par le purgeur de cache (1.7.12) ou une tentative d'accès d'un client.

Exemple de configuration :

```nginx
proxy_cache_path /data/nginx/cache keys_zone=cache_zone:10m;

map $request_method $purge_method {
    PURGE   1;
    default 0;
}

server {
    ...
    location / {
        proxy_pass http://backend;
        proxy_cache cache_zone;
        proxy_cache_key $uri;
        proxy_cache_purge $purge_method;
    }
}
```

> [!NOTE]
> Cette fonction est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
