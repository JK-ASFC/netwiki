---
title: "$server_addr (ngx_stream_core_module)"
description: "Variable nginx $server_addr (ngx_stream_core_module) — an address of the server which accepted a connection Le calcul de cette variable nécessite généralement un appel système. Pour l'éviter, les directives listen doivent indiquer des adresses et…"
tags: [nginx, variable, ngx_stream_core_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$server_addr` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

an address of the server which accepted a connection

Le calcul de cette variable nécessite généralement un appel système. Pour l'éviter, les directives [[12-directives/listen-stream-core|listen]] doivent indiquer des adresses et utiliser le paramètre `bind`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
