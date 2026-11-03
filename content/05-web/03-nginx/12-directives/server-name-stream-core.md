---
title: "server_name (ngx_stream_core_module)"
description: "Directive nginx server_name (ngx_stream_core_module) — Sets names of a virtual server, for example: nginx server { server_name example.com www.example.com; } The first name becomes the primary server name. Server names can include an asterisk (“”)…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_name name ...;` |
| **Valeur par défaut** | `server_name "";` |
| **Contexte** | `server` |
| **Apparue dans la version** | 1.25.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Sets names of a virtual server, for example:

```nginx
server {
    server_name example.com www.example.com;
}
```

The first name becomes the primary server name.

Server names can include an asterisk (“`*`”) replacing the first or last part of a name:

```nginx
server {
    server_name example.com *.example.com www.example.*;
}
```

Such names are called wildcard names.

The first two of the names mentioned above can be combined in one:

```nginx
server {
    server_name .example.com;
}
```

It is also possible to use regular expressions in server names, preceding the name with a tilde (“`~`”):

```nginx
server {
    server_name www.example.com ~^www\d+\.example\.com$;
}
```

Regular expressions can contain captures that can later be used in other directives (see [[10-guides/01-introduction/regex-captures|Regular expression captures]]):

```nginx
server {
    server_name ~^(www\.)?(.+)$;

    proxy_pass www.$2:12345;
}
```

Named captures in regular expressions create variables that can later be used in other directives:

```nginx
server {
    server_name ~^(www\.)?(?<domain>.+)$;

    proxy_pass www.$domain:12345;
}
```

If the directive’s parameter is set to “`$hostname`”, the machine’s hostname is inserted.

The search is performed in the following order of priority and terminates on the first matching variant:

1. the exact name
2. the longest wildcard name starting with an asterisk, e.g. “`*.example.com`”
3. the longest wildcard name ending with an asterisk, e.g. “`mail.*`”
4. the first matching regular expression (in order of appearance in the configuration file)

> [!NOTE]
> The server is selected by name at the [[10-guides/03-stream/stream-processing|SSL]] or [[10-guides/03-stream/stream-processing|preread]] phase. Directives processed at earlier phases, such as [[12-directives/set-real-ip-from-stream-realip|set_real_ip_from]], [[12-directives/limit-conn-stream-limit-conn|limit_conn]], [[12-directives/set-stream-set|set]], [[12-directives/allow-stream-access|allow]], and [[12-directives/deny-stream-access|deny]], are taken from the default server for the corresponding address:port pair.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
