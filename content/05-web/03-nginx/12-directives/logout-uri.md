---
title: "logout_uri"
description: "Directive nginx logout_uri (ngx_http_oidc_module) — Définit le chemin d'URI qui déclenche la déconnexion de la session. À la fin de la session, l'utilisateur est redirigé vers le point de terminaison de déconnexion du fournisseur ou vers la page…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `logout_uri uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit le chemin d'URI qui déclenche la déconnexion de la session. À la fin de la session, l'utilisateur est redirigé vers le [point de terminaison de déconnexion du fournisseur](https://openid.net/specs/openid-connect-rpinitiated-1_0.html#OPMetadata) ou vers la [[12-directives/post-logout-uri|page d'après déconnexion]]. Si aucun n'est configuré, la page d'après déconnexion intégrée s'affiche.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
