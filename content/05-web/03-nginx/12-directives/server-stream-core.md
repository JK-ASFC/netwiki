---
title: "server (ngx_stream_core_module)"
description: "Directive nginx server (ngx_stream_core_module) — Sets the configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the TLS Server Name Indication extension (SNI, RFC 6066))…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Sets the configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the [TLS Server Name Indication extension](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066)) (1.25.5) virtual servers. Instead, the [[12-directives/listen-stream-core|listen]] directives describe all addresses and ports that should accept connections for the server, and the [[12-directives/server-name-stream-core|server_name]] directive lists all server names.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
