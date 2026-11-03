---
title: "env"
description: "Directive nginx env (Core functionality) — By default, nginx removes all environment variables inherited from its parent process except the TZ variable. This directive allows preserving some of the inherited variables, changing their values,…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `env variable[=value];` |
| **Valeur par défaut** | `env TZ;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

By default, nginx removes all environment variables inherited from its parent process except the TZ variable. This directive allows preserving some of the inherited variables, changing their values, or creating new environment variables. These variables are then:

- inherited during a [[10-guides/01-introduction/control|live upgrade]] of an executable file;
- used by the [[11-modules/02-http/ngx_http_perl_module|ngx_http_perl_module]] module;
- used by worker processes. One should bear in mind that controlling system libraries in this way is not always possible as it is common for libraries to check variables only during initialization, well before they can be set using this directive. An exception from this is an above mentioned [[10-guides/01-introduction/control|live upgrade]] of an executable file.

The TZ variable is always inherited and available to the [[11-modules/02-http/ngx_http_perl_module|ngx_http_perl_module]] module, unless it is configured explicitly.

Usage example:

```nginx
env MALLOC_OPTIONS;
env PERL5LIB=/data/site/modules;
env OPENSSL_ALLOW_PROXY_CERTS=1;
```

> [!NOTE]
> The NGINX environment variable is used internally by nginx and should not be set directly by the user.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
