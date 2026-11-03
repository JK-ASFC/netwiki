---
title: "match (ngx_stream_upstream_hc_module)"
description: "Directive nginx match (ngx_stream_upstream_hc_module) — Définit l'ensemble de tests nommé utilisé pour vérifier les réponses des serveurs aux vérifications de santé. Les paramètres suivants peuvent être configurés : - send string; envoie une chaîne au…"
tags: [nginx, directive, ngx_stream_upstream_hc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `match name { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_hc_module\|ngx_stream_upstream_hc_module]] |

## Utilisation

Définit l'ensemble de tests nommé utilisé pour vérifier les réponses des serveurs aux vérifications de santé.

Les paramètres suivants peuvent être configurés :

- **`send` *string*;**

  envoie une *chaîne* au serveur ;

- **`expect` *string* | `~` *regex*;**

  une chaîne littérale (1.9.12) ou une expression régulière à laquelle les données obtenues du serveur doivent correspondre. L'expression régulière est précédée du modificateur « `~*` » (correspondance insensible à la casse) ou « `~` » (sensible à la casse).

Les paramètres `send` et `expect` peuvent contenir des littéraux hexadécimaux avec le préfixe « `\x` » suivi de deux chiffres hexadécimaux, par exemple « `\x80` » (1.9.12).

La vérification de santé réussit si :

- la connexion TCP a été établie ;
- la *chaîne* du paramètre `send`, si elle est indiquée, a été envoyée ;
- les données obtenues du serveur correspondent à la chaîne ou à l'expression régulière du paramètre `expect`, s'il est indiqué ;
- le temps écoulé ne dépasse pas la valeur de la directive [[12-directives/health-check-timeout|health_check_timeout]].

Exemple :

```nginx
upstream backend {
    zone     upstream_backend 10m;
    server   127.0.0.1:12345;
}

match http {
    send     "GET / HTTP/1.0\r\nHost: localhost\r\n\r\n";
    expect ~ "200 OK";
}

server {
    listen       12346;
    proxy_pass   backend;
    health_check match=http;
}
```

> [!NOTE]
> Seuls les [[12-directives/proxy-buffer-size-stream-proxy|proxy_buffer_size]] premiers octets des données obtenues du serveur sont examinés.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
