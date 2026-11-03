---
title: "ngx_stream_upstream_hc_module"
description: "Module nginx ngx_stream_upstream_hc_module — Le module ngx_stream_upstream_hc_module (1.9.0) permet d'activer des vérifications de santé périodiques des serveurs d'un groupe. Le groupe de serveurs doit résider en mémoire partagée."
tags: [nginx, module, ngx_stream_upstream_hc_module]
icon: puzzle
---

Le module `ngx_stream_upstream_hc_module` (1.9.0) permet d'activer des vérifications de santé périodiques des serveurs d'un [[12-directives/upstream-stream-upstream|groupe]]. Le groupe de serveurs doit résider en [[12-directives/zone-stream-upstream|mémoire partagée]].

Si une vérification de santé échoue, le serveur est considéré comme défaillant. Si plusieurs vérifications sont définies pour le même groupe, un seul échec de l'une d'elles suffit à rendre le serveur défaillant. Les connexions client ne sont passées ni aux serveurs défaillants ni aux serveurs à l'état « checking ».

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
upstream tcp {
    zone upstream_tcp 64k;

    server backend1.example.com:12345 weight=5;
    server backend2.example.com:12345 fail_timeout=5s slow_start=30s;
    server 192.0.2.1:12345            max_fails=3;

    server backup1.example.com:12345  backup;
    server backup2.example.com:12345  backup;
}

server {
    listen     12346;
    proxy_pass tcp;
    health_check;
}
```

Avec cette configuration, nginx vérifie toutes les cinq secondes qu'une connexion TCP peut être établie avec chaque serveur du groupe `tcp`. Si la connexion échoue, la vérification échoue et le serveur est considéré comme défaillant.

Les vérifications de santé peuvent être configurées pour le protocole UDP :

```nginx
upstream dns_upstream {

    zone   dns_zone 64k;

    server dns1.example.com:53;
    server dns2.example.com:53;
    server dns3.example.com:53;
}

server {
    listen       53 udp;
    proxy_pass   dns_upstream;
    health_check udp;
}
```

Dans ce cas, on attend l'absence de message ICMP « `Destination Unreachable` » en réponse à la chaîne envoyée « `nginx health check` ».

Les vérifications peuvent aussi tester les données obtenues du serveur. Les tests se configurent séparément avec la directive [[12-directives/match-stream-upstream-hc|match]] et sont référencés dans le paramètre `match` de la directive [[12-directives/health-check-stream-upstream-hc|health_check]].

## Directives

- [[12-directives/health-check-stream-upstream-hc|health_check]]
- [[12-directives/health-check-timeout|health_check_timeout]]
- [[12-directives/match-stream-upstream-hc|match]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
