---
title: "gzip_proxied"
description: "Directive nginx gzip_proxied (ngx_http_gzip_module) — Active ou désactive la compression gzip des réponses aux requêtes relayées par un mandataire, selon la requête et la réponse. Une requête est considérée comme relayée si le champ d'en-tête de requête…"
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_proxied off \| expired \| no-cache \| no-store \| private \| no_last_modified \| no_etag \| auth \| any ...;` |
| **Valeur par défaut** | `gzip_proxied off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Active ou désactive la compression gzip des réponses aux requêtes relayées par un mandataire, selon la requête et la réponse. Une requête est considérée comme relayée si le champ d'en-tête de requête `Via` est présent. La directive accepte plusieurs paramètres :

- **`off`**

  désactive la compression pour toutes les requêtes relayées, sans tenir compte des autres paramètres ;

- **`expired`**

  active la compression si l'en-tête de réponse contient le champ `Expires` avec une valeur qui désactive la mise en cache ;

- **`no-cache`**

  active la compression si l'en-tête de réponse contient le champ `Cache-Control` avec le paramètre « `no-cache` » ;

- **`no-store`**

  active la compression si l'en-tête de réponse contient le champ `Cache-Control` avec le paramètre « `no-store` » ;

- **`private`**

  active la compression si l'en-tête de réponse contient le champ `Cache-Control` avec le paramètre « `private` » ;

- **`no_last_modified`**

  active la compression si l'en-tête de réponse ne contient pas le champ `Last-Modified` ;

- **`no_etag`**

  active la compression si l'en-tête de réponse ne contient pas le champ `ETag` ;

- **`auth`**

  active la compression si l'en-tête de requête contient le champ `Authorization` ;

- **`any`**

  active la compression pour toutes les requêtes relayées.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
