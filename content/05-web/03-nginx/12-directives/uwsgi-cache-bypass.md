---
title: "uwsgi_cache_bypass"
description: "Directive nginx uwsgi_cache_bypass (ngx_http_uwsgi_module) — Définit les conditions dans lesquelles la réponse n'est pas prise dans le cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », la réponse n'est pas prise dans le cache :…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_cache_bypass string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Définit les conditions dans lesquelles la réponse n'est pas prise dans le cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », la réponse n'est pas prise dans le cache :

```nginx
uwsgi_cache_bypass $cookie_nocache $arg_nocache$arg_comment;
uwsgi_cache_bypass $http_pragma    $http_authorization;
```

Can be used along with the [[12-directives/uwsgi-no-cache|uwsgi_no_cache]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
