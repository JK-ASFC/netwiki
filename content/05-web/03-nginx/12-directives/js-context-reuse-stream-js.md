---
title: "js_context_reuse (ngx_stream_js_module)"
description: "Directive nginx js_context_reuse (ngx_stream_js_module) — Définit le nombre maximal de contextes JS réutilisés pour le moteur QuickJS. Chaque contexte sert à une seule session stream. Le contexte terminé est placé dans un groupe de contextes réutilisables.…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_context_reuse number;` |
| **Valeur par défaut** | `js_context_reuse 128;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.8.6 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Définit le nombre maximal de contextes JS réutilisés pour le [[10-guides/04-njs/engine|moteur QuickJS]]. Chaque contexte sert à une seule session stream. Le contexte terminé est placé dans un groupe de contextes réutilisables. Si le groupe est plein, le contexte est détruit.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
