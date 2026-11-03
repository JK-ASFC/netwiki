---
title: "sendfile"
description: "Directive nginx sendfile (ngx_http_core_module) — Active ou désactive l'utilisation de sendfile. À partir de nginx 0.8.12 et FreeBSD 5.2.1, aio permet de précharger les données pour sendfile : nginx location /video/ { sendfile on; tcp_nopush on; aio…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sendfile on \| off;` |
| **Valeur par défaut** | `sendfile off;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'utilisation de `sendfile`.

À partir de nginx 0.8.12 et FreeBSD 5.2.1, [[12-directives/aio|aio]] permet de précharger les données pour `sendfile` :

```nginx
location /video/ {
    sendfile       on;
    tcp_nopush     on;
    aio            on;
}
```

Dans cette configuration, `sendfile` est appelé avec l'option `SF_NODISKIO`, qui l'empêche de bloquer sur les entrées-sorties disque et lui fait signaler que les données ne sont pas en mémoire. nginx lance alors un chargement asynchrone en lisant un octet. À la première lecture, le noyau FreeBSD charge en mémoire les premiers 128K octets du fichier ; les lectures suivantes ne chargent que des blocs de 16K. Ce comportement se modifie avec la directive [[12-directives/read-ahead|read_ahead]].

> [!NOTE]
> Avant la version 1.7.11, le préchargement s'activait avec `aio sendfile;`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
