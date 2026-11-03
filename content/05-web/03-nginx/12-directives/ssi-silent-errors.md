---
title: "ssi_silent_errors"
description: "Directive nginx ssi_silent_errors (ngx_http_ssi_module) — Si cette option est activée, supprime l'affichage de la chaîne « an error occurred while processing the directive » en cas d'erreur pendant le traitement SSI."
tags: [nginx, directive, ngx_http_ssi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssi_silent_errors on \| off;` |
| **Valeur par défaut** | `ssi_silent_errors off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_ssi_module\|ngx_http_ssi_module]] |

## Utilisation

Si cette option est activée, supprime l'affichage de la chaîne « `[an error occurred while processing the directive]` » en cas d'erreur pendant le traitement SSI.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
