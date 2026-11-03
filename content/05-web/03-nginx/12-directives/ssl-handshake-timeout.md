---
title: "ssl_handshake_timeout"
description: "Directive nginx ssl_handshake_timeout (ngx_stream_ssl_module) — Specifies a timeout for the SSL handshake to complete."
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_handshake_timeout time;` |
| **Valeur par défaut** | `ssl_handshake_timeout 60s;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Specifies a timeout for the SSL handshake to complete.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
