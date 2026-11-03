---
title: "server_name (ngx_http_core_module)"
description: "Directive nginx server_name (ngx_http_core_module) — Définit les noms d'un serveur virtuel, par exemple : nginx server { server_name example.com www.example.com; } Le premier nom devient le nom principal du serveur. Les noms de serveurs peuvent…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_name name ...;` |
| **Valeur par défaut** | `server_name "";` |
| **Contexte** | `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

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

Les expressions régulières peuvent contenir des captures (0.7.40) réutilisables ensuite dans d'autres directives (voir [[10-guides/01-introduction/regex-captures|Captures des expressions régulières]]) :

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

Les captures nommées des expressions régulières créent des variables (0.8.25) réutilisables ensuite dans d'autres directives :

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

Si le paramètre de la directive vaut « `$hostname` » (0.9.4), le nom d'hôte de la machine est inséré.

On peut aussi indiquer un nom de serveur vide (0.7.11) :

```nginx
server {
    server_name www.example.com "";
}
```

Cela permet à ce serveur de traiter les requêtes sans champ d'en-tête `Host`, à la place du serveur par défaut, pour le couple adresse:port donné. C'est le réglage par défaut.

> [!NOTE]
> Avant la version 0.8.48, le nom d'hôte de la machine était utilisé par défaut.

La recherche s'effectue dans l'ordre de priorité suivant et s'arrête à la première variante correspondante :

1. le nom exact
2. le plus long nom générique commençant par un astérisque, par exemple « `*.example.com` »
3. le plus long nom générique se terminant par un astérisque, par exemple « `mail.*` »
4. la première expression régulière correspondante (dans l'ordre d'apparition dans le fichier de configuration)

Les noms de serveurs sont décrits en détail dans le document [[10-guides/02-http/server-names|Noms de serveurs]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
