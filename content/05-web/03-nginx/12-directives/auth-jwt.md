---
title: "auth_jwt"
description: "Directive nginx auth_jwt (ngx_http_auth_jwt_module) — Active la validation des JSON Web Token. La chaîne (string) indiquée sert de domaine (realm). La valeur du paramètre peut contenir des variables. Le paramètre facultatif token indique une variable…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt string [token=$variable] \| off;` |
| **Valeur par défaut** | `auth_jwt off;` |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Active la validation des JSON Web Token. La chaîne (*string*) indiquée sert de domaine (`realm`). La valeur du paramètre peut contenir des variables.

Le paramètre facultatif `token` indique une variable contenant le JSON Web Token. Par défaut, le JWT est transmis dans l'en-tête `Authorization` sous forme de [Bearer Token](https://datatracker.ietf.org/doc/html/rfc6750). Il peut aussi être transmis dans un cookie ou dans la chaîne de requête :

```nginx
auth_jwt "closed site" token=$cookie_auth_token;
```

La valeur spéciale `off` annule l'effet de la directive `auth_jwt` héritée du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
