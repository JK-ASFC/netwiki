---
title: "ngx_http_status_module"
description: "Module nginx ngx_http_status_module — Le module ngx_http_status_module donne accès à diverses informations d'état."
tags: [nginx, module, ngx_http_status_module]
icon: puzzle
---

Le module `ngx_http_status_module` donne accès à diverses informations d'état.

> [!NOTE]
> Ce module était disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/) jusqu'à la version 1.13.10. Il a été remplacé par le module [[11-modules/02-http/ngx_http_api_module|ngx_http_api_module]] en version 1.13.3.

## Exemple de configuration

```nginx
http {
    upstream backend {
        zone http_backend 64k;

        server backend1.example.com weight=5;
        server backend2.example.com;
    }

    proxy_cache_path /data/nginx/cache_backend keys_zone=cache_backend:10m;

    server {
        server_name backend.example.com;

        location / {
            proxy_pass  http://backend;
            proxy_cache cache_backend;

            health_check;
        }

        status_zone server_backend;
    }

    server {
        listen 127.0.0.1;

        location /upstream_conf {
            upstream_conf;
        }

        location /status {
            status;
        }

        location = /status.html {
        }
    }
}

stream {
    upstream backend {
        zone stream_backend 64k;

        server backend1.example.com:12345 weight=5;
        server backend2.example.com:12345;
    }

    server {
        listen      127.0.0.1:12345;
        proxy_pass  backend;
        status_zone server_backend;
        health_check;
    }
}
```

Exemples de requêtes d'état avec cette configuration :

```nginx
http://127.0.0.1/status
http://127.0.0.1/status/nginx_version
http://127.0.0.1/status/caches/cache_backend
http://127.0.0.1/status/upstreams
http://127.0.0.1/status/upstreams/backend
http://127.0.0.1/status/upstreams/backend/peers/1
http://127.0.0.1/status/upstreams/backend/peers/1/weight
http://127.0.0.1/status/stream
http://127.0.0.1/status/stream/upstreams
http://127.0.0.1/status/stream/upstreams/backend
http://127.0.0.1/status/stream/upstreams/backend/peers/1
http://127.0.0.1/status/stream/upstreams/backend/peers/1/weight
```

Une page de supervision simple est fournie avec la distribution, accessible à « `/status.html` » dans la configuration par défaut. Elle nécessite que les blocs location « `/status` » et « `/status.html` » soient configurés comme ci-dessus.

## Données

Les informations d'état suivantes sont fournies :

- **`version`**

  Version du jeu de données fourni. La version actuelle est 8.

- **`nginx_version`**

  Version de nginx.

- **`nginx_build`**

  Nom de compilation de nginx.

- **`address`**

  Adresse du serveur qui a accepté la requête d'état.

- **`generation`**

  Nombre total de [[10-guides/01-introduction/control|rechargements]] de la configuration.

- **`load_timestamp`**

  Heure du dernier rechargement de la configuration, en millisecondes depuis l'Epoch.

- **`timestamp`**

  Heure actuelle en millisecondes depuis l'Epoch.

- **`pid`**

  Identifiant du processus de travail qui a traité la requête d'état.

- **`ppid`**

  Identifiant du processus maître qui a lancé le processus de travail.

- **`processes`**

  - **`respawned`**

    Nombre total de processus enfants terminés anormalement et relancés.

- **`connections`**

  - **`accepted`**

    Nombre total de connexions clientes acceptées.

  - **`dropped`**

    Nombre total de connexions clientes abandonnées.

  - **`active`**

    Nombre actuel de connexions clientes actives.

  - **`idle`**

    Nombre actuel de connexions clientes inactives.

- **`ssl`**

  - **`handshakes`**

    Nombre total de négociations SSL réussies.

  - **`handshakes_failed`**

    Nombre total de négociations SSL échouées.

  - **`session_reuses`**

    Nombre total de réutilisations de session lors des négociations SSL.

- **`requests`**

  - **`total`**

    Nombre total de requêtes des clients.

  - **`current`**

    Nombre actuel de requêtes des clients.

- **`server_zones`**

  Pour chaque [[12-directives/status-zone-http-status|status_zone]] :

  - **`processing`**

    Nombre de requêtes des clients en cours de traitement.

  - **`requests`**

    Nombre total de requêtes reçues des clients.

  - **`responses`**

    - **`total`**

      Nombre total de réponses envoyées aux clients.

    - **`1xx`, `2xx`, `3xx`, `4xx`, `5xx`**

      Nombre de réponses de codes de statut 1xx, 2xx, 3xx, 4xx et 5xx.

  - **`discarded`**

    Nombre total de requêtes terminées sans envoi de réponse.

  - **`received`**

    Nombre total d'octets reçus des clients.

  - **`sent`**

    Nombre total d'octets envoyés aux clients.

