---
title: "limit_conn (ngx_http_limit_conn_module)"
description: "Directive nginx limit_conn (ngx_http_limit_conn_module) — Définit la zone de mémoire partagée et le nombre maximal de connexions autorisées pour une valeur de clé donnée. Au-delà de cette limite, le serveur renvoie une erreur en réponse à la requête. Par…"
tags: [nginx, directive, ngx_http_limit_conn_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_conn zone number;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_limit_conn_module\|ngx_http_limit_conn_module]] |

## Utilisation

Définit la zone de mémoire partagée et le nombre maximal de connexions autorisées pour une valeur de clé donnée. Au-delà de cette limite, le serveur renvoie une [[12-directives/limit-conn-status|erreur]] en réponse à la requête. Par exemple, les directives

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    location /download/ {
        limit_conn addr 1;
    }
```

n'autorisent qu'une seule connexion à la fois par adresse IP.

> [!NOTE]
> En HTTP/2 et HTTP/3, chaque requête simultanée est considérée comme une connexion distincte.

Il peut y avoir plusieurs directives `limit_conn`. Par exemple, la configuration suivante limite le nombre de connexions au serveur par adresse IP de client et, en même temps, le nombre total de connexions au serveur virtuel :

```nginx
limit_conn_zone $binary_remote_addr zone=perip:10m;
limit_conn_zone $server_name zone=perserver:10m;

server {
    ...
    limit_conn perip 10;
    limit_conn perserver 100;
}
```

Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `limit_conn` n'est définie au niveau courant.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
