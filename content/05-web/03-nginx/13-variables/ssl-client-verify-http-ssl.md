---
title: "$ssl_client_verify (ngx_http_ssl_module)"
description: "Variable nginx $ssl_client_verify (ngx_http_ssl_module) — renvoie le résultat de la vérification du certificat du client : « SUCCESS », « FAILED:reason », ou « NONE » si aucun certificat n'a été présenté ; NOTE Avant la version 1.11.7, le résultat « FAILED…"
tags: [nginx, variable, ngx_http_ssl_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$ssl_client_verify` |
| **Module** | [[11-modules/02-http/ngx_http_ssl_module\|ngx_http_ssl_module]] |

renvoie le résultat de la vérification du certificat du client : « `SUCCESS` », « `FAILED:`*reason* », ou « `NONE` » si aucun certificat n'a été présenté ;

> [!NOTE]
> Avant la version 1.11.7, le résultat « `FAILED` » ne contenait pas la chaîne *reason*.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
