---
title: "acme_certificate"
description: "Directive nginx acme_certificate (ngx_http_acme_module) — Définit un certificat avec la liste d'identifiants identifiers demandée à l'émetteur issuer. La liste explicite d'identifiants peut être omise : ils sont alors pris dans la directive server_name du…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `acme_certificate issuer [identifier ...] [key=alg[:size]];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Définit un certificat avec la liste d'identifiants `identifiers` demandée à l'émetteur `issuer`.

La liste explicite d'identifiants peut être omise : ils sont alors pris dans la directive [[12-directives/server-name-http-core|server_name]] du même bloc [[12-directives/server-http-core|server]]. Toutes les valeurs acceptées par `server_name` ne sont pas des identifiants de certificat valides : les expressions régulières et les noms génériques ne sont pas pris en charge.

Le paramètre key définit le type de la clé privée générée. Algorithmes et tailles pris en charge : `ecdsa:256` (par défaut), `ecdsa:384`, `ecdsa:521`, `rsa:2048`, `rsa:3072`, `rsa:4096`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
