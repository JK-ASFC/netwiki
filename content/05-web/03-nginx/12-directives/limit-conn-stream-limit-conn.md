---
title: "limit_conn (ngx_stream_limit_conn_module)"
description: "Directive nginx limit_conn (ngx_stream_limit_conn_module) — Définit la zone de mémoire partagée et le nombre maximal de connexions autorisées pour une valeur de clé donnée. Au-delà de cette limite, le serveur ferme la connexion. Par exemple, les directives…"
tags: [nginx, directive, ngx_stream_limit_conn_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn zone number;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_limit_conn_module\|ngx_stream_limit_conn_module]] |

## Utilisation

Définit la zone de mémoire partagée et le nombre maximal de connexions autorisées pour une valeur de clé donnée. Au-delà de cette limite, le serveur ferme la connexion. Par exemple, les directives

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    ...
    limit_conn addr 1;
}
```

n'autorisent qu'une seule connexion à la fois par adresse IP.

Quand plusieurs directives `limit_conn` sont indiquées, chaque limite configurée s'applique.

Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `limit_conn` n'est définie au niveau courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
