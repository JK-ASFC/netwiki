---
title: "issuer"
description: "Directive nginx issuer (ngx_http_oidc_module) — Définit l'URL d'identifiant de l'émetteur (Issuer Identifier) du fournisseur OpenID ; directive obligatoire. L'URL doit correspondre exactement à la valeur « issuer » des métadonnées du fournisseur…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `issuer URL;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit l'URL d'identifiant de l'émetteur (*Issuer Identifier*) du fournisseur OpenID ; directive obligatoire. L'URL doit correspondre exactement à la valeur « `issuer` » des métadonnées du fournisseur et utiliser le schéma « `https` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
