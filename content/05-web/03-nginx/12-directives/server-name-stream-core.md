---
title: "server_name (ngx_stream_core_module)"
description: "Directive nginx server_name (ngx_stream_core_module) — Définit les noms d'un serveur virtuel, par exemple : nginx server { server_name example.com www.example.com; } Le premier nom devient le nom principal du serveur. Les noms de serveurs peuvent…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

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

Les expressions régulières peuvent contenir des captures réutilisables ensuite dans d'autres directives (voir [[10-guides/01-introduction/regex-captures|Captures des expressions régulières]]) :

```nginx
server {
    server_name ~^(www\.)?(.+)$;

    proxy_pass www.$2:12345;
}
```

Les captures nommées des expressions régulières créent des variables réutilisables ensuite dans d'autres directives :

```nginx
server {
    server_name ~^(www\.)?(?<domain>.+)$;

    proxy_pass www.$domain:12345;
}
```

Si le paramètre de la directive vaut « `$hostname` », le nom d'hôte de la machine est inséré.

La recherche s'effectue dans l'ordre de priorité suivant et s'arrête à la première variante correspondante :

1. le nom exact
2. le plus long nom générique commençant par un astérisque, par exemple « `*.example.com` »
3. le plus long nom générique se terminant par un astérisque, par exemple « `mail.*` »
4. la première expression régulière correspondante (dans l'ordre d'apparition dans le fichier de configuration)

> [!NOTE]
> Le serveur est choisi par son nom à la phase [[10-guides/03-stream/stream-processing|SSL]] ou de [[10-guides/03-stream/stream-processing|prélecture]]. Les directives traitées aux phases antérieures, comme [[12-directives/set-real-ip-from-stream-realip|set_real_ip_from]], [[12-directives/limit-conn-stream-limit-conn|limit_conn]], [[12-directives/set-stream-set|set]], [[12-directives/allow-stream-access|allow]] et [[12-directives/deny-stream-access|deny]], sont prises dans le serveur par défaut de la paire adresse:port correspondante.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
