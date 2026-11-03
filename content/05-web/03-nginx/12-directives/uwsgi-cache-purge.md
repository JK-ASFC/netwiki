---
title: "uwsgi_cache_purge"
description: "Directive nginx uwsgi_cache_purge (ngx_http_uwsgi_module) — Définit les conditions dans lesquelles la requête est considérée comme une demande de purge du cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », l'entrée du cache…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_cache_purge string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.7 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit les conditions dans lesquelles la requête est considérée comme une demande de purge du cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », l'entrée du cache correspondant à la [[12-directives/uwsgi-cache-key|clé de cache]] est supprimée. Une opération réussie renvoie la réponse `204 No Content`.

Si la [[12-directives/uwsgi-cache-key|clé de cache]] d'une demande de purge se termine par un astérisque (« `*` »), toutes les entrées correspondant à cette clé générique sont supprimées du cache. Elles restent toutefois sur le disque jusqu'à leur suppression pour [[12-directives/uwsgi-cache-path|inactivité]], leur traitement par le purgeur de cache (1.7.12) ou une tentative d'accès d'un client.

Exemple de configuration :

```nginx
uwsgi_cache_path /data/nginx/cache keys_zone=cache_zone:10m;

map $request_method $purge_method {
    PURGE   1;
    default 0;
}

server {
    ...
    location / {
        uwsgi_pass        backend;
        uwsgi_cache       cache_zone;
        uwsgi_cache_key   $uri;
        uwsgi_cache_purge $purge_method;
    }
}
```

> [!NOTE]
> Cette fonction est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