- **`slabs`**

  Pour chaque zone de mémoire partagée utilisant l'allocateur slab :

  - **`pages`**

    - **`used`**

      Nombre actuel de pages mémoire utilisées.

    - **`free`**

      Nombre actuel de pages mémoire libres.

  - **`slots`**

    Pour chaque taille d'emplacement mémoire (8, 16, 32, 64, 128, etc.), les données suivantes sont fournies :

    - **`used`**

      Nombre actuel d'emplacements mémoire utilisés.

    - **`free`**

      Nombre actuel d'emplacements mémoire libres.

    - **`reqs`**

      Nombre total de tentatives d'allocation de mémoire de la taille indiquée.

    - **`fails`**

      Nombre de tentatives d'allocation de mémoire de la taille indiquée qui ont échoué.

- **`upstreams`**

  Pour chaque [[12-directives/upstream-http-upstream|groupe]] [[12-directives/zone-http-upstream|configurable dynamiquement]], les données suivantes sont fournies :

  - **`peers`**

    Pour chaque [[12-directives/server-http-upstream|serveur]], les données suivantes sont fournies :

    - **`id`**

      Identifiant du serveur.

    - **`server`**

      [[12-directives/server-http-upstream|Adresse]] du serveur.

    - **`name`**

      Nom du serveur indiqué dans la directive [[12-directives/server-http-upstream|server]].

    - **`service`**

      Valeur du paramètre [[11-modules/02-http/ngx_http_upstream_module|service]] de la directive [[12-directives/server-http-upstream|server]].

    - **`backup`**

      Booléen indiquant si le serveur est un serveur de [[11-modules/02-http/ngx_http_upstream_module|secours]].

    - **`weight`**

      [[11-modules/02-http/ngx_http_upstream_module|Poids]] du serveur.

    - **`state`**

      État actuel : « `up` », « `draining` », « `down` », « `unavail` », « `checking` » ou « `unhealthy` ».

    - **`active`**

      Nombre actuel de connexions actives.

    - **`max_conns`**

      Limite [[11-modules/02-http/ngx_http_upstream_module|max_conns]] du serveur.

    - **`requests`**

      Nombre total de requêtes des clients transmises à ce serveur.

    - **`responses`**

      - **`total`**

        Nombre total de réponses obtenues de ce serveur.

      - **`1xx`, `2xx`, `3xx`, `4xx`, `5xx`**

        Nombre de réponses de codes de statut 1xx, 2xx, 3xx, 4xx et 5xx.

    - **`sent`**

      Nombre total d'octets envoyés à ce serveur.

    - **`received`**

      Nombre total d'octets reçus de ce serveur.

    - **`fails`**

      Nombre total de tentatives de communication échouées avec le serveur.

    - **`unavail`**

      Nombre de fois où le serveur est devenu indisponible pour les requêtes des clients (état « `unavail` ») parce que le nombre de tentatives échouées a atteint le seuil [[11-modules/02-http/ngx_http_upstream_module|max_fails]].

    - **`health_checks`**

      - **`checks`**

        Nombre total de requêtes de [[12-directives/health-check-http-upstream-hc|vérification d'état]] effectuées.

      - **`fails`**

        Nombre de vérifications d'état échouées.

      - **`unhealthy`**

        Nombre de fois où le serveur est devenu défaillant (état « `unhealthy` »).

      - **`last_passed`**

        Booléen indiquant si la dernière vérification d'état a réussi et passé les [[12-directives/match-http-upstream-hc|tests]].

    - **`downtime`**

      Durée totale passée par le serveur dans les états « `unavail` », « `checking` » et « `unhealthy` ».

    - **`downstart`**

      Heure (en millisecondes depuis l'Epoch) à laquelle le serveur est passé à l'état « `unavail` », « `checking` » ou « `unhealthy` ».

    - **`selected`**

      Heure (en millisecondes depuis l'Epoch) à laquelle le serveur a été choisi pour la dernière fois pour traiter une requête (1.7.5).

    - **`header_time`**

      Durée moyenne d'obtention de l'[[13-variables/upstream-header-time|en-tête de réponse]] du serveur (1.7.10). Avant la version 1.11.6, ce champ n'était disponible qu'avec la méthode de répartition [[12-directives/least-time-http-upstream|least_time]].

    - **`response_time`**

      Durée moyenne d'obtention de la [[13-variables/upstream-response-time|réponse complète]] du serveur (1.7.10). Avant la version 1.11.6, ce champ n'était disponible qu'avec la méthode de répartition [[12-directives/least-time-http-upstream|least_time]].

  - **`keepalive`**

    Nombre actuel de connexions [[12-directives/keepalive|persistantes]] inactives.

  - **`zombies`**

    Nombre actuel de serveurs retirés du groupe mais qui traitent encore des requêtes actives.

  - **`zone`**

    Nom de la [[12-directives/zone-http-upstream|zone]] de mémoire partagée qui conserve la configuration et l'état d'exécution du groupe.

  - **`queue`**

    Pour la [[12-directives/queue|file d'attente]] des requêtes, les données suivantes sont fournies :

    - **`size`**

      Nombre actuel de requêtes dans la file.

    - **`max_size`**

      Nombre maximal de requêtes pouvant se trouver simultanément dans la file.

    - **`overflows`**

      Nombre total de requêtes rejetées pour cause de file pleine.

- **`caches`**

  Pour chaque cache (configuré par [[12-directives/proxy-cache-path|proxy_cache_path]] et équivalents) :

  - **`size`**

    Taille actuelle du cache.

  - **`max_size`**

    Limite de taille maximale du cache indiquée dans la configuration.

  - **`cold`**

    Booléen indiquant si le processus « chargeur de cache » charge encore des données du disque vers le cache.

  - **`hit`, `stale`, `updating`, `revalidated`**

    - **`responses`**

      Nombre total de réponses lues dans le cache (succès, ou réponses périmées dues à [[12-directives/proxy-cache-use-stale|proxy_cache_use_stale]] et équivalents).

    - **`bytes`**

      Nombre total d'octets lus dans le cache.

  - **`miss`, `expired`, `bypass`**

    - **`responses`**

      Nombre total de réponses non prises dans le cache (absences, expirations ou contournements dus à [[12-directives/proxy-cache-bypass|proxy_cache_bypass]] et équivalents).

    - **`bytes`**

      Nombre total d'octets lus depuis le serveur mandaté.

    - **`responses_written`**

      Nombre total de réponses écrites dans le cache.

    - **`bytes_written`**

      Nombre total d'octets écrits dans le cache.

- **`stream`**

  - **`server_zones`**

    Pour chaque [[12-directives/status-zone-http-status|status_zone]] :

    - **`processing`**

      Nombre de connexions clientes en cours de traitement.

    - **`connections`**

      Nombre total de connexions acceptées des clients.

    - **`sessions`**

      - **`total`**

        Nombre total de sessions clientes terminées.

      - **`2xx`, `4xx`, `5xx`**

        Nombre de sessions terminées avec les [[13-variables/status-stream-core|codes de statut]] 2xx, 4xx ou 5xx.

    - **`discarded`**

      Nombre total de connexions terminées sans création de session.

    - **`received`**

      Nombre total d'octets reçus des clients.

    - **`sent`**

      Nombre total d'octets envoyés aux clients.

  - **`upstreams`**

    Pour chaque [[12-directives/upstream-stream-upstream|groupe]] [[12-directives/zone-stream-upstream|configurable dynamiquement]], les données suivantes sont fournies :

    - **`peers`**

      Pour chaque [[12-directives/server-stream-upstream|serveur]], les données suivantes sont fournies :

      - **`id`**

        Identifiant du serveur.

      - **`server`**

        [[12-directives/server-stream-upstream|Adresse]] du serveur.

      - **`name`**

        Nom du serveur indiqué dans la directive [[12-directives/server-stream-upstream|server]].

      - **`service`**

        Valeur du paramètre [[11-modules/03-stream/ngx_stream_upstream_module|service]] de la directive [[12-directives/server-stream-upstream|server]].

      - **`backup`**

        Booléen indiquant si le serveur est un serveur de [[11-modules/03-stream/ngx_stream_upstream_module|secours]].

      - **`weight`**

        [[11-modules/03-stream/ngx_stream_upstream_module|Poids]] du serveur.

      - **`state`**

        État actuel : « `up` », « `down` », « `unavail` », « `checking` » ou « `unhealthy` ».

      - **`active`**

        Nombre actuel de connexions.

      - **`max_conns`**

        Limite [[11-modules/03-stream/ngx_stream_upstream_module|max_conns]] du serveur.

      - **`connections`**

        Nombre total de connexions clientes transmises à ce serveur.

      - **`connect_time`**

        Durée moyenne de connexion au serveur amont. Avant la version 1.11.6, ce champ n'était disponible qu'avec la méthode de répartition [[12-directives/least-time-stream-upstream|least_time]].

      - **`first_byte_time`**

        Durée moyenne de réception du premier octet de données. Avant la version 1.11.6, ce champ n'était disponible qu'avec la méthode de répartition [[12-directives/least-time-stream-upstream|least_time]].

      - **`response_time`**

        Durée moyenne de réception du dernier octet de données. Avant la version 1.11.6, ce champ n'était disponible qu'avec la méthode de répartition [[12-directives/least-time-stream-upstream|least_time]].

      - **`sent`**

        Nombre total d'octets envoyés à ce serveur.

      - **`received`**

        Nombre total d'octets reçus de ce serveur.

      - **`fails`**

        Nombre total de tentatives de communication échouées avec le serveur.

      - **`unavail`**

        Nombre de fois où le serveur est devenu indisponible pour les connexions des clients (état « `unavail` ») parce que le nombre de tentatives échouées a atteint le seuil [[11-modules/03-stream/ngx_stream_upstream_module|max_fails]].

      - **`health_checks`**

        - **`checks`**

          Nombre total de requêtes de [[12-directives/health-check-stream-upstream-hc|vérification d'état]] effectuées.

        - **`fails`**

          Nombre de vérifications d'état échouées.

        - **`unhealthy`**

          Nombre de fois où le serveur est devenu défaillant (état « `unhealthy` »).

        - **`last_passed`**

          Booléen indiquant si la dernière vérification d'état a réussi et passé les [[12-directives/match-stream-upstream-hc|tests]].

      - **`downtime`**

        Durée totale passée par le serveur dans les états « `unavail` », « `checking` » et « `unhealthy` ».

      - **`downstart`**

        Heure (en millisecondes depuis l'Epoch) à laquelle le serveur est passé à l'état « `unavail` », « `checking` » ou « `unhealthy` ».

      - **`selected`**

        Heure (en millisecondes depuis l'Epoch) à laquelle le serveur a été choisi pour la dernière fois pour traiter une connexion.

    - **`zombies`**

      Nombre actuel de serveurs retirés du groupe mais qui traitent encore des connexions actives.

    - **`zone`**

      Nom de la [[12-directives/zone-stream-upstream|zone]] de mémoire partagée qui conserve la configuration et l'état d'exécution du groupe.

## Compatibilité

- Le champ `zone` des groupes amont http et stream a été ajouté en `version` 8.
- Les données d'état `slabs` ont été ajoutées en `version` 8.
- L'état checking a été ajouté en `version` 8.
- Les champs `name` et `service` des groupes amont http et stream ont été ajoutés en `version` 8.
- Les champs `nginx_build` et `ppid` ont été ajoutés en `version` 8.
- Les données d'état `sessions` et le champ discarded des server\_zones stream ont été ajoutés en `version` 7.
- Le champ `zombies` a été déplacé de la version de [[10-guides/01-introduction/debugging-log|débogage]] de nginx en `version` 6.
- Les données d'état `ssl` ont été ajoutées en `version` 6.
- Le champ `discarded` des `server_zones` a été ajouté en `version` 6.
- Les données d'état `queue` ont été ajoutées en `version` 6.
- Le champ `pid` a été ajouté en `version` 6.
- La liste des serveurs des `upstreams` a été déplacée dans `peers` en `version` 6.
- Le champ `keepalive` d'un serveur amont a été supprimé en `version` 5.
- Les données d'état stream ont été ajoutées en `version` 5.
- Le champ `generation` a été ajouté en `version` 5.
- Le champ `respawned` de `processes` a été ajouté en `version` 5.
- Les champs `header_time` et `response_time` des `upstreams` ont été ajoutés en `version` 5.
- Le champ `selected` des `upstreams` a été ajouté en `version` 4.
- L'état draining des `upstreams` a été ajouté en `version` 4.
- Les champs `id` et `max_conns` des `upstreams` ont été ajoutés en `version` 3.
- Le champ `revalidated` des `caches` a été ajouté en `version` 3.
- Les données d'état `server_zones`, `caches` et `load_timestamp` ont été ajoutées en `version` 2.

## Directives

- [[12-directives/status|status]]
- [[12-directives/status-format|status_format]]
- [[12-directives/status-zone-http-status|status_zone]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
