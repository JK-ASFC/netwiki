---
title: "js_access (ngx_http_js_module)"
description: "Directive nginx js_access (ngx_http_js_module) — Définit une fonction njs comme gestionnaire de la phase d'accès. Les opérations asynchrones comme r.subrequest(), ngx.fetch() et setTimeout() sont prises en charge. Un gestionnaire qui se termine…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_access module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Apparue dans la version** | 0.9.9 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit une fonction njs comme gestionnaire de la [[10-guides/06-developpement/development-guide|phase d'accès]]. Les opérations asynchrones comme [[10-guides/04-njs/reference|r.subrequest()]], [[10-guides/04-njs/reference|ngx.fetch()]] et [[10-guides/04-njs/reference|setTimeout()]] sont prises en charge.

Un gestionnaire qui se termine sans appeler [[10-guides/04-njs/reference|r.return()]] ni [[10-guides/04-njs/reference|r.decline()]] accorde l'accès. Pour refuser l'accès ou envoyer une réponse personnalisée (par exemple une redirection), le gestionnaire peut appeler [[10-guides/04-njs/reference|r.return()]]. Pour ne pas se prononcer et laisser la décision aux autres vérifications d'accès avec [[12-directives/satisfy|satisfy any]], il peut appeler [[10-guides/04-njs/reference|r.decline()]].

Par exemple :

```nginx
example.conf:
 location /protected/ {
     js_access  main.auth;
     proxy_pass http://upstream;
 }

example.js:
 async function auth(r) {
     let reply = await ngx.fetch('http://authsvc/check', {
         headers: {Authorization: r.headersIn.Authorization}
     });

     if (reply.status != 200) {
         r.return(401);
         return;
     }
 }

 export default {auth};
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
