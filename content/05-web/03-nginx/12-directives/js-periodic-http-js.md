---
title: "js_periodic (ngx_http_js_module)"
description: "Directive nginx js_periodic (ngx_http_js_module) — Indique un gestionnaire de contenu à exécuter à intervalle régulier. Il reçoit en premier argument un objet session et a aussi accès aux objets globaux comme ngx. Le paramètre facultatif interval…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_periodic module.function [interval=time] [jitter=number] [worker_affinity=mask];` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Apparue dans la version** | 0.8.1 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Indique un gestionnaire de contenu à exécuter à intervalle régulier. Il reçoit en premier argument un [[10-guides/04-njs/reference|objet session]] et a aussi accès aux objets globaux comme [[10-guides/04-njs/reference|ngx]].

Le paramètre facultatif `interval` définit l'intervalle entre deux exécutions consécutives ; 5 secondes par défaut.

Le paramètre facultatif `jitter` définit la durée dans laquelle l'exécution du gestionnaire est retardée aléatoirement ; par défaut, aucun retard.

Par défaut, le gestionnaire `js_periodic` s'exécute sur le processus de travail 0. Le paramètre facultatif `worker_affinity` permet d'indiquer les processus de travail où il doit s'exécuter. Chaque ensemble de processus est représenté par un masque de bits des processus autorisés. Le masque `all` permet l'exécution dans tous les processus de travail.

Exemple :

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
