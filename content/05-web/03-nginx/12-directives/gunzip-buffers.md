---
title: "gunzip_buffers"
description: "Directive nginx gunzip_buffers (ngx_http_gunzip_module) — Définit le nombre (number) et la taille (size) des tampons utilisés pour décompresser une réponse. Par défaut, la taille d'un tampon est égale à une page mémoire, soit 4K ou 8K selon la plate-forme."
tags: [nginx, directive, ngx_http_gunzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gunzip_buffers number size;` |
| **Valeur par défaut** | `gunzip_buffers 32 4k\|16 8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gunzip_module\|ngx_http_gunzip_module]] |

## Utilisation

Définit le nombre (*number*) et la taille (*size*) des tampons utilisés pour décompresser une réponse. Par défaut, la taille d'un tampon est égale à une page mémoire, soit 4K ou 8K selon la plate-forme.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
