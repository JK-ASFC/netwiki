---
title: "tcp_nopush"
description: "Directive nginx tcp_nopush (ngx_http_core_module) — Active ou désactive l'option de socket TCP_NOPUSH sous FreeBSD ou TCP_CORK sous Linux. Ces options ne sont activées qu'avec sendfile. Les activer permet - d'envoyer l'en-tête de réponse et le début…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `tcp_nopush on \| off;` |
| **Valeur par défaut** | `tcp_nopush off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'option de socket `TCP_NOPUSH` sous FreeBSD ou `TCP_CORK` sous Linux. Ces options ne sont activées qu'avec [[12-directives/sendfile|sendfile]]. Les activer permet

- d'envoyer l'en-tête de réponse et le début du fichier dans un seul paquet, sous Linux et FreeBSD 4.\* ;
- d'envoyer un fichier en paquets pleins.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
