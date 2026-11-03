---
title: "proxy_ssl_key_log (ngx_stream_proxy_module)"
description: "Directive nginx proxy_ssl_key_log (ngx_stream_proxy_module) — Active la journalisation des clés SSL des connexions aux serveurs mandatés et indique le chemin du fichier de clés. Les clés sont écrites au format SSLKEYLOGFILE, compatible avec Wireshark. NOTE…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_key_log path;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.27.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Active la journalisation des clés SSL des connexions aux serveurs mandatés et indique le chemin du fichier de clés. Les clés sont écrites au format [SSLKEYLOGFILE](https://datatracker.ietf.org/doc/html/rfc9850), compatible avec Wireshark.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
