---
title: "external_account_key"
description: "Directive nginx external_account_key (ngx_http_acme_module) — Indique un identifiant de clé kid et un fichier (file) contenant la clé MAC pour l'autorisation par compte externe. On peut indiquer data:key à la place de file pour charger la clé directement depuis…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `external_account_key kid file;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.2.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Indique un identifiant de clé *kid* et un fichier (*file*) contenant la clé MAC pour l'[autorisation par compte externe](https://datatracker.ietf.org/doc/html/rfc8555#section-7.3.4).

On peut indiquer `data`:*key* à la place de *file* pour charger la clé directement depuis la configuration, sans fichier intermédiaire.

Dans les deux cas, la clé doit être encodée en [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
