---
title: "redirect_uri"
description: "Directive nginx redirect_uri (ngx_http_oidc_module) — Définit le chemin de l'URI de redirection que le module attend du fournisseur OpenID après l'authentification. L'uri doit correspondre à la configuration côté fournisseur. Les URI « https » absolus…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `redirect_uri uri;` |
| **Valeur par défaut** | `redirect_uri /oidc_callback;` |
| **Contexte** | `oidc_provider` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit le chemin de l'URI de redirection que le module attend du fournisseur OpenID après l'authentification. L'*uri* doit correspondre à la configuration côté fournisseur.

Les URI « `https` » absolus sont pris en charge depuis la version 1.29.0.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
