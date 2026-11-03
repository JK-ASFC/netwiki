---
title: "$ssl_ech_outer_server_name (ngx_stream_ssl_module)"
description: "Variable nginx $ssl_ech_outer_server_name (ngx_stream_ssl_module) — returns the public server name requested through SNI if TLS 1.3 ECH was accepted, otherwise “” (1.29.4);"
tags: [nginx, variable, ngx_stream_ssl_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_ech_outer_server_name` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

returns the public server name requested through [SNI](http://en.wikipedia.org/wiki/Server_Name_Indication) if TLS 1.3 [[12-directives/ssl-ech-file-stream-ssl|ECH]] was accepted, otherwise “” (1.29.4);

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
