---
title: "accept_terms_of_service"
description: "Directive nginx accept_terms_of_service (ngx_http_acme_module) — Accepte les conditions d'utilisation du serveur ACME. Certains serveurs exigent leur acceptation avant l'enregistrement du compte. Les conditions sont généralement disponibles sur le site du serveur…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `accept_terms_of_service;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Accepte les conditions d'utilisation du serveur ACME. Certains serveurs exigent leur acceptation avant l'enregistrement du compte. Les conditions sont généralement disponibles sur le site du serveur ACME, et l'URL est écrite dans le journal d'erreurs si nécessaire.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
