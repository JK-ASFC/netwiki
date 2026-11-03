---
title: "auth_jwt_key_file"
description: "Directive nginx auth_jwt_key_file (ngx_http_auth_jwt_module) — Indique un fichier (file) au format JSON Web Key Set pour valider la signature des JWT. La valeur du paramètre peut contenir des variables. Plusieurs directives auth_jwt_key_file peuvent être…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_key_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Indique un fichier (*file*) au format [JSON Web Key Set](https://datatracker.ietf.org/doc/html/rfc7517#section-5) pour valider la signature des JWT. La valeur du paramètre peut contenir des variables.

Plusieurs directives `auth_jwt_key_file` peuvent être indiquées au même niveau (1.21.1) :

```nginx
auth_jwt_key_file conf/keys.json;
auth_jwt_key_file conf/key.jwk;
```

Si au moins une des clés indiquées ne peut pas être chargée ou traitée, nginx renvoie l'erreur `500 Internal Server Error`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
