---
title: "contact"
description: "Directive nginx contact (ngx_http_acme_module) — Définit une liste d'URL que le serveur ACME peut utiliser pour contacter le client au sujet du compte. Le schéma mailto: est utilisé s'il n'est pas indiqué explicitement."
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `contact URL;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Définit une liste d'URL que le serveur ACME peut utiliser pour contacter le client au sujet du compte. Le schéma `mailto:` est utilisé s'il n'est pas indiqué explicitement.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
