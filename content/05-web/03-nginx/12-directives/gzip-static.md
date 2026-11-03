---
title: "gzip_static"
description: "Directive nginx gzip_static (ngx_http_gzip_static_module) — Active (« on ») ou désactive (« off ») la recherche de fichiers précompressés. Les directives suivantes sont également prises en compte : gzip_http_version, gzip_proxied, gzip_disable et gzip_vary.…"
tags: [nginx, directive, ngx_http_gzip_static_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_static on \| off \| always;` |
| **Valeur par défaut** | `gzip_static off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_static_module\|ngx_http_gzip_static_module]] |

## Utilisation

Active (« `on` ») ou désactive (« `off` ») la recherche de fichiers précompressés. Les directives suivantes sont également prises en compte : [[12-directives/gzip-http-version|gzip_http_version]], [[12-directives/gzip-proxied|gzip_proxied]], [[12-directives/gzip-disable|gzip_disable]] et [[12-directives/gzip-vary|gzip_vary]].

Avec la valeur « `always` » (1.3.6), le fichier compressé est utilisé dans tous les cas, sans vérifier si le client le prend en charge. C'est utile s'il n'existe de toute façon aucun fichier non compressé sur le disque ou si le module [[11-modules/02-http/ngx_http_gunzip_module|ngx_http_gunzip_module]] est utilisé.

Les fichiers peuvent être compressés avec la commande `gzip` ou toute autre commande compatible. Il est recommandé que les fichiers d'origine et compressés aient la même date et la même heure de modification.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
