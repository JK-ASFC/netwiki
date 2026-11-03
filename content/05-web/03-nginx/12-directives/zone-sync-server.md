---
title: "zone_sync_server"
description: "Directive nginx zone_sync_server (ngx_stream_zone_sync_module) — Définit l'adresse d'un nœud du cluster. L'adresse peut être un nom de domaine ou une adresse IP avec un port obligatoire, ou un chemin de socket de domaine UNIX précédé du préfixe « unix: ». Un nom…"
tags: [nginx, directive, ngx_stream_zone_sync_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `zone_sync_server address [resolve];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_zone_sync_module\|ngx_stream_zone_sync_module]] |

## Utilisation

Définit l'*adresse* d'un nœud du cluster. L'adresse peut être un nom de domaine ou une adresse IP avec un port obligatoire, ou un chemin de socket de domaine UNIX précédé du préfixe « `unix:` ». Un nom de domaine qui se résout en plusieurs adresses IP définit plusieurs nœuds à la fois.

Le paramètre `resolve` demande à nginx de surveiller les changements des adresses IP correspondant au nom de domaine du nœud et de modifier automatiquement la configuration sans redémarrer nginx.

Les nœuds du cluster sont indiqués soit dynamiquement, par une seule directive `zone_sync_server` avec le paramètre `resolve`, soit statiquement, par une série de directives sans ce paramètre.

> [!NOTE]
> Chaque nœud du cluster ne doit être indiqué qu'une fois.

> [!NOTE]
> Tous les nœuds du cluster doivent utiliser la même configuration.

Pour que le paramètre `resolve` fonctionne, la directive [[12-directives/resolver-stream-core|resolver]] doit être indiquée dans le bloc [[12-directives/stream|stream]]. Exemple :

```nginx
stream {
    resolver 10.0.0.1;

    server {
        zone_sync;
        zone_sync_server cluster.example.com:12345 resolve;
        ...
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
