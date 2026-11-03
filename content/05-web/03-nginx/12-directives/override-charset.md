---
title: "override_charset"
description: "Directive nginx override_charset (ngx_http_charset_module) — Indique si une conversion doit être effectuée pour les réponses reçues d'un serveur mandaté ou d'un serveur FastCGI/uwsgi/SCGI/gRPC qui portent déjà un jeu de caractères dans le champ d'en-tête…"
tags: [nginx, directive, ngx_http_charset_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `override_charset on \| off;` |
| **Valeur par défaut** | `override_charset off;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_charset_module\|ngx_http_charset_module]] |

## Utilisation

Indique si une conversion doit être effectuée pour les réponses reçues d'un serveur mandaté ou d'un serveur FastCGI/uwsgi/SCGI/gRPC qui portent déjà un jeu de caractères dans le champ d'en-tête `Content-Type`. Si la conversion est activée, le jeu de caractères de la réponse reçue sert de jeu source.

> [!NOTE]
> Si la réponse est reçue dans une sous-requête, la conversion du jeu de caractères de la réponse vers celui de la requête principale est toujours effectuée, quelle que soit la valeur de la directive `override_charset`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
