---
title: "js_fetch_proxy (ngx_stream_js_module)"
description: "Directive nginx js_fetch_proxy (ngx_stream_js_module) — Configure l'URL d'un mandataire sortant pour l'API Fetch. L'url ne prend en charge que le schéma HTTP et peut contenir des identifiants facultatifs au format http://user:password@host:port pour…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_proxy url;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.9.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Configure l'URL d'un mandataire sortant pour l'[[10-guides/04-njs/reference|API Fetch]]. L'*url* ne prend en charge que le schéma HTTP et peut contenir des identifiants facultatifs au format `http://[user:password@]host:port` pour l'authentification Basic. Les connexions HTTP et HTTPS vers les serveurs de destination sont prises en charge. Si l'*url* est vide, le passage par le mandataire est désactivé. La valeur du paramètre peut contenir des variables.

Exemple :

```nginx
server {
    listen 12345;
    js_fetch_proxy http://user:pass@proxy.example.com:3128;
    js_preread main.fetch_handler;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
