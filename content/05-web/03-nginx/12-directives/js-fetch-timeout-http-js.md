---
title: "js_fetch_timeout (ngx_http_js_module)"
description: "Directive nginx js_fetch_timeout (ngx_http_js_module) — Définit le délai de lecture et d'écriture pour l'API Fetch. Ce délai porte uniquement sur l'intervalle entre deux opérations de lecture ou d'écriture successives, pas sur toute la réponse. Si aucune…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_timeout time;` |
| **Valeur par défaut** | `js_fetch_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.4 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Définit le délai de lecture et d'écriture pour l'[[10-guides/04-njs/reference|API Fetch]]. Ce délai porte uniquement sur l'intervalle entre deux opérations de lecture ou d'écriture successives, pas sur toute la réponse. Si aucune donnée n'est transmise pendant ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
