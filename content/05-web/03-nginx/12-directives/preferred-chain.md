---
title: "preferred_chain"
description: "Directive nginx preferred_chain (ngx_http_acme_module) — Indique la chaîne de certificats préférée. Si le serveur ACME propose plusieurs chaînes de certificats, la chaîne dont le certificat le plus haut est émis par le nom commun name est préférée. Sans…"
tags: [nginx, directive, ngx_http_acme_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `preferred_chain name;` |
| **Valeur par défaut** | — |
| **Contexte** | `acme_issuer` |
| **Apparue dans la version** | 0.3.0 |
| **Module** | [[11-modules/02-http/ngx_http_acme_module\|ngx_http_acme_module]] |

## Utilisation

Indique la chaîne de certificats préférée.

Si le serveur ACME propose plusieurs chaînes de certificats, la chaîne dont le certificat le plus haut est émis par le nom commun *name* est préférée. Sans correspondance, la chaîne par défaut est utilisée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
