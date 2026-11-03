---
title: "msie_padding"
description: "Directive nginx msie_padding (ngx_http_core_module) — Active ou désactive l'ajout de commentaires aux réponses de statut supérieur à 400 pour les clients MSIE, afin de porter la taille de la réponse à 512 octets."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `msie_padding on \| off;` |
| **Valeur par défaut** | `msie_padding on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'ajout de commentaires aux réponses de statut supérieur à 400 pour les clients MSIE, afin de porter la taille de la réponse à 512 octets.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
