---
title: "quic_retry"
description: "Directive nginx quic_retry (ngx_http_v3_module) — Active la validation d'adresse QUIC : envoi d'un nouveau jeton dans un paquet Retry ou une trame NEW_TOKEN, et validation du jeton reçu dans le paquet Initial."
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_retry on \| off;` |
| **Valeur par défaut** | `quic_retry off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Active la [validation d'adresse QUIC](https://datatracker.ietf.org/doc/html/rfc9000#name-address-validation) : envoi d'un nouveau jeton dans un paquet `Retry` ou une trame `NEW_TOKEN`, et validation du jeton reçu dans le paquet `Initial`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
