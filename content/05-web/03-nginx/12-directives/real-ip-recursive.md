---
title: "real_ip_recursive"
description: "Directive nginx real_ip_recursive (ngx_http_realip_module) — Si la recherche récursive est désactivée, l'adresse d'origine du client qui correspond à l'une des adresses de confiance est remplacée par la dernière adresse transmise dans le champ d'en-tête défini…"
tags: [nginx, directive, ngx_http_realip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `real_ip_recursive on \| off;` |
| **Valeur par défaut** | `real_ip_recursive off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.3.0, 1.2.1 |
| **Module** | [[11-modules/02-http/ngx_http_realip_module\|ngx_http_realip_module]] |

## Utilisation

Si la recherche récursive est désactivée, l'adresse d'origine du client qui correspond à l'une des adresses de confiance est remplacée par la dernière adresse transmise dans le champ d'en-tête défini par la directive [[12-directives/real-ip-header|real_ip_header]]. Si la recherche récursive est activée, elle est remplacée par la dernière adresse non fiable transmise dans ce champ.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
