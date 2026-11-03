---
title: "real_ip_header"
description: "Directive nginx real_ip_header (ngx_http_realip_module) — Définit le champ d'en-tête de requête dont la valeur remplacera l'adresse du client. Si la valeur du champ d'en-tête contient un port, celui-ci remplace aussi le port du client (1.11.0). L'adresse et…"
tags: [nginx, directive, ngx_http_realip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `real_ip_header field \| X-Real-IP \| X-Forwarded-For \| proxy_protocol;` |
| **Valeur par défaut** | `real_ip_header X-Real-IP;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_realip_module\|ngx_http_realip_module]] |

## Utilisation

Définit le champ d'en-tête de requête dont la valeur remplacera l'adresse du client.

Si la valeur du champ d'en-tête contient un port, celui-ci remplace aussi le port du client (1.11.0). L'adresse et le port doivent être indiqués conformément à la [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986).

Le paramètre `proxy_protocol` (1.5.12) remplace l'adresse du client par celle de l'en-tête du protocole PROXY. Le protocole PROXY doit au préalable être activé avec le paramètre `proxy_protocol` de la directive [[12-directives/listen-http-core|listen]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
