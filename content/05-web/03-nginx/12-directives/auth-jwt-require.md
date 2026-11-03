---
title: "auth_jwt_require"
description: "Directive nginx auth_jwt_require (ngx_http_auth_jwt_module) — Indique des vérifications supplémentaires pour la validation des JWT. La valeur peut contenir du texte, des variables ou une combinaison des deux, et doit commencer par une variable (1.21.7).…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_require $value ... [error=401 \| 403];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Apparue dans la version** | 1.21.2 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Indique des vérifications supplémentaires pour la validation des JWT. La valeur peut contenir du texte, des variables ou une combinaison des deux, et doit commencer par une variable (1.21.7). L'authentification ne réussit que si toutes les valeurs ne sont ni vides ni égales à « 0 ».

```nginx
map $jwt_claim_iss $valid_jwt_iss {
    "good" 1;
}
...

auth_jwt_require $valid_jwt_iss;
```

Si l'une des vérifications échoue, le code d'erreur `401` est renvoyé. Le paramètre facultatif `error` (1.21.7) permet de le remplacer par `403`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
