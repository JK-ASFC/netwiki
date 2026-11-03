---
title: "gzip_buffers"
description: "Directive nginx gzip_buffers (ngx_http_gzip_module) — Définit le nombre (number) et la taille (size) des tampons utilisés pour compresser une réponse. Par défaut, la taille d'un tampon est égale à une page mémoire, soit 4K ou 8K selon la plate-forme.…"
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_buffers number size;` |
| **Valeur par défaut** | `gzip_buffers 32 4k\|16 8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Définit le nombre (*number*) et la taille (*size*) des tampons utilisés pour compresser une réponse. Par défaut, la taille d'un tampon est égale à une page mémoire, soit 4K ou 8K selon la plate-forme.

> [!NOTE]
> Jusqu'à la version 0.7.28, quatre tampons de 4K ou 8K étaient utilisés par défaut.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
