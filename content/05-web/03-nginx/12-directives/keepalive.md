---
title: "keepalive"
description: "Directive nginx keepalive (ngx_http_upstream_module) — Active ou désactive le cache des connexions persistantes vers les serveurs amont. Depuis la version 1.29.7, ce cache est activé par défaut et ces connexions ne sont pas partagées entre les différents…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive connections [local];` |
| **Valeur par défaut** | `keepalive 32 local;` |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.1.4 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Active ou désactive le cache des connexions persistantes vers les serveurs amont. Depuis la version 1.29.7, ce cache est activé par défaut et ces connexions ne sont pas partagées entre les différents blocs [[12-directives/location|location]].

Le paramètre `local` (1.29.7) empêche le partage des connexions persistantes en cache entre blocs location différents, même si l'adresse du serveur amont est la même. Sans ce paramètre, toute connexion en cache vers le même serveur amont peut être réutilisée, quel que soit le bloc location.

Le paramètre *connections* définit le nombre maximal de connexions persistantes inactives vers les serveurs amont conservées dans le cache de chaque processus de travail. Au-delà, les connexions les moins récemment utilisées sont fermées. La valeur zéro désactive les connexions persistantes vers les serveurs amont.

> [!NOTE]
> Depuis la version 1.29.7, les connexions persistantes sont activées par défaut, avec une limite par défaut de *32* connexions par processus de travail.

> [!NOTE]
> La directive `keepalive` ne limite pas le nombre total de connexions qu'un processus de travail de nginx peut ouvrir vers les serveurs amont. Le paramètre *connections* doit être assez petit pour que les serveurs amont puissent aussi traiter de nouvelles connexions entrantes.

> [!NOTE]
> Avant la version 1.29.7, avec une méthode de répartition autre que le tourniquet par défaut, il fallait l'activer avant la directive `keepalive`.

Exemple de configuration d'un groupe amont memcached avec connexions persistantes :

```nginx
upstream memcached_backend {
    server 127.0.0.1:11211;
    server 10.0.0.2:11211;

    keepalive 32;
}

server {
    ...

    location /memcached/ {
        set $memcached_key $uri;
        memcached_pass memcached_backend;
    }

}
```

En HTTP, la directive [[12-directives/proxy-http-version|proxy_http_version]] doit valoir « `1.1` » (valeur par défaut depuis 1.29.7) ou « `2` », et le champ d'en-tête `Connection` doit être vidé. Cet exemple concerne les versions antérieures à 1.29.7 :

```nginx
upstream http_backend {
    server 127.0.0.1:8080;

    keepalive 16;
}

server {
    ...

    location /http/ {
        proxy_pass http://http_backend;
        # proxy_http_version 1.1; # before version 1.29.7
        # proxy_set_header Connection ""; # before version 1.29.7
        ...
    }
}
```

> [!NOTE]
> On peut aussi utiliser les connexions persistantes HTTP/1.0 en transmettant le champ d'en-tête `Connection: Keep-Alive` au serveur amont, mais cette méthode n'est pas recommandée.

Pour les serveurs FastCGI, il faut activer [[12-directives/fastcgi-keep-conn|fastcgi_keep_conn]] pour que les connexions persistantes fonctionnent :

```nginx
upstream fastcgi_backend {
    server 127.0.0.1:9000;

    keepalive 8;
}

server {
    ...

    location /fastcgi/ {
        fastcgi_pass fastcgi_backend;
        fastcgi_keep_conn on;
        ...
    }
}
```

> [!NOTE]
> Les protocoles SCGI et uwsgi n'ont pas de notion de connexion persistante.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
