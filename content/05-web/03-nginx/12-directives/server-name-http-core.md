---
title: "server_name (ngx_http_core_module)"
description: "Directive nginx server_name (ngx_http_core_module) — Sets names of a virtual server, for example: nginx server { server_name example.com www.example.com; } The first name becomes the primary server name. Server names can include an asterisk (“”)…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_name name ...;` |
| **Valeur par défaut** | `server_name "";` |
| **Contexte** | `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

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

Regular expressions can contain captures (0.7.40) that can later be used in other directives (see [[10-guides/01-introduction/regex-captures|Regular expression captures]]):

```nginx
server {
    server_name ~^(www\.)?(.+)$;

    location / {
        root /sites/$2;
    }
}

server {
    server_name _;

    location / {
        root /sites/default;
    }
}
```

Named captures in regular expressions create variables (0.8.25) that can later be used in other directives:

```nginx
server {
    server_name ~^(www\.)?(?<domain>.+)$;

    location / {
        root /sites/$domain;
    }
}

server {
    server_name _;

    location / {
        root /sites/default;
    }
}
```

If the directive’s parameter is set to “`$hostname`” (0.9.4), the machine’s hostname is inserted.

It is also possible to specify an empty server name (0.7.11):

```nginx
server {
    server_name www.example.com "";
}
```

It allows this server to process requests without the `Host` header field — instead of the default server — for the given address:port pair. This is the default setting.

> [!NOTE]
> Before 0.8.48, the machine’s hostname was used by default.

The search is performed in the following order of priority and terminates on the first matching variant:

1. the exact name
2. the longest wildcard name starting with an asterisk, e.g. “`*.example.com`”
3. the longest wildcard name ending with an asterisk, e.g. “`mail.*`”
4. the first matching regular expression (in order of appearance in the configuration file)

Detailed description of server names is provided in a separate [[10-guides/02-http/server-names|Server names]] document.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
