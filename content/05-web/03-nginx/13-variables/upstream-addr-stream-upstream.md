---
title: "$upstream_addr (ngx_stream_upstream_module)"
description: "Variable nginx $upstream_addr (ngx_stream_upstream_module) — contient l'adresse IP et le port, ou le chemin de la socket de domaine UNIX, du serveur amont (1.11.4). Si plusieurs serveurs ont été contactés pendant le relais, leurs adresses sont séparées par des…"
tags: [nginx, variable, ngx_stream_upstream_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_addr` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

contient l'adresse IP et le port, ou le chemin de la socket de domaine UNIX, du serveur amont (1.11.4). Si plusieurs serveurs ont été contactés pendant le relais, leurs adresses sont séparées par des virgules, par exemple « `192.168.1.1:12345, 192.168.1.2:12345, unix:/tmp/sock` ». Si aucun serveur n'a pu être choisi, la variable contient le nom du groupe de serveurs.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
