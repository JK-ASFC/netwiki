---
title: "quic_host_key"
description: "Directive nginx quic_host_key (ngx_http_v3_module) — Indique le fichier (file) contenant la clé secrète servant à chiffrer les jetons de réinitialisation sans état et de validation d'adresse. Par défaut, une clé aléatoire est générée à chaque…"
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_host_key file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Indique le fichier (*file*) contenant la clé secrète servant à chiffrer les jetons de réinitialisation sans état et de validation d'adresse. Par défaut, une clé aléatoire est générée à chaque rechargement ; les jetons générés avec d'anciennes clés ne sont pas acceptés.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
