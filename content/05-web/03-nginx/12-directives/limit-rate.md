---
title: "limit_rate"
description: "Directive nginx limit_rate (ngx_http_core_module) — Limite le débit de transmission de la réponse au client. Le débit (rate) s'exprime en octets par seconde. La valeur zéro désactive la limitation. La limite s'applique par requête : si un client ouvre…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_rate rate;` |
| **Valeur par défaut** | `limit_rate 0;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Limite le débit de transmission de la réponse au client. Le débit (*rate*) s'exprime en octets par seconde. La valeur zéro désactive la limitation. La limite s'applique par requête : si un client ouvre deux connexions simultanées, le débit total sera le double de la limite indiquée.

La valeur du paramètre peut contenir des variables (1.17.0). C'est utile lorsque le débit doit être limité selon une condition :

```nginx
map $slow $rate {
    1     4k;
    2     8k;
}

limit_rate $rate;
```

La limite de débit peut aussi être définie dans la variable [[13-variables/limit-rate|$limit_rate]], mais depuis la version 1.17.0 cette méthode n'est pas recommandée :

```nginx
server {

    if ($slow) {
        set $limit_rate 4k;
    }

    ...
}
```

La limite de débit peut aussi être définie dans le champ d'en-tête `X-Accel-Limit-Rate` de la réponse d'un serveur mandaté. Cette possibilité peut être désactivée avec les directives [[12-directives/proxy-ignore-headers|proxy_ignore_headers]], [[12-directives/fastcgi-ignore-headers|fastcgi_ignore_headers]], [[12-directives/uwsgi-ignore-headers|uwsgi_ignore_headers]] et [[12-directives/scgi-ignore-headers|scgi_ignore_headers]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
