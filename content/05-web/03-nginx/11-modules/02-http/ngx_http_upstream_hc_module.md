---
title: "ngx_http_upstream_hc_module"
description: "Module nginx ngx_http_upstream_hc_module — Le module ngx_http_upstream_hc_module permet d'activer des vérifications d'état périodiques des serveurs d'un groupe utilisé dans le bloc location englobant. Le groupe de serveurs doit être en mémoire partagée."
tags: [nginx, module, ngx_http_upstream_hc_module]
icon: puzzle
---

Le module `ngx_http_upstream_hc_module` permet d'activer des vérifications d'état périodiques des serveurs d'un [[12-directives/upstream-http-upstream|groupe]] utilisé dans le bloc location englobant. Le groupe de serveurs doit être en [[12-directives/zone-http-upstream|mémoire partagée]].

Si une vérification d'état échoue, le serveur est considéré comme défaillant. Si plusieurs vérifications sont définies pour un même groupe, un seul échec de l'une d'elles suffit. Les requêtes des clients ne sont pas transmises aux serveurs défaillants ni aux serveurs dans l'état « checking ».

> [!NOTE]
> La plupart des variables ont une valeur vide lorsqu'elles sont utilisées avec les vérifications d'état.

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
upstream dynamic {
    zone upstream_dynamic 64k;

    server backend1.example.com      weight=5;
    server backend2.example.com:8080 fail_timeout=5s slow_start=30s;
    server 192.0.2.1                 max_fails=3;

    server backup1.example.com:8080  backup;
    server backup2.example.com:8080  backup;
}

server {
    location / {
        proxy_pass http://dynamic;
        health_check;
    }
}
```

Avec cette configuration, nginx envoie des requêtes « `/` » à chaque serveur du groupe `backend` toutes les cinq secondes. En cas d'erreur de communication ou de dépassement de délai, ou si le serveur mandaté répond avec un code autre que 2xx ou 3xx, la vérification échoue et le serveur est considéré comme défaillant.

Les vérifications d'état peuvent tester le code de statut de la réponse, la présence de certains champs d'en-tête et leurs valeurs, ainsi que le contenu du corps. Les tests se configurent séparément avec la directive [[12-directives/match-http-upstream-hc|match]] et sont désignés par le paramètre `match` de la directive [[12-directives/health-check-http-upstream-hc|health_check]] :

```nginx
http {
    server {
    ...
        location / {
            proxy_pass http://backend;
            health_check match=welcome;
        }
    }

    match welcome {
        status 200;
        header Content-Type = text/html;
        body ~ "Welcome to nginx!";
    }
}
```

Cette configuration indique que, pour qu'une vérification réussisse, la réponse doit aboutir, avoir le statut 200 et contenir « `Welcome to nginx!` » dans son corps.

## Directives

- [[12-directives/health-check-http-upstream-hc|health_check]]
- [[12-directives/match-http-upstream-hc|match]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
