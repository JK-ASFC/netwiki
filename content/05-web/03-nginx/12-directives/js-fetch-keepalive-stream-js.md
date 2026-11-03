---
title: "js_fetch_keepalive (ngx_stream_js_module)"
description: "Directive nginx js_fetch_keepalive (ngx_stream_js_module) — Active le cache des connexions vers les serveurs de destination. Une valeur supérieure à 0 active les connexions persistantes pour l'API Fetch. Le paramètre connections définit le nombre maximal de…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_keepalive connections;` |
| **Valeur par défaut** | `js_fetch_keepalive 0;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.9.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Active le cache des connexions vers les serveurs de destination. Une valeur supérieure à `0` active les connexions persistantes pour l'[[10-guides/04-njs/reference|API Fetch]].

Le paramètre *connections* définit le nombre maximal de connexions persistantes inactives vers les serveurs de destination conservées dans le cache de chaque processus de travail. Au-delà, les connexions les moins récemment utilisées sont fermées.

En Stream, le cache est tenu séparément pour chaque configuration de serveur. Une valeur définie au niveau `stream` est héritée par les serveurs, mais chaque serveur utilise son propre cache. Les connexions en cache sont réutilisées pour les requêtes ayant le même protocole, le même hôte et le même port.

Lorsqu'il est activé, le mode persistant suppose que les serveurs de destination envoient des réponses HTTP valides.

Exemple :

```nginx
server {
    listen 12345;
    js_fetch_keepalive 32;
    js_fetch_trusted_certificate /path/to/ISRG_Root_X1.pem;
    js_preread main.fetch_handler;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
