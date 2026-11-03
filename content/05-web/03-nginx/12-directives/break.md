---
title: "break"
description: "Directive nginx break (ngx_http_rewrite_module) — Arrête le traitement de l'ensemble courant de directives ngx_http_rewrite_module. Si la directive est indiquée dans un bloc location, le traitement de la requête se poursuit dans ce bloc. Exemple :…"
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `break;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

Arrête le traitement de l'ensemble courant de directives `ngx_http_rewrite_module`.

Si la directive est indiquée dans un bloc [[12-directives/location|location]], le traitement de la requête se poursuit dans ce bloc.

Exemple :

```nginx
if ($slow) {
    limit_rate 10k;
    break;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
