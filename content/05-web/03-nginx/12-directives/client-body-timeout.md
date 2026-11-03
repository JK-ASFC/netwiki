---
title: "client_body_timeout"
description: "Directive nginx client_body_timeout (ngx_http_core_module) — Définit le délai de lecture du corps de la requête du client. Ce délai porte uniquement sur l'intervalle entre deux lectures successives, pas sur la transmission de tout le corps. Si le client…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_timeout time;` |
| **Valeur par défaut** | `client_body_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le délai de lecture du corps de la requête du client. Ce délai porte uniquement sur l'intervalle entre deux lectures successives, pas sur la transmission de tout le corps. Si le client n'envoie rien pendant ce délai, la requête se termine par l'erreur `408 Request Time-out`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
