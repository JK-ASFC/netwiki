---
title: "auth_jwt_claim_set"
description: "Directive nginx auth_jwt_claim_set (ngx_http_auth_jwt_module) — Sets the variable to a JWT claim parameter identified by key names. Name matching starts from the top level of the JSON tree. For arrays, the variable keeps a list of array elements separated by…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_claim_set $variable name ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Apparue dans la version** | 1.11.10 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Sets the *variable* to a JWT claim parameter identified by key names. Name matching starts from the top level of the JSON tree. For arrays, the variable keeps a list of array elements separated by commas.

```nginx
auth_jwt_claim_set $email info e-mail;
auth_jwt_claim_set $job info "job title";
```

> [!NOTE]
> Prior to version 1.13.7, only one key name could be specified, and the result was undefined for arrays.

> [!NOTE]
> Variable values for tokens encrypted with JWE are available only after decryption which occurs during the [[10-guides/06-developpement/development-guide|Access]] phase.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
