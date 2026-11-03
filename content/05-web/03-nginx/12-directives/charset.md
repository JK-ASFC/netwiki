---
title: "charset"
description: "Directive nginx charset (ngx_http_charset_module) — Ajoute le jeu de caractères indiqué au champ d'en-tête de réponse Content-Type. S'il diffère de celui indiqué dans la directive source_charset, une conversion est effectuée. Le paramètre off annule…"
tags: [nginx, directive, ngx_http_charset_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `charset charset \| off;` |
| **Valeur par défaut** | `charset off;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_charset_module\|ngx_http_charset_module]] |

## Utilisation

Ajoute le jeu de caractères indiqué au champ d'en-tête de réponse `Content-Type`. S'il diffère de celui indiqué dans la directive [[12-directives/source-charset|source_charset]], une conversion est effectuée.

Le paramètre `off` annule l'ajout du jeu de caractères au champ d'en-tête de réponse `Content-Type`.

Le jeu de caractères peut être défini par une variable :

```nginx
charset $charset;
```

Dans ce cas, toutes les valeurs possibles de la variable doivent apparaître au moins une fois dans la configuration, sous forme de directives [[12-directives/charset-map|charset_map]], [[12-directives/charset|charset]] ou [[12-directives/source-charset|source_charset]]. Pour les jeux `utf-8`, `windows-1251` et `koi8-r`, il suffit d'inclure les fichiers `conf/koi-win`, `conf/koi-utf` et `conf/win-utf` dans la configuration. Pour les autres, une table de conversion fictive suffit, par exemple :

```nginx
charset_map iso-8859-5 _ { }
```

Le jeu de caractères peut aussi être défini dans le champ d'en-tête de réponse `X-Accel-Charset`. Cette possibilité peut être désactivée avec les directives [[12-directives/proxy-ignore-headers|proxy_ignore_headers]], [[12-directives/fastcgi-ignore-headers|fastcgi_ignore_headers]], [[12-directives/uwsgi-ignore-headers|uwsgi_ignore_headers]], [[12-directives/scgi-ignore-headers|scgi_ignore_headers]] et [[12-directives/grpc-ignore-headers|grpc_ignore_headers]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
