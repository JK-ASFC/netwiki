---
title: "split_clients (ngx_http_split_clients_module)"
description: "Directive nginx split_clients (ngx_http_split_clients_module) — Creates a variable for A/B testing, for example: nginx split_clients \"${remote_addr}AAA\" $variant { 0.5% .one; 2.0% .two; \"\"; } The value of the original string is hashed using MurmurHash2. In the…"
tags: [nginx, directive, ngx_http_split_clients_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `split_clients string $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_split_clients_module\|ngx_http_split_clients_module]] |

## Utilisation

Creates a variable for A/B testing, for example:

```nginx
split_clients "${remote_addr}AAA" $variant {
               0.5%               .one;
               2.0%               .two;
               *                  "";
}
```

The value of the original string is hashed using MurmurHash2. In the example given, hash values from 0 to 21474835 (0.5%) correspond to the value `".one"` of the `$variant` variable, hash values from 21474836 to 107374180 (2%) correspond to the value `".two"`, and hash values from 107374181 to 4294967295 correspond to the value `""` (an empty string).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
