---
title: "scgi_no_cache"
description: "Directive nginx scgi_no_cache (ngx_http_scgi_module) — Définit les conditions dans lesquelles la réponse n'est pas enregistrée dans le cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », la réponse n'est pas enregistrée :…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_no_cache string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Définit les conditions dans lesquelles la réponse n'est pas enregistrée dans le cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », la réponse n'est pas enregistrée :

```nginx
scgi_no_cache $cookie_nocache $arg_nocache$arg_comment;
scgi_no_cache $http_pragma    $http_authorization;
```

Can be used along with the [[12-directives/scgi-cache-bypass|scgi_cache_bypass]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
