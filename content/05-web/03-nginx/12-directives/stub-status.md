---
title: "stub_status"
description: "Directive nginx stub_status (ngx_http_stub_status_module) — Les informations d'état de base sont accessibles depuis le bloc location englobant. NOTE Dans les versions antérieures à 1.7.5, la syntaxe de la directive exigeait un argument quelconque, par exemple…"
tags: [nginx, directive, ngx_http_stub_status_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `stub_status;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_stub_status_module\|ngx_http_stub_status_module]] |

## Utilisation

Les informations d'état de base sont accessibles depuis le bloc location englobant.

> [!NOTE]
> Dans les versions antérieures à 1.7.5, la syntaxe de la directive exigeait un argument quelconque, par exemple « `stub_status on` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
