---
title: "frontchannel_logout_uri"
description: "Directive nginx frontchannel_logout_uri (ngx_http_oidc_module) — Définit le chemin d'URI qui déclenche la déconnexion par canal frontal. Pour être associée à une session utilisateur, la demande de déconnexion doit contenir le cookie de session du module ou fournir…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `frontchannel_logout_uri uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit le chemin d'URI qui déclenche la [déconnexion par canal frontal](https://openid.net/specs/openid-connect-frontchannel-1_0.html). Pour être associée à une session utilisateur, la demande de déconnexion doit contenir le cookie de session du module ou fournir les arguments « `iss` » et « `sid` ». Il est recommandé de configurer le fournisseur OpenID pour qu'il transmette « `iss` » et « `sid` » lors de l'appel à ce point de terminaison.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
