---
title: "keyval (ngx_http_keyval_module)"
description: "Directive nginx keyval (ngx_http_keyval_module) — Creates a new $variable whose value is looked up by the key in the key-value database. Matching rules are defined by the type parameter of the keyval_zone directive. The database is stored in a…"
tags: [nginx, directive, ngx_http_keyval_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keyval key $variable zone=name;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_keyval_module\|ngx_http_keyval_module]] |

## Utilisation

Creates a new *$variable* whose value is looked up by the *key* in the key-value database. Matching rules are defined by the `type` parameter of the [[12-directives/keyval-zone-http-keyval|keyval_zone]] directive. The database is stored in a shared memory zone specified by the `zone` parameter.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
