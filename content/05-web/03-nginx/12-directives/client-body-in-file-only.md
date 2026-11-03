---
title: "client_body_in_file_only"
description: "Directive nginx client_body_in_file_only (ngx_http_core_module) — Indique si nginx doit enregistrer tout le corps de la requête du client dans un fichier. Cette directive peut servir au débogage, ou avec la variable $request_body_file ou la méthode…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_in_file_only on \| clean \| off;` |
| **Valeur par défaut** | `client_body_in_file_only off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Indique si nginx doit enregistrer tout le corps de la requête du client dans un fichier. Cette directive peut servir au débogage, ou avec la variable `$request_body_file` ou la méthode [[11-modules/02-http/ngx_http_perl_module|$r->request_body_file]] du module [[11-modules/02-http/ngx_http_perl_module|ngx_http_perl_module]].

Avec la valeur `on`, les fichiers temporaires ne sont pas supprimés après le traitement de la requête.

La valeur `clean` supprime les fichiers temporaires restant après le traitement de la requête.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
