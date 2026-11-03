---
title: "$server_addr (ngx_stream_core_module)"
description: "Variable nginx $server_addr (ngx_stream_core_module) — adresse du serveur qui a accepté la connexion Le calcul de cette variable nécessite généralement un appel système. Pour l'éviter, les directives listen doivent indiquer des adresses et utiliser le…"
tags: [nginx, variable, ngx_stream_core_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$server_addr` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

adresse du serveur qui a accepté la connexion

Le calcul de cette variable nécessite généralement un appel système. Pour l'éviter, les directives [[12-directives/listen-stream-core|listen]] doivent indiquer des adresses et utiliser le paramètre `bind`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
