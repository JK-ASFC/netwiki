---
title: "js_access (ngx_http_js_module)"
description: "Directive nginx js_access (ngx_http_js_module) — Sets an njs function as a handler in the access phase. Asynchronous operations such as r.subrequest(), ngx.fetch(), and setTimeout() are supported. A handler that returns without calling r.return()…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_access module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Apparue dans la version** | 0.9.9 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Sets an njs function as a handler in the [[10-guides/06-developpement/development-guide|access phase]]. Asynchronous operations such as [[10-guides/04-njs/reference|r.subrequest()]], [[10-guides/04-njs/reference|ngx.fetch()]], and [[10-guides/04-njs/reference|setTimeout()]] are supported.

A handler that returns without calling [[10-guides/04-njs/reference|r.return()]] or [[10-guides/04-njs/reference|r.decline()]] grants access. To deny access or send a custom response (for example, a redirect), the handler may call [[10-guides/04-njs/reference|r.return()]]. To make the handler express no opinion, deferring the decision to other access checkers under [[12-directives/satisfy|satisfy any]], the handler may call [[10-guides/04-njs/reference|r.decline()]].

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
