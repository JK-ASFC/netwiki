---
title: "ngx_stream_zone_sync_module"
description: "Module nginx ngx_stream_zone_sync_module — Le module ngx_stream_zone_sync_module (1.13.8) fournit le nécessaire pour synchroniser le contenu de zones de mémoire partagée entre les nœuds d'un cluster. Pour qu'une zone soit synchronisée, le module correspondant…"
tags: [nginx, module, ngx_stream_zone_sync_module]
icon: puzzle
---

Le module `ngx_stream_zone_sync_module` (1.13.8) fournit le nécessaire pour synchroniser le contenu de [[12-directives/zone-stream-upstream|zones de mémoire partagée]] entre les nœuds d'un cluster. Pour qu'une zone soit synchronisée, le module correspondant doit le prendre en charge. On peut actuellement synchroniser les sessions HTTP [[12-directives/sticky|sticky]], les informations sur les [[11-modules/02-http/ngx_http_limit_req_module|requêtes HTTP excessives]] et les paires clé-valeur en [[11-modules/02-http/ngx_http_keyval_module|http]] comme en [[11-modules/03-stream/ngx_stream_keyval_module|stream]].

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

Configuration minimale :

```nginx
http {
    ...

    upstream backend {
       server backend1.example.com:8080;
       server backend2.example.com:8081;

       sticky learn
              create=$upstream_cookie_examplecookie
              lookup=$cookie_examplecookie
              zone=client_sessions:1m sync;
    }

    ...
}

stream {
    ...


    server {
        zone_sync;

        listen 127.0.0.1:12345;

        # cluster of 2 nodes
        zone_sync_server a.example.com:12345;
        zone_sync_server b.example.com:12345;

    }
```

Une configuration plus complète, avec SSL activé et des membres du cluster définis par DNS :

```nginx
...

stream {
    ...

    resolver 127.0.0.1 valid=10s;

    server {
        zone_sync;

        # the name resolves to multiple addresses that correspond to cluster nodes
        zone_sync_server cluster.example.com:12345 resolve;

        listen 127.0.0.1:4433 ssl;

        ssl_certificate     localhost.crt;
        ssl_certificate_key localhost.key;

        zone_sync_ssl on;

        zone_sync_ssl_certificate     localhost.crt;
        zone_sync_ssl_certificate_key localhost.key;
    }
}
```

## Points d'accès de l'API

L'état de synchronisation d'un nœud est disponible via le point d'accès [[11-modules/02-http/ngx_http_api_module|/stream/zone_sync/]] de l'API, qui renvoie les métriques [[11-modules/02-http/ngx_http_api_module|suivantes]].

## Démarrer, arrêter, retirer un nœud du cluster

Pour démarrer un nouveau nœud, mettez à jour l'enregistrement DNS du nom d'hôte du cluster avec l'adresse IP du nouveau nœud et démarrez une instance. Le nouveau nœud découvre les autres via le DNS ou la configuration statique et commence à leur envoyer des mises à jour. Les autres nœuds finissent par découvrir le nouveau via le DNS et commencent à lui pousser des mises à jour. Avec une configuration statique, les autres nœuds doivent être rechargés pour envoyer des mises à jour au nouveau nœud.

Pour arrêter un nœud, envoyez le signal `QUIT` à l'instance. Le nœud termine la synchronisation des zones et ferme proprement les connexions ouvertes.

Pour retirer un nœud, mettez à jour l'enregistrement DNS du nom d'hôte du cluster en supprimant l'adresse IP du nœud. Tous les autres nœuds finissent par découvrir son retrait, ferment leurs connexions vers lui et cessent d'essayer de s'y connecter. Une fois retiré, le nœud peut être arrêté comme décrit plus haut. Avec une configuration statique, les autres nœuds doivent être rechargés pour cesser d'envoyer des mises à jour au nœud retiré.

## Directives

- [[12-directives/zone-sync|zone_sync]]
- [[12-directives/zone-sync-buffers|zone_sync_buffers]]
- [[12-directives/zone-sync-connect-retry-interval|zone_sync_connect_retry_interval]]
- [[12-directives/zone-sync-connect-timeout|zone_sync_connect_timeout]]
- [[12-directives/zone-sync-interval|zone_sync_interval]]
- [[12-directives/zone-sync-recv-buffer-size|zone_sync_recv_buffer_size]]
- [[12-directives/zone-sync-server|zone_sync_server]]
- [[12-directives/zone-sync-ssl|zone_sync_ssl]]
- [[12-directives/zone-sync-ssl-certificate|zone_sync_ssl_certificate]]
- [[12-directives/zone-sync-ssl-certificate-key|zone_sync_ssl_certificate_key]]
- [[12-directives/zone-sync-ssl-ciphers|zone_sync_ssl_ciphers]]
- [[12-directives/zone-sync-ssl-conf-command|zone_sync_ssl_conf_command]]
- [[12-directives/zone-sync-ssl-crl|zone_sync_ssl_crl]]
- [[12-directives/zone-sync-ssl-name|zone_sync_ssl_name]]
- [[12-directives/zone-sync-ssl-password-file|zone_sync_ssl_password_file]]
- [[12-directives/zone-sync-ssl-protocols|zone_sync_ssl_protocols]]
- [[12-directives/zone-sync-ssl-server-name|zone_sync_ssl_server_name]]
- [[12-directives/zone-sync-ssl-trusted-certificate|zone_sync_ssl_trusted_certificate]]
- [[12-directives/zone-sync-ssl-verify|zone_sync_ssl_verify]]
- [[12-directives/zone-sync-ssl-verify-depth|zone_sync_ssl_verify_depth]]
- [[12-directives/zone-sync-timeout|zone_sync_timeout]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
