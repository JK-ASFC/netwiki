---
title: "connection_pool_size"
description: "Directive nginx connection_pool_size (ngx_http_core_module) — Permet un réglage précis des allocations mémoire par connexion. Cette directive a un impact minime sur les performances et ne doit généralement pas être utilisée. Par défaut, la taille est de 256…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `connection_pool_size size;` |
| **Valeur par défaut** | `connection_pool_size 256\|512;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Permet un réglage précis des allocations mémoire par connexion. Cette directive a un impact minime sur les performances et ne doit généralement pas être utilisée. Par défaut, la taille est de 256 octets sur les plates-formes 32 bits et de 512 octets sur les plates-formes 64 bits.

> [!NOTE]
> Avant la version 1.9.8, la valeur par défaut était 256 sur toutes les plates-formes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
