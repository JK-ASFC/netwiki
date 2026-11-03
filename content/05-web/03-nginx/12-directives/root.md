---
title: "root"
description: "Directive nginx root (ngx_http_core_module) — Sets the root directory for requests. For example, with the following configuration nginx location /i/ { root /data/w3; } The /data/w3/i/top.gif file will be sent in response to the “/i/top.gif”…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `root path;` |
| **Valeur par défaut** | `root html;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the root directory for requests. For example, with the following configuration

```nginx
location /i/ {
    root /data/w3;
}
```

The `/data/w3/i/top.gif` file will be sent in response to the “`/i/top.gif`” request.

The *path* value can contain variables, except `$document_root` and `$realpath_root`.

A path to the file is constructed by merely adding a URI to the value of the `root` directive. If a URI has to be modified, the [[12-directives/alias|alias]] directive should be used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
