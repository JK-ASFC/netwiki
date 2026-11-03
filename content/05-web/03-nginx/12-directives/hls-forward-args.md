---
title: "hls_forward_args"
description: "Directive nginx hls_forward_args (ngx_http_hls_module) — Ajoute les arguments d'une requête de liste de lecture aux URI des fragments. Cela peut servir à autoriser le client au moment où il demande un fragment, ou à protéger un flux HLS avec le module…"
tags: [nginx, directive, ngx_http_hls_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `hls_forward_args on \| off;` |
| **Valeur par défaut** | `hls_forward_args off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.12 |
| **Module** | [[11-modules/02-http/ngx_http_hls_module\|ngx_http_hls_module]] |

## Utilisation

Ajoute les arguments d'une requête de liste de lecture aux URI des fragments. Cela peut servir à autoriser le client au moment où il demande un fragment, ou à protéger un flux HLS avec le module [[11-modules/02-http/ngx_http_secure_link_module|ngx_http_secure_link_module]].

Par exemple, si un client demande la liste de lecture `http://example.com/hls/test.mp4.m3u8?a=1&b=2`, les arguments `a=1` et `b=2` sont ajoutés aux URI des fragments, après les arguments `start` et `end` :

```nginx
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:15
#EXT-X-PLAYLIST-TYPE:VOD

#EXTINF:9.333,
test.mp4.ts?start=0.000&end=9.333&a=1&b=2
#EXTINF:7.167,
test.mp4.ts?start=9.333&end=16.500&a=1&b=2
#EXTINF:5.416,
test.mp4.ts?start=16.500&end=21.916&a=1&b=2
#EXTINF:5.500,
test.mp4.ts?start=21.916&end=27.416&a=1&b=2
#EXTINF:15.167,
test.mp4.ts?start=27.416&end=42.583&a=1&b=2
#EXTINF:9.626,
test.mp4.ts?start=42.583&end=52.209&a=1&b=2

#EXT-X-ENDLIST
```

Si un flux HLS est protégé par le module [[11-modules/02-http/ngx_http_secure_link_module|ngx_http_secure_link_module]], il ne faut pas utiliser `$uri` dans l'expression [[12-directives/secure-link-md5|secure_link_md5]], car cela provoque des erreurs lors de la demande des fragments. Utilisez plutôt un [[12-directives/map-http-map|URI de base]] (`$hls_uri` dans l'exemple) :

```nginx
http {
    ...

    map $uri $hls_uri {
        ~^(?<base_uri>.*).m3u8$ $base_uri;
        ~^(?<base_uri>.*).ts$   $base_uri;
        default                 $uri;
    }

    server {
        ...

        location /hls/ {
            hls;
            hls_forward_args on;

            alias /var/videos/;

            secure_link $arg_md5,$arg_expires;
            secure_link_md5 "$secure_link_expires$hls_uri$remote_addr secret";

            if ($secure_link = "") {
                return 403;
            }

            if ($secure_link = "0") {
                return 410;
            }
        }
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
