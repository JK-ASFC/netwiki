---
title: "auth_http_header"
description: "Directive nginx auth_http_header (ngx_mail_auth_http_module) — Ajoute l'en-tête indiqué aux requêtes envoyées au serveur d'authentification. Cet en-tête peut servir de secret partagé pour vérifier que la requête provient de nginx. Par exemple : nginx…"
tags: [nginx, directive, ngx_mail_auth_http_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_http_header header value;` |
| **Valeur par défaut** | — |
| **Contexte** | `mail`, `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_auth_http_module\|ngx_mail_auth_http_module]] |

## Utilisation

Ajoute l'en-tête indiqué aux requêtes envoyées au serveur d'authentification. Cet en-tête peut servir de secret partagé pour vérifier que la requête provient de nginx. Par exemple :

```nginx
auth_http_header X-Auth-Key "secret_string";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
