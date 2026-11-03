---
title: "js_engine (ngx_stream_js_module)"
description: "Directive nginx js_engine (ngx_stream_js_module) — Définit le moteur JavaScript utilisé pour les scripts njs. Le paramètre njs choisit le moteur njs, utilisé par défaut ; le paramètre qjs choisit le moteur QuickJS. NOTE Le moteur njs est obsolète…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_engine njs \| qjs;` |
| **Valeur par défaut** | `js_engine njs;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.8.6 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Définit le [[10-guides/04-njs/engine|moteur JavaScript]] utilisé pour les scripts njs. Le paramètre `njs` choisit le moteur njs, utilisé par défaut ; le paramètre `qjs` choisit le moteur QuickJS.

> [!NOTE]
> Le moteur `njs` est obsolète depuis la version 1.0.0 ; les nouvelles configurations doivent utiliser le moteur `qjs` ([[10-guides/04-njs/engine|QuickJS]]).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
