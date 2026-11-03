---
title: "subrequest_output_buffer_size"
description: "Directive nginx subrequest_output_buffer_size (ngx_http_core_module) — Définit la taille (size) du tampon qui stocke le corps de la réponse d'une sous-requête. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme. Il peut toutefois être…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `subrequest_output_buffer_size size;` |
| **Valeur par défaut** | `subrequest_output_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.13.10 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit la taille (*size*) du tampon qui stocke le corps de la réponse d'une sous-requête. Par défaut, le tampon fait une page mémoire, soit 4K ou 8K selon la plate-forme. Il peut toutefois être réduit.

La directive ne s'applique qu'aux sous-requêtes dont le corps de réponse est conservé en mémoire, comme celles créées par [[11-modules/02-http/ngx_http_ssi_module|SSI]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
