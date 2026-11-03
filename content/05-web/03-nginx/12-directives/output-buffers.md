---
title: "output_buffers"
description: "Directive nginx output_buffers (ngx_http_core_module) — Définit le nombre (number) et la taille (size) des tampons utilisés pour lire une réponse depuis le disque. NOTE Avant la version 1.9.5, la valeur par défaut était 1 32k."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `output_buffers number size;` |
| **Valeur par défaut** | `output_buffers 2 32k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le nombre (*number*) et la taille (*size*) des tampons utilisés pour lire une réponse depuis le disque.

> [!NOTE]
> Avant la version 1.9.5, la valeur par défaut était 1 32k.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
