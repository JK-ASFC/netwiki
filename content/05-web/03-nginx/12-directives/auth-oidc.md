---
title: "auth_oidc"
description: "Directive nginx auth_oidc (ngx_http_oidc_module) — Active l'authentification des utilisateurs auprès du fournisseur OpenID indiqué. La valeur du paramètre peut contenir des variables (1.29.0). La valeur spéciale off annule l'effet de la directive…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_oidc name \| off;` |
| **Valeur par défaut** | `auth_oidc off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Active l'authentification des utilisateurs auprès du fournisseur OpenID [[12-directives/oidc-provider|indiqué]].

La valeur du paramètre peut contenir des variables (1.29.0).

La valeur spéciale `off` annule l'effet de la directive `auth_oidc` héritée du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
