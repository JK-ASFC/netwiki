---
title: "js_periodic (ngx_stream_js_module)"
description: "Directive nginx js_periodic (ngx_stream_js_module) — Specifies a content handler to run at regular interval. The handler receives a session object as its first argument, it also has access to global objects such as ngx. The optional interval parameter…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_periodic module.function [interval=time] [jitter=number] [worker_affinity=mask];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Apparue dans la version** | 0.8.1 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Specifies a content handler to run at regular interval. The handler receives a [[10-guides/04-njs/reference|session object]] as its first argument, it also has access to global objects such as [[10-guides/04-njs/reference|ngx]].

The optional `interval` parameter sets the interval between two consecutive runs, by default, 5 seconds.

The optional `jitter` parameter sets the time within which the location content handler will be randomly delayed, by default, there is no delay.

By default, the `js_periodic` handler is executed on worker process 0. The optional `worker_affinity` parameter allows specifying particular worker processes where the location content handler should be executed. Each worker process set is represented by a bitmask of allowed worker processes. The `all` mask allows the handler to be executed in all worker processes.

Example:

```nginx
example.conf:

location @periodics {
    # to be run at 1 minute intervals in worker process 0
    js_periodic main.handler interval=60s;

    # to be run at 1 minute intervals in all worker processes
    js_periodic main.handler interval=60s worker_affinity=all;

    # to be run at 1 minute intervals in worker processes 1 and 3
    js_periodic main.handler interval=60s worker_affinity=0101;

    resolver 10.0.0.1;
    js_fetch_trusted_certificate /path/to/ISRG_Root_X1.pem;
}

example.js:

async function handler(s) {
    let reply = await ngx.fetch('https://nginx.org/en/docs/njs/');
    let body = await reply.text();

    ngx.log(ngx.INFO, body);
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
