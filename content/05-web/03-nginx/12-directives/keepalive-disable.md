---
title: "keepalive_disable"
description: "Directive nginx keepalive_disable (ngx_http_core_module) — Désactive les connexions persistantes avec les navigateurs au comportement incorrect. Les paramètres browser indiquent les navigateurs concernés. La valeur msie6 désactive les connexions persistantes…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_disable none \| browser ...;` |
| **Valeur par défaut** | `keepalive_disable msie6;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Désactive les connexions persistantes avec les navigateurs au comportement incorrect. Les paramètres *browser* indiquent les navigateurs concernés. La valeur `msie6` désactive les connexions persistantes avec les anciennes versions de MSIE dès qu'une requête POST est reçue. La valeur `safari` les désactive avec Safari et les navigateurs similaires sous macOS et les systèmes similaires. La valeur `none` active les connexions persistantes avec tous les navigateurs.

> [!NOTE]
> Avant la version 1.1.18, la valeur `safari` concernait Safari et les navigateurs similaires sur tous les systèmes, et les connexions persistantes avec eux étaient désactivées par défaut.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
