---
title: "server_name (ngx_stream_core_module)"
description: "Directive nginx server_name (ngx_stream_core_module) — Définit les noms d'un serveur virtuel, par exemple : nginx server { server_name example.com www.example.com; } Le premier nom devient le nom principal du serveur. Les noms de serveurs peuvent…"
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

Définit les noms d'un serveur virtuel, par exemple :

```nginx
server {
    server_name example.com www.example.com;
}
```

Le premier nom devient le nom principal du serveur.

Les noms de serveurs peuvent contenir un astérisque (« `*` ») remplaçant la première ou la dernière partie du nom :

```nginx
server {
    server_name example.com *.example.com www.example.*;
}
```

On les appelle noms génériques.

Les deux premiers noms ci-dessus peuvent être combinés en un seul :

```nginx
server {
    server_name .example.com;
}
```

On peut aussi utiliser des expressions régulières dans les noms de serveurs, en faisant précéder le nom d'un tilde (« `~` ») :

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

La recherche s'effectue dans l'ordre de priorité suivant et s'arrête à la première variante correspondante :

1. le nom exact
2. le plus long nom générique commençant par un astérisque, par exemple « `*.example.com` »
3. le plus long nom générique se terminant par un astérisque, par exemple « `mail.*` »
4. la première expression régulière correspondante (dans l'ordre d'apparition dans le fichier de configuration)

> [!NOTE]
> The server is selected by name at the [[10-guides/03-stream/stream-processing|SSL]] or [[10-guides/03-stream/stream-processing|preread]] phase. Directives processed at earlier phases, such as [[12-directives/set-real-ip-from-stream-realip|set_real_ip_from]], [[12-directives/limit-conn-stream-limit-conn|limit_conn]], [[12-directives/set-stream-set|set]], [[12-directives/allow-stream-access|allow]], and [[12-directives/deny-stream-access|deny]], are taken from the default server for the corresponding address:port pair.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
