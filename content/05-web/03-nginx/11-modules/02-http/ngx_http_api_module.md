---
title: "ngx_http_api_module"
description: "Module nginx ngx_http_api_module — Le module ngx_http_api_module (1.13.3) fournit une API REST pour consulter diverses informations d'état, configurer à la volée des groupes de serveurs amont et gérer des paires clé-valeur sans reconfigurer nginx."
tags: [nginx, module, ngx_http_api_module]
icon: puzzle
---

Le module `ngx_http_api_module` (1.13.3) fournit une API REST pour consulter diverses informations d'état, configurer à la volée des groupes de serveurs amont et gérer des [[11-modules/02-http/ngx_http_keyval_module|paires clé-valeur]] sans reconfigurer nginx.

> [!NOTE]
> Ce module remplace les modules [[11-modules/02-http/ngx_http_status_module|ngx_http_status_module]] et [[11-modules/02-http/ngx_http_upstream_conf_module|ngx_http_upstream_conf_module]].

Avec les méthodes `PATCH` ou `POST`, veillez à ce que les données envoyées ne dépassent pas la [[12-directives/client-body-buffer-size|taille du tampon]] de lecture du corps de la requête client, sinon l'erreur `413 Request Entity Too Large` peut être renvoyée.

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

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

    keyval_zone zone=one:32k state=one.keyval;
    keyval $arg_text $text zone=one;

    server {
        listen 127.0.0.1;

        location /api {
            api write=on;
            allow 127.0.0.1;
            deny all;
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

Toutes les requêtes à l'API incluent une version d'API prise en charge dans l'URI. Exemples de requêtes avec cette configuration :

```nginx
http://127.0.0.1/api/10/
http://127.0.0.1/api/10/nginx
http://127.0.0.1/api/10/connections
http://127.0.0.1/api/10/workers
http://127.0.0.1/api/10/http/requests
http://127.0.0.1/api/10/http/server_zones/server_backend
http://127.0.0.1/api/10/http/caches/cache_backend
http://127.0.0.1/api/10/http/upstreams/backend
http://127.0.0.1/api/10/http/upstreams/backend/servers/
http://127.0.0.1/api/10/http/upstreams/backend/servers/1
http://127.0.0.1/api/10/http/keyvals/one?key=arg1
http://127.0.0.1/api/10/stream/
http://127.0.0.1/api/10/stream/server_zones/server_backend
http://127.0.0.1/api/10/stream/upstreams/
http://127.0.0.1/api/10/stream/upstreams/backend
http://127.0.0.1/api/10/stream/upstreams/backend/servers/1
```

## Compatibilité

- [[12-directives/license-pending-token|Renouvellement automatique différé]] des jetons de licence JWT : la méthode « `PUT` » pour ajouter un jeton de licence JWT et le champ « `pending_renewal` » ont été ajoutés aux données /license en version 10.
- Les données « `response_time_hist` » de chaque groupe amont HTTP ont été ajoutées en version 9 (1.29.8).
- Le champ « `uuid` » a été ajouté aux données /license en version 9 (1.29.0).
- Les données /license ont été ajoutées en version 9 (1.27.2).
- Les données /workers/ ont été ajoutées en version 9.
- Des compteurs d'échecs détaillés ont été ajoutés aux statistiques SSL en version 8 (1.23.2).
- Les données `ssl` de chaque groupe amont et zone de serveur HTTP, et de chaque groupe amont et zone de serveur stream, ont été ajoutées en version 8 (1.21.6).
- Les données `codes` de `responses` pour chaque groupe amont, zone de serveur et zone de location HTTP ont été ajoutées en version 7.
- Les données /stream/limit\_conns/ ont été ajoutées en version 6.
- Les données /http/limit\_conns/ ont été ajoutées en version 6.
- Les données /http/limit\_reqs/ ont été ajoutées en version 6.
- Le paramètre « `expire` » d'une paire [[11-modules/02-http/ngx_http_keyval_module|clé-valeur]] peut être défini ou modifié depuis la version 5.
- Les données /resolvers/ ont été ajoutées en version 5.
- Les données /http/location\_zones/ ont été ajoutées en version 5.
- Les champs `path` et `method` de l'objet erreur nginx ont été supprimés en version 4. Ils existent toujours dans les versions antérieures de l'API, mais avec une valeur vide.
- Les données /stream/zone\_sync/ ont été ajoutées en version 3.
- Le paramètre drain a été ajouté en version 2.
- Les données /stream/keyvals/ ont été ajoutées en version 2.

## Points d'accès

- **`/`**

  Méthodes prises en charge :

  - `GET` - Renvoie la liste des points d'accès racine

    Renvoie la liste des points d'accès racine.

    Réponses possibles :

    - 200 - Succès, renvoie un tableau de chaînes
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/nginx`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de l'instance nginx en cours d'exécution

    Renvoie la version de nginx, le nom de build, l'adresse, le nombre de rechargements de configuration, les identifiants des processus maître et de travail.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de l'instance nginx en cours d'exécution qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie nginx
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/processes`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état des processus nginx

    Renvoie le nombre de processus fils terminés anormalement et relancés.

    Réponses possibles :

    - 200 - Succès, renvoie Processes
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques des processus nginx

    Réinitialise les compteurs de processus fils terminés anormalement et relancés.

    Réponses possibles :

    - 204 - Succès
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/connections`**

  Méthodes prises en charge :

  - `GET` - Renvoie les statistiques des connexions client

    Renvoie les statistiques des connexions client.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des statistiques de connexions qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie Connections
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques des connexions client

    Réinitialise les statistiques des connexions client acceptées et rejetées.

    Réponses possibles :

    - 204 - Succès
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/slabs/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de tous les slabs

    Renvoie l'état des slabs de chaque zone de mémoire partagée utilisant l'allocateur slab.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des zones slab qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des zones sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « Shared memory zone with slab allocator » pour tous les slabs
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/slabs/{slabZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`slabZoneName` (`string`, obligatoire)**

    Nom de la zone de mémoire partagée utilisant l'allocateur slab.

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'un slab

    Renvoie l'état des slabs d'une zone de mémoire partagée donnée utilisant l'allocateur slab.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la zone slab qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie Shared memory zone with slab allocator
    - 404 - Slab introuvable (`SlabNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'un slab

    Réinitialise les métriques « `reqs` » et « `fails` » de chaque emplacement mémoire.

    Réponses possibles :

    - 204 - Succès
    - 404 - Slab introuvable (`SlabNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/`**

  Méthodes prises en charge :

  - `GET` - Renvoie la liste des points d'accès HTTP

    Renvoie la liste des points d'accès HTTP de premier niveau.

    Réponses possibles :

    - 200 - Succès, renvoie un tableau de chaînes
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/http/requests`**

  Méthodes prises en charge :

  - `GET` - Renvoie les statistiques des requêtes HTTP

    Renvoie l'état des requêtes HTTP client.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des statistiques des requêtes HTTP client qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Requests
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques des requêtes HTTP

    Réinitialise le nombre total de requêtes HTTP client.

    Réponses possibles :

    - 204 - Succès
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/server_zones/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de toutes les zones de serveur HTTP

    Renvoie les informations d'état de chaque [zone de serveur](https://nginx.org/en/docs/http/ngx_http_api_module.html#status_zone) HTTP.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des zones de serveur qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des zones de serveur sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « HTTP Server Zone » pour toutes les zones de serveur HTTP
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/http/server_zones/{httpServerZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`httpServerZoneName` (`string`, obligatoire)**

    Nom d'une zone de serveur HTTP.

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'une zone de serveur HTTP

    Renvoie l'état d'une zone de serveur HTTP donnée.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la zone de serveur qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Server Zone
    - 404 - Zone de serveur introuvable (`ServerZoneNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'une zone de serveur HTTP

    Réinitialise, pour une zone de serveur HTTP donnée, les statistiques des requêtes acceptées et rejetées, des réponses, des octets reçus et envoyés, ainsi que les compteurs de poignées de main SSL et de réutilisations de session.

    Réponses possibles :

    - 204 - Succès
    - 404 - Zone de serveur introuvable (`ServerZoneNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/location_zones/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de toutes les zones de location HTTP

    Renvoie les informations d'état de chaque [zone de location](https://nginx.org/en/docs/http/ngx_http_api_module.html#status_zone_location) HTTP.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des zones de location qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des zones sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « HTTP Location Zone » pour toutes les zones de location HTTP
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/http/location_zones/{httpLocationZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`httpLocationZoneName` (`string`, obligatoire)**

    Nom d'une [zone de location](https://nginx.org/en/docs/http/ngx_http_api_module.html#status_zone_location) HTTP.

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'une zone de location HTTP

    Renvoie l'état d'une [zone de location](https://nginx.org/en/docs/http/ngx_http_api_module.html#status_zone_location) HTTP donnée.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la zone de location qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Location Zone
    - 404 - Zone de location introuvable (`LocationZoneNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'une zone de location.

    Réinitialise, pour une zone de location donnée, les statistiques des requêtes acceptées et rejetées, des réponses, des octets reçus et envoyés.

    Réponses possibles :

    - 204 - Succès
    - 404 - Zone de location introuvable (`LocationZoneNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/caches/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de tous les caches

    Renvoie l'état de chaque cache configuré par [proxy\_cache\_path](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_path) et les autres directives « `*_cache_path` ».

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des zones de cache qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des zones de cache sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « HTTP Cache » pour tous les caches HTTP
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/http/caches/{httpCacheZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`httpCacheZoneName` (`string`, obligatoire)**

    Nom de la zone de cache.

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'un cache

    Renvoie l'état d'un cache donné.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la zone de cache qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Cache
    - 404 - Cache introuvable (`CacheNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques du cache

    Réinitialise les statistiques de succès/échecs du cache dans une zone de cache donnée.

    Réponses possibles :

    - 204 - Succès
    - 404 - Cache introuvable (`CacheNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/limit_conns/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de toutes les zones limit\_conn HTTP

    Renvoie les informations d'état de chaque [zone limit\_conn](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html#limit_conn_zone) HTTP.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des zones limit\_conn qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des zones sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « HTTP Connections Limiting » pour toutes les limitations de connexions HTTP
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/http/limit_conns/{httpLimitConnZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`httpLimitConnZoneName` (`string`, obligatoire)**

    Nom d'une [zone limit\_conn](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html#limit_conn_zone).

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'une zone limit\_conn HTTP

    Renvoie l'état d'une [zone limit\_conn](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html#limit_conn_zone) HTTP donnée.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la [zone limit\_conn](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html#limit_conn_zone) qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Connections Limiting
    - 404 - limit\_conn introuvable (`LimitConnNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'une zone limit\_conn HTTP

    Réinitialise les statistiques de limitation des connexions.

    Réponses possibles :

    - 204 - Succès
    - 404 - limit\_conn introuvable (`LimitConnNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/limit_reqs/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de toutes les zones limit\_req HTTP

    Renvoie les informations d'état de chaque [zone limit\_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_zone) HTTP.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des zones limit\_req qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des zones sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « HTTP Requests Rate Limiting » pour toutes les limitations de requêtes HTTP
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/http/limit_reqs/{httpLimitReqZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`httpLimitReqZoneName` (`string`, obligatoire)**

    Nom d'une [zone limit\_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_zone).

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'une zone limit\_req HTTP

    Renvoie l'état d'une [zone limit\_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_zone) HTTP donnée.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la [zone limit\_req](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_zone) qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Requests Rate Limiting
    - 404 - limit\_req introuvable (`LimitReqNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'une zone limit\_req HTTP

    Réinitialise les statistiques de limitation des requêtes.

    Réponses possibles :

    - 204 - Succès
    - 404 - limit\_req introuvable (`LimitReqNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/upstreams/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de tous les groupes de serveurs amont HTTP

    Renvoie l'état de chaque groupe de serveurs amont HTTP et de ses serveurs.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des groupes de serveurs amont qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des groupes amont sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « HTTP Upstream » pour tous les groupes amont HTTP
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/http/upstreams/{httpUpstreamName}/`**

  Paramètres communs à toutes les méthodes :

  - **`httpUpstreamName` (`string`, obligatoire)**

    Nom d'un groupe de serveurs amont HTTP.

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'un groupe de serveurs amont HTTP

    Renvoie l'état d'un groupe de serveurs amont HTTP donné et de ses serveurs.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs du groupe de serveurs amont qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Upstream
    - 400 - Le groupe amont est statique (`UpstreamStatic`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'un groupe de serveurs amont HTTP

    Réinitialise les statistiques de chaque serveur amont d'un groupe ainsi que les statistiques de file d'attente.

    Réponses possibles :

    - 204 - Succès
    - 400 - Le groupe amont est statique (`UpstreamStatic`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/upstreams/{httpUpstreamName}/servers/`**

  Paramètres communs à toutes les méthodes :

  - **`httpUpstreamName` (`string`, obligatoire)**

    Nom d'un groupe de serveurs amont.

  Méthodes prises en charge :

  - `GET` - Renvoie la configuration de tous les serveurs d'un groupe amont HTTP

    Renvoie la configuration de chaque serveur d'un groupe de serveurs amont HTTP donné.

    Réponses possibles :

    - 200 - Succès, renvoie un tableau de HTTP Upstream Servers
    - 400 - Le groupe amont est statique (`UpstreamStatic`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
  - `POST` - Ajoute un serveur à un groupe de serveurs amont HTTP

    Ajoute un nouveau serveur à un groupe de serveurs amont HTTP. Les paramètres du serveur sont indiqués au format JSON.

    Paramètres de la requête :

    - **`postHttpUpstreamServer` (HTTP Upstream Server, obligatoire)**

      Adresse du nouveau serveur et autres paramètres facultatifs au format JSON. Les paramètres « `ID` », « `backup` » et « `service` » ne peuvent pas être modifiés.

    Réponses possibles :

    - 201 - Créé, renvoie HTTP Upstream Server
    - 400 - Le groupe amont est statique (`UpstreamStatic`), valeur « *paramètre* » invalide (`UpstreamConfFormatError`), argument « `server` » manquant (`UpstreamConfFormatError`), paramètre inconnu « *nom* » (`UpstreamConfFormatError`), objet ou liste imbriqués (`UpstreamConfFormatError`), « `error` » lors de l'analyse (`UpstreamBadAddress`), le groupe amont de service « `host` » ne doit pas avoir de port (`UpstreamBadAddress`), le groupe amont de service « `host` » exige un nom de domaine (`UpstreamBadAddress`), « `weight` » invalide (`UpstreamBadWeight`), « `max_conns` » invalide (`UpstreamBadMaxConns`), « `max_fails` » invalide (`UpstreamBadMaxFails`), « `fail_timeout` » invalide (`UpstreamBadFailTimeout`), « `slow_start` » invalide (`UpstreamBadSlowStart`), échec de lecture du corps de la requête `BodyReadError`), route trop longue (`UpstreamBadRoute`), « `service` » vide (`UpstreamBadService`), aucun résolveur défini (`UpstreamConfNoResolver`), le groupe amont « *nom* » n'a pas de serveur de secours (`UpstreamNoBackup`), mémoire épuisée pour le groupe amont « *nom* » (`UpstreamOutOfMemory`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error
    - 409 - L'entrée existe (`EntryExists`), renvoie Error
    - 415 - Erreur JSON (`JsonError`), renvoie Error

- **`/http/upstreams/{httpUpstreamName}/servers/{httpUpstreamServerId}`**

  Paramètres communs à toutes les méthodes :

  - **`httpUpstreamName` (`string`, obligatoire)**

    Nom du groupe de serveurs amont.

  - **`httpUpstreamServerId` (`string`, obligatoire)**

    Identifiant du serveur.

  Méthodes prises en charge :

  - `GET` - Renvoie la configuration d'un serveur d'un groupe amont HTTP

    Renvoie la configuration d'un serveur donné du groupe de serveurs amont HTTP.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Upstream Server
    - 400 - Le groupe amont est statique (`UpstreamStatic`), identifiant de serveur invalide (`UpstreamBadServerId`), renvoie Error
    - 404 - Le serveur d'identifiant « *id* » n'existe pas (`UpstreamServerNotFound`), version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
  - `PATCH` - Modifie un serveur d'un groupe de serveurs amont HTTP

    Modifie les paramètres d'un serveur donné d'un groupe de serveurs amont HTTP. Les paramètres sont indiqués au format JSON.

    Paramètres de la requête :

    - **`patchHttpUpstreamServer` (HTTP Upstream Server, obligatoire)**

      Paramètres du serveur, au format JSON. Les paramètres « `ID` », « `backup` » et « `service` » ne peuvent pas être modifiés.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Upstream Server
    - 400 - Le groupe amont est statique (`UpstreamStatic`), valeur « *paramètre* » invalide (`UpstreamConfFormatError`), paramètre inconnu « *nom* » (`UpstreamConfFormatError`), objet ou liste imbriqués (`UpstreamConfFormatError`), « `error` » lors de l'analyse (`UpstreamBadAddress`), argument « `server` » invalide (`UpstreamBadAddress`), identifiant de serveur invalide (`UpstreamBadServerId`), « `weight` » invalide (`UpstreamBadWeight`), « `max_conns` » invalide (`UpstreamBadMaxConns`), « `max_fails` » invalide (`UpstreamBadMaxFails`), « `fail_timeout` » invalide (`UpstreamBadFailTimeout`), « `slow_start` » invalide (`UpstreamBadSlowStart`), échec de lecture du corps de la requête `BodyReadError`), route trop longue (`UpstreamBadRoute`), « `service` » vide (`UpstreamBadService`), l'adresse du serveur « *ID* » est immuable (`UpstreamServerImmutable`), le poids du serveur « `ID` » est immuable (`UpstreamServerWeightImmutable`), mémoire épuisée pour le groupe amont « `name` » (`UpstreamOutOfMemory`), renvoie Error
    - 404 - Le serveur d'identifiant « *id* » n'existe pas (`UpstreamServerNotFound`), version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error
    - 415 - Erreur JSON (`JsonError`), renvoie Error
  - `DELETE` - Retire un serveur d'un groupe de serveurs amont HTTP

    Retire un serveur d'un groupe de serveurs amont HTTP.

    Réponses possibles :

    - 200 - Succès, renvoie un tableau de HTTP Upstream Servers
    - 400 - Le groupe amont est statique (`UpstreamStatic`), identifiant de serveur invalide (`UpstreamBadServerId`), le serveur « *id* » ne peut pas être retiré (`UpstreamServerImmutable`), renvoie Error
    - 404 - Le serveur d'identifiant « *id* » n'existe pas (`UpstreamServerNotFound`), version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/http/keyvals/`**

  Méthodes prises en charge :

  - `GET` - Renvoie les paires clé-valeur de toutes les zones keyval HTTP

    Renvoie les paires clé-valeur de chaque [zone](https://nginx.org/en/docs/http/ngx_http_keyval_module.html#keyval_zone) de mémoire partagée keyval HTTP.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Si la valeur de « `fields` » est vide, seuls les noms des zones keyval HTTP sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « HTTP Keyval Shared Memory Zone » pour toutes les zones keyval HTTP
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/http/keyvals/{httpKeyvalZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`httpKeyvalZoneName` (`string`, obligatoire)**

    Nom d'une zone de mémoire partagée keyval HTTP.

  Méthodes prises en charge :

  - `GET` - Renvoie les paires clé-valeur d'une zone keyval HTTP

    Renvoie les paires clé-valeur stockées dans une [zone](https://nginx.org/en/docs/http/ngx_http_keyval_module.html#keyval_zone) de mémoire partagée keyval HTTP donnée.

    Paramètres de la requête :

    - **`key` (`string`, facultatif)**

      Récupère une paire clé-valeur donnée de la zone keyval HTTP.

    Réponses possibles :

    - 200 - Succès, renvoie HTTP Keyval Shared Memory Zone
    - 404 - Keyval introuvable (`KeyvalNotFound`), clé keyval introuvable (`KeyvalKeyNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `POST` - Ajoute une paire clé-valeur à la zone keyval HTTP

    Ajoute une nouvelle paire clé-valeur à la [zone](https://nginx.org/en/docs/http/ngx_http_keyval_module.html#keyval_zone) de mémoire partagée keyval HTTP. Plusieurs paires peuvent être saisies si la zone est vide.

    Paramètres de la requête :

    - **`Key-value` (HTTP Keyval Shared Memory Zone, obligatoire)**

      Une paire clé-valeur s'indique au format JSON. Plusieurs paires peuvent être saisies si la zone de mémoire partagée keyval HTTP est vide. Une durée d'expiration en millisecondes peut être indiquée pour une paire avec le paramètre `expire`, qui remplace le paramètre [`timeout`](https://nginx.org/en/docs/http/ngx_http_keyval_module.html#keyval_timeout) de la directive [keyval\_zone](https://nginx.org/en/docs/http/ngx_http_keyval_module.html#keyval_zone).

    Réponses possibles :

    - 201 - Créé
    - 400 - JSON invalide (`KeyvalFormatError`), format de clé invalide (`KeyvalFormatError`), clé requise (`KeyvalFormatError`), le délai keyval n'est pas activé (`KeyvalFormatError`), une seule clé peut être ajoutée (`KeyvalFormatError`), échec de lecture du corps de la requête `BodyReadError`), renvoie Error
    - 404 - Keyval introuvable (`KeyvalNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error
    - 409 - L'entrée existe (`EntryExists`), la clé existe déjà (`KeyvalKeyExists`), renvoie Error
    - 413 - Request Entity Too Large, renvoie Error
    - 415 - Erreur JSON (`JsonError`), renvoie Error
  - `PATCH` - Modifie une valeur ou supprime une clé

    Modifie la valeur de la clé choisie dans la paire clé-valeur, supprime une clé en mettant sa valeur à `null`, modifie la durée d'expiration d'une paire. Si la [synchronisation](https://nginx.org/en/docs/stream/ngx_stream_zone_sync_module.html#zone_sync) des zones keyval dans un cluster est activée, la clé n'est supprimée que sur le nœud cible. Une durée d'expiration en millisecondes peut être indiquée avec le paramètre `expire`, qui remplace le paramètre [`timeout`](https://nginx.org/en/docs/http/ngx_http_keyval_module.html#keyval_timeout) de la directive [keyval\_zone](https://nginx.org/en/docs/http/ngx_http_keyval_module.html#keyval_zone).

    Paramètres de la requête :

    - **`httpKeyvalZoneKeyValue` (HTTP Keyval Shared Memory Zone, obligatoire)**

      La nouvelle valeur de la clé s'indique au format JSON.

    Réponses possibles :

    - 204 - Succès
    - 400 - JSON invalide (`KeyvalFormatError`), clé requise (`KeyvalFormatError`), le délai keyval n'est pas activé (`KeyvalFormatError`), une seule clé peut être mise à jour (`KeyvalFormatError`), échec de lecture du corps de la requête `BodyReadError`), renvoie Error
    - 404 - Keyval introuvable (`KeyvalNotFound`), clé keyval introuvable (`KeyvalKeyNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error
    - 413 - Request Entity Too Large, renvoie Error
    - 415 - Erreur JSON (`JsonError`), renvoie Error
  - `DELETE` - Vide la zone keyval HTTP

    Supprime toutes les paires clé-valeur de la [zone](https://nginx.org/en/docs/http/ngx_http_keyval_module.html#keyval_zone) de mémoire partagée keyval HTTP. Si la [synchronisation](https://nginx.org/en/docs/stream/ngx_stream_zone_sync_module.html#zone_sync) des zones keyval dans un cluster est activée, la zone n'est vidée que sur le nœud cible.

    Réponses possibles :

    - 204 - Succès
    - 404 - Keyval introuvable (`KeyvalNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/stream/`**

  Méthodes prises en charge :

  - `GET` - Renvoie la liste des points d'accès stream

    Renvoie la liste des points d'accès stream de premier niveau.

    Réponses possibles :

    - 200 - Succès, renvoie un tableau de chaînes
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/stream/server_zones/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de toutes les zones de serveur stream

    Renvoie les informations d'état de chaque [zone de serveur](https://nginx.org/en/docs/http/ngx_http_api_module.html#status_zone) stream.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des zones de serveur qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des zones de serveur sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « Stream Server Zone » pour toutes les zones de serveur stream
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/stream/server_zones/{streamServerZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`streamServerZoneName` (`string`, obligatoire)**

    Nom d'une zone de serveur stream.

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'une zone de serveur stream

    Renvoie l'état d'une zone de serveur stream donnée.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la zone de serveur qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie Stream Server Zone
    - 404 - Zone de serveur introuvable (`ServerZoneNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'une zone de serveur stream

    Réinitialise, pour une zone de serveur stream donnée, les statistiques des connexions acceptées et rejetées, des sessions, des octets reçus et envoyés, ainsi que les compteurs de poignées de main SSL et de réutilisations de session.

    Réponses possibles :

    - 204 - Succès
    - 404 - Zone de serveur introuvable (`ServerZoneNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/stream/limit_conns/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de toutes les zones limit\_conn stream

    Renvoie les informations d'état de chaque [zone limit\_conn](https://nginx.org/en/docs/stream/ngx_stream_limit_conn_module.html#limit_conn_zone) stream.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des zones limit\_conn qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des zones sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « Stream Connections Limiting » pour toutes les limitations de connexions stream
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/stream/limit_conns/{streamLimitConnZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`streamLimitConnZoneName` (`string`, obligatoire)**

    Nom d'une [zone limit\_conn](https://nginx.org/en/docs/stream/ngx_stream_limit_conn_module.html#limit_conn_zone).

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'une zone limit\_conn stream

    Renvoie l'état d'une [zone limit\_conn](https://nginx.org/en/docs/stream/ngx_stream_limit_conn_module.html#limit_conn_zone) stream donnée.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la [zone limit\_conn](https://nginx.org/en/docs/stream/ngx_stream_limit_conn_module.html#limit_conn_zone) qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie Stream Connections Limiting
    - 404 - limit\_conn introuvable (`LimitConnNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'une zone limit\_conn stream

    Réinitialise les statistiques de limitation des connexions.

    Réponses possibles :

    - 204 - Succès
    - 404 - limit\_conn introuvable (`LimitConnNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/stream/upstreams/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de tous les groupes de serveurs amont stream

    Renvoie l'état de chaque groupe de serveurs amont stream et de ses serveurs.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des groupes de serveurs amont qui seront affichés. Si la valeur de « `fields` » est vide, seuls les noms des groupes amont sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « Stream Upstream » pour tous les groupes amont stream
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/stream/upstreams/{streamUpstreamName}/`**

  Paramètres communs à toutes les méthodes :

  - **`streamUpstreamName` (`string`, obligatoire)**

    Nom d'un groupe de serveurs amont stream.

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'un groupe de serveurs amont stream

    Renvoie l'état d'un groupe de serveurs amont stream donné et de ses serveurs.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs du groupe de serveurs amont qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie Stream Upstream
    - 400 - Le groupe amont est statique (`UpstreamStatic`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'un groupe de serveurs amont stream

    Réinitialise les statistiques de chaque serveur amont d'un groupe de serveurs amont.

    Réponses possibles :

    - 204 - Succès
    - 400 - Le groupe amont est statique (`UpstreamStatic`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/stream/upstreams/{streamUpstreamName}/servers/`**

  Paramètres communs à toutes les méthodes :

  - **`streamUpstreamName` (`string`, obligatoire)**

    Nom d'un groupe de serveurs amont.

  Méthodes prises en charge :

  - `GET` - Renvoie la configuration de tous les serveurs d'un groupe amont stream

    Renvoie la configuration de chaque serveur d'un groupe de serveurs amont stream donné.

    Réponses possibles :

    - 200 - Succès, renvoie un tableau de Stream Upstream Servers
    - 400 - Le groupe amont est statique (`UpstreamStatic`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
  - `POST` - Ajoute un serveur à un groupe de serveurs amont stream

    Ajoute un nouveau serveur à un groupe de serveurs amont stream. Les paramètres du serveur sont indiqués au format JSON.

    Paramètres de la requête :

    - **`postStreamUpstreamServer` (Stream Upstream Server, obligatoire)**

      Adresse du nouveau serveur et autres paramètres facultatifs au format JSON. Les paramètres « `ID` », « `backup` » et « `service` » ne peuvent pas être modifiés.

    Réponses possibles :

    - 201 - Créé, renvoie Stream Upstream Server
    - 400 - Le groupe amont est statique (`UpstreamStatic`), valeur « *paramètre* » invalide (`UpstreamConfFormatError`), argument « `server` » manquant (`UpstreamConfFormatError`), paramètre inconnu « *nom* » (`UpstreamConfFormatError`), objet ou liste imbriqués (`UpstreamConfFormatError`), « `error` » lors de l'analyse (`UpstreamBadAddress`), pas de port dans le serveur « `host` » (`UpstreamBadAddress`), le groupe amont de service « `host` » ne doit pas avoir de port (`UpstreamBadAddress`), le groupe amont de service « `host` » exige un nom de domaine (`UpstreamBadAddress`), « `weight` » invalide (`UpstreamBadWeight`), « `max_conns` » invalide (`UpstreamBadMaxConns`), « `max_fails` » invalide (`UpstreamBadMaxFails`), « `fail_timeout` » invalide (`UpstreamBadFailTimeout`), « `slow_start` » invalide (`UpstreamBadSlowStart`), « `service` » vide (`UpstreamBadService`), aucun résolveur défini (`UpstreamConfNoResolver`), le groupe amont « *nom* » n'a pas de serveur de secours (`UpstreamNoBackup`), mémoire épuisée pour le groupe amont « *nom* » (`UpstreamOutOfMemory`), échec de lecture du corps de la requête `BodyReadError`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error
    - 409 - L'entrée existe (`EntryExists`), renvoie Error
    - 415 - Erreur JSON (`JsonError`), renvoie Error

- **`/stream/upstreams/{streamUpstreamName}/servers/{streamUpstreamServerId}`**

  Paramètres communs à toutes les méthodes :

  - **`streamUpstreamName` (`string`, obligatoire)**

    Nom du groupe de serveurs amont.

  - **`streamUpstreamServerId` (`string`, obligatoire)**

    Identifiant du serveur.

  Méthodes prises en charge :

  - `GET` - Renvoie la configuration d'un serveur d'un groupe amont stream

    Renvoie la configuration d'un serveur donné du groupe de serveurs amont stream.

    Réponses possibles :

    - 200 - Succès, renvoie Stream Upstream Server
    - 400 - Le groupe amont est statique (`UpstreamStatic`), identifiant de serveur invalide (`UpstreamBadServerId`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), le serveur d'identifiant « *id* » n'existe pas (`UpstreamServerNotFound`), renvoie Error
  - `PATCH` - Modifie un serveur d'un groupe de serveurs amont stream

    Modifie les paramètres d'un serveur donné d'un groupe de serveurs amont stream. Les paramètres sont indiqués au format JSON.

    Paramètres de la requête :

    - **`patchStreamUpstreamServer` (Stream Upstream Server, obligatoire)**

      Paramètres du serveur, au format JSON. Les paramètres « `ID` », « `backup` » et « `service` » ne peuvent pas être modifiés.

    Réponses possibles :

    - 200 - Succès, renvoie Stream Upstream Server
    - 400 - Le groupe amont est statique (`UpstreamStatic`), valeur « *paramètre* » invalide (`UpstreamConfFormatError`), paramètre inconnu « *nom* » (`UpstreamConfFormatError`), objet ou liste imbriqués (`UpstreamConfFormatError`), « `error` » lors de l'analyse (`UpstreamBadAddress`), argument « `server` » invalide (`UpstreamBadAddress`), pas de port dans le serveur « `host` » (`UpstreamBadAddress`), identifiant de serveur invalide (`UpstreamBadServerId`), « `weight` » invalide (`UpstreamBadWeight`), « `max_conns` » invalide (`UpstreamBadMaxConns`), « `max_fails` » invalide (`UpstreamBadMaxFails`), « `fail_timeout` » invalide (`UpstreamBadFailTimeout`), « `slow_start` » invalide (`UpstreamBadSlowStart`), échec de lecture du corps de la requête `BodyReadError`), « `service` » vide (`UpstreamBadService`), l'adresse du serveur « *ID* » est immuable (`UpstreamServerImmutable`), le poids du serveur « *ID* » est immuable (`UpstreamServerWeightImmutable`), mémoire épuisée pour le groupe amont « `name` » (`UpstreamOutOfMemory`), renvoie Error
    - 404 - Le serveur d'identifiant « *id* » n'existe pas (`UpstreamServerNotFound`), version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error
    - 415 - Erreur JSON (`JsonError`), renvoie Error
  - `DELETE` - Retire un serveur d'un groupe de serveurs amont stream

    Retire un serveur d'un groupe de serveurs stream.

    Réponses possibles :

    - 200 - Succès, renvoie un tableau de Stream Upstream Servers
    - 400 - Le groupe amont est statique (`UpstreamStatic`), identifiant de serveur invalide (`UpstreamBadServerId`), le serveur « *id* » ne peut pas être retiré (`UpstreamServerImmutable`), renvoie Error
    - 404 - Le serveur d'identifiant « *id* » n'existe pas (`UpstreamServerNotFound`), version inconnue (`UnknownVersion`), groupe amont introuvable (`UpstreamNotFound`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/stream/keyvals/`**

  Méthodes prises en charge :

  - `GET` - Renvoie les paires clé-valeur de toutes les zones keyval stream

    Renvoie les paires clé-valeur de chaque [zone](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html#keyval_zone) de mémoire partagée keyval stream.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Si la valeur de « `fields` » est vide, seuls les noms des zones keyval stream sont affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « Stream Keyval Shared Memory Zone » pour toutes les zones keyval stream
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/stream/keyvals/{streamKeyvalZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`streamKeyvalZoneName` (`string`, obligatoire)**

    Nom d'une zone de mémoire partagée keyval stream.

  Méthodes prises en charge :

  - `GET` - Renvoie les paires clé-valeur d'une zone keyval stream

    Renvoie les paires clé-valeur stockées dans une [zone](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html#keyval_zone) de mémoire partagée keyval stream donnée.

    Paramètres de la requête :

    - **`key` (`string`, facultatif)**

      Récupère une paire clé-valeur donnée de la zone keyval stream.

    Réponses possibles :

    - 200 - Succès, renvoie Stream Keyval Shared Memory Zone
    - 404 - Keyval introuvable (`KeyvalNotFound`), clé keyval introuvable (`KeyvalKeyNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `POST` - Ajoute une paire clé-valeur à la zone keyval stream

    Ajoute une nouvelle paire clé-valeur à la [zone](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html#keyval_zone) de mémoire partagée keyval stream. Plusieurs paires peuvent être saisies si la zone est vide.

    Paramètres de la requête :

    - **`Key-value` (Stream Keyval Shared Memory Zone, obligatoire)**

      Une paire clé-valeur s'indique au format JSON. Plusieurs paires peuvent être saisies si la zone de mémoire partagée keyval stream est vide. Une durée d'expiration en millisecondes peut être indiquée pour une paire avec le paramètre `expire`, qui remplace le paramètre [`timeout`](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html#keyval_timeout) de la directive [keyval\_zone](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html#keyval_zone).

    Réponses possibles :

    - 201 - Créé
    - 400 - JSON invalide (`KeyvalFormatError`), format de clé invalide (`KeyvalFormatError`), clé requise (`KeyvalFormatError`), le délai keyval n'est pas activé (`KeyvalFormatError`), une seule clé peut être ajoutée (`KeyvalFormatError`), échec de lecture du corps de la requête `BodyReadError`), renvoie Error
    - 404 - Keyval introuvable (`KeyvalNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error
    - 409 - L'entrée existe (`EntryExists`), la clé existe déjà (`KeyvalKeyExists`), renvoie Error
    - 413 - Request Entity Too Large, renvoie Error
    - 415 - Erreur JSON (`JsonError`), renvoie Error
  - `PATCH` - Modifie une valeur ou supprime une clé

    Modifie la valeur de la clé choisie dans la paire clé-valeur, supprime une clé en mettant sa valeur à `null`, modifie la durée d'expiration d'une paire. Si la [synchronisation](https://nginx.org/en/docs/stream/ngx_stream_zone_sync_module.html#zone_sync) des zones keyval dans un cluster est activée, la clé n'est supprimée que sur le nœud cible. La durée d'expiration s'indique en millisecondes avec le paramètre `expire`, qui remplace le paramètre [`timeout`](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html#keyval_timeout) de la directive [keyval\_zone](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html#keyval_zone).

    Paramètres de la requête :

    - **`streamKeyvalZoneKeyValue` (Stream Keyval Shared Memory Zone, obligatoire)**

      La nouvelle valeur de la clé s'indique au format JSON.

    Réponses possibles :

    - 204 - Succès
    - 400 - JSON invalide (`KeyvalFormatError`), clé requise (`KeyvalFormatError`), le délai keyval n'est pas activé (`KeyvalFormatError`), une seule clé peut être mise à jour (`KeyvalFormatError`), échec de lecture du corps de la requête `BodyReadError`), renvoie Error
    - 404 - Keyval introuvable (`KeyvalNotFound`), clé keyval introuvable (`KeyvalKeyNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error
    - 413 - Request Entity Too Large, renvoie Error
    - 415 - Erreur JSON (`JsonError`), renvoie Error
  - `DELETE` - Vide la zone keyval stream

    Supprime toutes les paires clé-valeur de la [zone](https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html#keyval_zone) de mémoire partagée keyval stream. Si la [synchronisation](https://nginx.org/en/docs/stream/ngx_stream_zone_sync_module.html#zone_sync) des zones keyval dans un cluster est activée, la zone n'est vidée que sur le nœud cible.

    Réponses possibles :

    - 204 - Succès
    - 404 - Keyval introuvable (`KeyvalNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/stream/zone_sync/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de synchronisation d'un nœud

    Renvoie l'état de synchronisation d'un nœud du cluster.

    Réponses possibles :

    - 200 - Succès, renvoie Stream Zone Sync Node
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/resolvers/`**

  Méthodes prises en charge :

  - `GET` - Renvoie l'état de toutes les zones de résolveur

    Renvoie les informations d'état de chaque [zone de résolveur](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver_status_zone).

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des statistiques des résolveurs qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « Resolver Zone » pour tous les résolveurs
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error

- **`/resolvers/{resolverZoneName}`**

  Paramètres communs à toutes les méthodes :

  - **`resolverZoneName` (`string`, obligatoire)**

    Nom d'une zone de résolveur.

  Méthodes prises en charge :

  - `GET` - Renvoie les statistiques d'une zone de résolveur

    Renvoie les statistiques stockées dans une [zone](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver_status_zone) de résolveur donnée.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs de la zone de résolveur qui seront affichés (requêtes, réponses, ou les deux).

    Réponses possibles :

    - 200 - Succès, renvoie Resolver Zone
    - 404 - Zone de résolveur introuvable (`ResolverZoneNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'une zone de résolveur.

    Réinitialise les statistiques d'une zone de résolveur donnée.

    Réponses possibles :

    - 204 - Succès
    - 404 - Zone de résolveur introuvable (`ResolverZoneNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/ssl`**

  Méthodes prises en charge :

  - `GET` - Renvoie les statistiques SSL

    Renvoie les statistiques SSL.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des statistiques SSL qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie SSL
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques SSL

    Réinitialise les compteurs de poignées de main SSL et de réutilisations de session.

    Réponses possibles :

    - 204 - Succès
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/license`**

  Méthodes prises en charge :

  - `GET` - Renvoie les informations de licence

    Réponses possibles :

    - 200 - Succès, renvoie License
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
  - `PUT` - Applique un jeton de licence

    Accepte un jeton de licence JWT brut, le valide, l'enregistre dans le [chemin du jeton actif](https://nginx.org/en/docs/ngx_mgmt_module.html#state_path) et l'applique en mémoire. Nécessite la configuration de la directive [license\_pending\_token](https://nginx.org/en/docs/ngx_mgmt_module.html#license_pending_token).

    Paramètres de la requête :

    - **`putLicenseToken` (chaîne de jeton de licence JWT brut à valider et appliquer, obligatoire)**

      Chaîne de jeton de licence JWT brut à valider et appliquer

    Réponses possibles :

    - 200 - Succès, renvoie les informations du jeton de licence JWT
    - 400 - Jeton de licence invalide (`LicenseFormatError`), corps de la requête vide (`LicenseFormatError`), renvoie Error
    - 404 - Version inconnue (`UnknownVersion`), renvoie Error
    - 409 - La licence renouvelée ne correspond pas à la licence actuelle (`LicenseMismatch`), renvoie Error

- **`/workers/`**

  Méthodes prises en charge :

  - `GET` - Renvoie les statistiques de tous les processus de travail

    Renvoie les statistiques de tous les processus de travail : connexions acceptées, rejetées, actives, inactives, requêtes totales et en cours.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des statistiques des processus de travail qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie une collection d'objets « Worker process » pour tous les processus de travail
    - 404 - Processus de travail introuvable (`WorkerNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques de tous les processus de travail.

    Réinitialise les statistiques de tous les processus de travail : connexions acceptées, rejetées, actives, inactives, requêtes totales et en cours.

    Réponses possibles :

    - 204 - Succès
    - 404 - Processus de travail introuvable (`WorkerNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

- **`/workers/{workerId}`**

  Paramètres communs à toutes les méthodes :

  - **`workerId` (`string`, obligatoire)**

    Identifiant du processus de travail.

  Méthodes prises en charge :

  - `GET` - Renvoie l'état d'un processus de travail

    Renvoie l'état d'un processus de travail donné.

    Paramètres de la requête :

    - **`fields` (`string`, facultatif)**

      Limite les champs des statistiques des processus de travail qui seront affichés.

    Réponses possibles :

    - 200 - Succès, renvoie Worker process
    - 404 - Processus de travail introuvable (`WorkerNotFound`), version inconnue (`UnknownVersion`), renvoie Error
  - `DELETE` - Réinitialise les statistiques d'un processus de travail.

    Réinitialise les statistiques des connexions acceptées, rejetées, actives et inactives, ainsi que des requêtes totales et en cours.

    Réponses possibles :

    - 204 - Succès
    - 404 - Processus de travail introuvable (`WorkerNotFound`), version inconnue (`UnknownVersion`), renvoie Error
    - 405 - Méthode désactivée (`MethodDisabled`), renvoie Error

## Objets de réponse

- nginx :

  Informations générales sur nginx :

  - **`version` (`string`)**

    Version de nginx.

  - **`build` (`string`)**

    Nom de compilation de nginx.

  - **`address` (`string`)**

    Adresse du serveur qui a accepté la requête d'état.

  - **`generation` (`integer`)**

    Nombre total de [rechargements](https://nginx.org/en/docs/control.html#reconfiguration) de configuration.

  - **`load_timestamp` (`string`)**

    Heure du dernier rechargement de la configuration, au format ISO 8601 à la milliseconde près.

  - **`timestamp` (`string`)**

    Heure courante au format ISO 8601 à la milliseconde près.

  - **`pid` (`integer`)**

    Identifiant du processus de travail qui a traité la requête d'état.

  - **`ppid` (`integer`)**

    Identifiant du processus maître qui a démarré le [processus de travail](https://nginx.org/en/docs/http/ngx_http_status_module.html#pid).

  Exemple :

  ```nginx
  {
    "nginx" : {
      "version" : "1.21.6",
      "build" : "nginx-plus-r27",
      "address" : "206.251.255.64",
      "generation" : 6,
      "load_timestamp" : "2022-06-28T11:15:44.467Z",
      "timestamp" : "2022-06-28T09:26:07.305Z",
      "pid" : 32212,
      "ppid" : 32210
    }
  }
  ```
- Processus :

  - **`respawned` (`integer`)**

    Nombre total de processus enfants terminés anormalement et relancés.

  Exemple :

  ```nginx
  {
    "respawned" : 0
  }
  ```
- Connexions :

  Nombre de connexions acceptées, rejetées, actives et inactives.

  - **`accepted` (`integer`)**

    Nombre total de connexions clientes acceptées.

  - **`dropped` (`integer`)**

    Nombre total de connexions clientes abandonnées.

  - **`active` (`integer`)**

    Nombre actuel de connexions clientes actives.

  - **`idle` (`integer`)**

    Nombre actuel de connexions clientes inactives.

  Exemple :

  ```nginx
  {
    "accepted" : 4968119,
    "dropped" : 0,
    "active" : 5,
    "idle" : 117
  }
  ```
- SSL:

  - **`handshakes` (`integer`)**

    Nombre total de négociations SSL réussies.

  - **`handshakes_failed` (`integer`)**

    Nombre total de négociations SSL échouées.

  - **`session_reuses` (`integer`)**

    Nombre total de réutilisations de session lors des négociations SSL.

  - **`no_common_protocol` (`integer`)**

    Nombre de poignées de main SSL échouées faute de protocole commun.

  - **`no_common_cipher` (`integer`)**

    Nombre de poignées de main SSL échouées faute de chiffrement partagé.

  - **`handshake_timeout` (`integer`)**

    Nombre de poignées de main SSL échouées pour dépassement de délai.

  - **`peer_rejected_cert` (`integer`)**

    Nombre de poignées de main SSL échouées où nginx a présenté son certificat au client, qui l'a rejeté avec un message d'alerte correspondant.

  - **`verify_failures`**

    Erreurs de vérification des certificats SSL

    - **`no_cert` (`integer`)**

      Un client n'a pas fourni le certificat requis.

    - **`expired_cert` (`integer`)**

      Un client a présenté un certificat expiré ou pas encore valide.

    - **`revoked_cert` (`integer`)**

      Un client a présenté un certificat révoqué.

    - **`hostname_mismatch` (`integer`)**

      Le certificat du serveur ne correspond pas au nom d'hôte.

    - **`other` (`integer`)**

      Autres erreurs de vérification des certificats SSL.

  Exemple :

  ```nginx
  {
    "handshakes" : 79572,
    "handshakes_failed" : 21025,
    "session_reuses" : 15762,
    "no_common_protocol" : 4,
    "no_common_cipher" : 2,
    "handshake_timeout" : 0,
    "peer_rejected_cert" : 0,
    "verify_failures" : {
      "no_cert" : 0,
      "expired_cert" : 2,
      "revoked_cert" : 1,
      "hostname_mismatch" : 2,
      "other" : 1
    }
  }
  ```
- Zone de mémoire partagée avec allocateur slab :

  Zone de mémoire partagée avec allocateur slab

  - **`pages`**

    Nombre de pages mémoire libres et utilisées.

    - **`used` (`integer`)**

      Nombre actuel de pages mémoire utilisées.

    - **`free` (`integer`)**

      Nombre actuel de pages mémoire libres.

  - **`slots`**

    Données d'état des emplacements mémoire (8, 16, 32, 64, 128, etc.)

    Une collection d'objets « Memory Slot »

  Exemple :

  ```nginx
  {
    "pages" : {
      "used" : 1143,
      "free" : 2928
    },
    "slots" : {
      "8" : {
        "used" : 0,
        "free" : 0,
        "reqs" : 0,
        "fails" : 0
      },
      "16" : {
        "used" : 0,
        "free" : 0,
        "reqs" : 0,
        "fails" : 0
      },
      "32" : {
        "used" : 0,
        "free" : 0,
        "reqs" : 0,
        "fails" : 0
      },
      "64" : {
        "used" : 1,
        "free" : 63,
        "reqs" : 1,
        "fails" : 0
      },
      "128" : {
        "used" : 0,
        "free" : 0,
        "reqs" : 0,
        "fails" : 0
      },
      "256" : {
        "used" : 18078,
        "free" : 178,
        "reqs" : 1635736,
        "fails" : 0
      }
    }
  }
  ```
- Emplacement mémoire :

  - **`used` (`integer`)**

    Nombre actuel d'emplacements mémoire utilisés.

  - **`free` (`integer`)**

    Nombre actuel d'emplacements mémoire libres.

  - **`reqs` (`integer`)**

    Nombre total de tentatives d'allocation de mémoire de la taille indiquée.

  - **`fails` (`integer`)**

    Nombre de tentatives d'allocation de mémoire de la taille indiquée qui ont échoué.
- Requêtes HTTP :

  - **`total` (`integer`)**

    Nombre total de requêtes des clients.

  - **`current` (`integer`)**

    Nombre actuel de requêtes des clients.

  Exemple :

  ```nginx
  {
    "total" : 10624511,
    "current" : 4
  }
  ```
- Zone de serveur HTTP :

  - **`processing` (`integer`)**

    Nombre de requêtes des clients en cours de traitement.

  - **`requests` (`integer`)**

    Nombre total de requêtes reçues des clients.

  - **`responses`**

    Nombre total de réponses envoyées aux clients, nombre de réponses avec les codes d'état « `1xx` », « `2xx` », « `3xx` », « `4xx` » et « `5xx` », et nombre de réponses par code d'état.

    - **`1xx` (`integer`)**

      Nombre de réponses avec un code d'état « `1xx` ».

    - **`2xx` (`integer`)**

      Nombre de réponses avec un code d'état « `2xx` ».

    - **`3xx` (`integer`)**

      Nombre de réponses avec un code d'état « `3xx` ».

    - **`4xx` (`integer`)**

      Nombre de réponses avec un code d'état « `4xx` ».

    - **`5xx` (`integer`)**

      Nombre de réponses avec un code d'état « `5xx` ».

    - **`codes`**

      Nombre de réponses par code d'état.

      - **`codeNumber` (`integer`)**

        Nombre de réponses avec ce code d'état précis.

    - **`total` (`integer`)**

      Nombre total de réponses envoyées aux clients.

  - **`discarded` (`integer`)**

    Nombre total de requêtes terminées sans envoi de réponse.

  - **`received` (`integer`)**

    Nombre total d'octets reçus des clients.

  - **`sent` (`integer`)**

    Nombre total d'octets envoyés aux clients.

  - **`ssl`**

    - **`handshakes` (`integer`)**

      Nombre total de négociations SSL réussies.

    - **`handshakes_failed` (`integer`)**

      Nombre total de négociations SSL échouées.

    - **`session_reuses` (`integer`)**

      Nombre total de réutilisations de session lors des négociations SSL.

    - **`no_common_protocol` (`integer`)**

      Nombre de poignées de main SSL échouées faute de protocole commun.

    - **`no_common_cipher` (`integer`)**

      Nombre de poignées de main SSL échouées faute de chiffrement partagé.

    - **`handshake_timeout` (`integer`)**

      Nombre de poignées de main SSL échouées pour dépassement de délai.

    - **`peer_rejected_cert` (`integer`)**

      Nombre de poignées de main SSL échouées où nginx a présenté son certificat au client, qui l'a rejeté avec un message d'alerte correspondant.

    - **`verify_failures`**

      Erreurs de vérification des certificats SSL

      - **`no_cert` (`integer`)**

        Un client n'a pas fourni le certificat requis.

      - **`expired_cert` (`integer`)**

        Un client a présenté un certificat expiré ou pas encore valide.

      - **`revoked_cert` (`integer`)**

        Un client a présenté un certificat révoqué.

      - **`other` (`integer`)**

        Autres erreurs de vérification des certificats SSL.

  Exemple :

  ```nginx
  {
    "processing" : 1,
    "requests" : 706690,
    "responses" : {
      "1xx" : 0,
      "2xx" : 699482,
      "3xx" : 4522,
      "4xx" : 907,
      "5xx" : 266,
      "codes" : {
        "200" : 699482,
        "301" : 4522,
        "404" : 907,
        "503" : 266
      },
      "total" : 705177
    },
    "discarded" : 1513,
    "received" : 172711587,
    "sent" : 19415530115,
    "ssl" : {
      "handshakes" : 104303,
      "handshakes_failed" : 1421,
      "session_reuses" : 54645,
      "no_common_protocol" : 4,
      "no_common_cipher" : 2,
      "handshake_timeout" : 0,
      "peer_rejected_cert" : 0,
      "verify_failures" : {
        "no_cert" : 0,
        "expired_cert" : 2,
        "revoked_cert" : 1,
        "other" : 1
      }
    }
  }
  ```
- Zone de location HTTP :

  - **`requests` (`integer`)**

    Nombre total de requêtes reçues des clients.

  - **`responses`**

    Nombre total de réponses envoyées aux clients, nombre de réponses avec les codes d'état « `1xx` », « `2xx` », « `3xx` », « `4xx` » et « `5xx` », et nombre de réponses par code d'état.

    - **`1xx` (`integer`)**

      Nombre de réponses avec un code d'état « `1xx` ».

    - **`2xx` (`integer`)**

      Nombre de réponses avec un code d'état « `2xx` ».

    - **`3xx` (`integer`)**

      Nombre de réponses avec un code d'état « `3xx` ».

    - **`4xx` (`integer`)**

      Nombre de réponses avec un code d'état « `4xx` ».

    - **`5xx` (`integer`)**

      Nombre de réponses avec un code d'état « `5xx` ».

    - **`codes`**

      Nombre de réponses par code d'état.

      - **`codeNumber` (`integer`)**

        Nombre de réponses avec ce code d'état précis.

    - **`total` (`integer`)**

      Nombre total de réponses envoyées aux clients.

  - **`discarded` (`integer`)**

    Nombre total de requêtes terminées sans envoi de réponse.

  - **`received` (`integer`)**

    Nombre total d'octets reçus des clients.

  - **`sent` (`integer`)**

    Nombre total d'octets envoyés aux clients.

  Exemple :

  ```nginx
  {
    "requests" : 706690,
    "responses" : {
      "1xx" : 0,
      "2xx" : 699482,
      "3xx" : 4522,
      "4xx" : 907,
      "5xx" : 266,
      "codes" : {
        "200" : 112674,
        "301" : 4522,
        "404" : 2504,
        "503" : 266
      },
      "total" : 705177
    },
    "discarded" : 1513,
    "received" : 172711587,
    "sent" : 19415530115
  }
  ```
- Cache HTTP :

  - **`size` (`integer`)**

    Taille actuelle du cache.

  - **`max_size` (`integer`)**

    Limite de taille maximale du cache indiquée dans la configuration.

  - **`cold` (`boolean`)**

    Booléen indiquant si le processus « chargeur de cache » charge encore des données du disque vers le cache.

  - **`hit`**

    - **`responses` (`integer`)**

      Nombre total de réponses [valides](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid) lues depuis le cache.

    - **`bytes` (`integer`)**

      Nombre total d'octets lus dans le cache.

  - **`stale`**

    - **`responses` (`integer`)**

      Nombre total de réponses expirées lues depuis le cache (voir [proxy\_cache\_use\_stale](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_use_stale) et les autres directives « `*_cache_use_stale` »).

    - **`bytes` (`integer`)**

      Nombre total d'octets lus dans le cache.

  - **`updating`**

    - **`responses` (`integer`)**

      Nombre total de réponses expirées lues depuis le cache pendant la mise à jour des réponses (voir [proxy\_cache\_use\_stale](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_use_stale_updating) et les autres directives « `*_cache_use_stale` »).

    - **`bytes` (`integer`)**

      Nombre total d'octets lus dans le cache.

  - **`revalidated`**

    - **`responses` (`integer`)**

      Nombre total de réponses expirées et revalidées lues depuis le cache (voir [proxy\_cache\_revalidate](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_revalidate) et les autres directives « `*_cache_revalidate` »).

    - **`bytes` (`integer`)**

      Nombre total d'octets lus dans le cache.

  - **`miss`**

    - **`responses` (`integer`)**

      Nombre total de réponses absentes du cache.

    - **`bytes` (`integer`)**

      Nombre total d'octets lus depuis le serveur mandaté.

    - **`responses_written` (`integer`)**

      Nombre total de réponses écrites dans le cache.

    - **`bytes_written` (`integer`)**

      Nombre total d'octets écrits dans le cache.

  - **`expired`**

    - **`responses` (`integer`)**

      Nombre total de réponses expirées non prises dans le cache.

    - **`bytes` (`integer`)**

      Nombre total d'octets lus depuis le serveur mandaté.

    - **`responses_written` (`integer`)**

      Nombre total de réponses écrites dans le cache.

    - **`bytes_written` (`integer`)**

      Nombre total d'octets écrits dans le cache.

  - **`bypass`**

    - **`responses` (`integer`)**

      Nombre total de réponses non recherchées dans le cache à cause de la directive [proxy\_cache\_bypass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_bypass) et des autres directives « `*_cache_bypass` ».

    - **`bytes` (`integer`)**

      Nombre total d'octets lus depuis le serveur mandaté.

    - **`responses_written` (`integer`)**

      Nombre total de réponses écrites dans le cache.

    - **`bytes_written` (`integer`)**

      Nombre total d'octets écrits dans le cache.

  Exemple :

  ```nginx
  {
    "size" : 530915328,
    "max_size" : 536870912,
    "cold" : false,
    "hit" : {
      "responses" : 254032,
      "bytes" : 6685627875
    },
    "stale" : {
      "responses" : 0,
      "bytes" : 0
    },
    "updating" : {
      "responses" : 0,
      "bytes" : 0
    },
    "revalidated" : {
      "responses" : 0,
      "bytes" : 0
    },
    "miss" : {
      "responses" : 1619201,
      "bytes" : 53841943822
    },
    "expired" : {
      "responses" : 45859,
      "bytes" : 1656847080,
      "responses_written" : 44992,
      "bytes_written" : 1641825173
    },
    "bypass" : {
      "responses" : 200187,
      "bytes" : 5510647548,
      "responses_written" : 200173,
      "bytes_written" : 44992
    }
  }
  ```
- Limitation des connexions HTTP :

  - **`passed` (`integer`)**

    Nombre total de connexions ni limitées ni comptées comme limitées.

  - **`rejected` (`integer`)**

    Nombre total de connexions rejetées.

  - **`rejected_dry_run` (`integer`)**

    Nombre total de connexions comptées comme rejetées en mode [simulation](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html#limit_conn_dry_run).

  Exemple :

  ```nginx
  {
    "passed" : 15,
    "rejected" : 0,
    "rejected_dry_run" : 2
  }
  ```
- Limitation du débit des requêtes HTTP :

  - **`passed` (`integer`)**

    Nombre total de requêtes ni limitées ni comptées comme limitées.

  - **`delayed` (`integer`)**

    Nombre total de requêtes retardées.

  - **`rejected` (`integer`)**

    Nombre total de requêtes rejetées.

  - **`delayed_dry_run` (`integer`)**

    Nombre total de requêtes comptées comme retardées en mode [simulation](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_dry_run).

  - **`rejected_dry_run` (`integer`)**

    Nombre total de requêtes comptées comme rejetées en mode [simulation](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html#limit_req_dry_run).

  Exemple :

  ```nginx
  {
    "passed" : 15,
    "delayed" : 4,
    "rejected" : 0,
    "delayed_dry_run" : 1,
    "rejected_dry_run" : 2
  }
  ```
- Groupe amont HTTP :

  - **`peers`**

    Un tableau de :

    - **`id` (`integer`)**

      Identifiant du serveur.

    - **`server` (`string`)**

      [Adresse](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server) du serveur.

    - **`service` (`string`)**

      Valeur du paramètre [service](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#service) de la directive [server](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server).

    - **`name` (`string`)**

      Nom du serveur indiqué dans la directive [server](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server).

    - **`backup` (`boolean`)**

      Booléen indiquant si le serveur est un serveur de [secours](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#backup).

    - **`weight` (`integer`)**

      [Poids](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#weight) du serveur.

    - **`state` (`string`)**

      État courant, parmi « `up` », « `draining` », « `down` », « `unavail` », « `checking` » et « `unhealthy` ».

    - **`active` (`integer`)**

      Nombre actuel de connexions actives.

    - **`ssl`**

      - **`handshakes` (`integer`)**

        Nombre total de négociations SSL réussies.

      - **`handshakes_failed` (`integer`)**

        Nombre total de négociations SSL échouées.

      - **`session_reuses` (`integer`)**

        Nombre total de réutilisations de session lors des négociations SSL.

      - **`no_common_protocol` (`integer`)**

        Nombre de poignées de main SSL échouées faute de protocole commun.

      - **`handshake_timeout` (`integer`)**

        Nombre de poignées de main SSL échouées pour dépassement de délai.

      - **`peer_rejected_cert` (`integer`)**

        Nombre de poignées de main SSL échouées où nginx a présenté son certificat au serveur amont, qui l'a rejeté avec un message d'alerte correspondant.

      - **`verify_failures`**

        Erreurs de vérification des certificats SSL

        - **`expired_cert` (`integer`)**

          Un serveur amont a présenté un certificat expiré ou pas encore valide.

        - **`revoked_cert` (`integer`)**

          Un serveur amont a présenté un certificat révoqué.

        - **`hostname_mismatch` (`integer`)**

          Le certificat du serveur ne correspond pas au nom d'hôte.

        - **`other` (`integer`)**

          Autres erreurs de vérification des certificats SSL.

    - **`max_conns` (`integer`)**

      Limite [max\_conns](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#max_conns) du serveur.

    - **`requests` (`integer`)**

      Nombre total de requêtes des clients transmises à ce serveur.

    - **`responses`**

      - **`1xx` (`integer`)**

        Nombre de réponses avec un code d'état « `1xx` ».

      - **`2xx` (`integer`)**

        Nombre de réponses avec un code d'état « `2xx` ».

      - **`3xx` (`integer`)**

        Nombre de réponses avec un code d'état « `3xx` ».

      - **`4xx` (`integer`)**

        Nombre de réponses avec un code d'état « `4xx` ».

      - **`5xx` (`integer`)**

        Nombre de réponses avec un code d'état « `5xx` ».

      - **`codes`**

        Nombre de réponses par code d'état.

        - **`codeNumber` (`integer`)**

          Nombre de réponses avec ce code d'état précis.

      - **`total` (`integer`)**

        Nombre total de réponses obtenues de ce serveur.

    - **`sent` (`integer`)**

      Nombre total d'octets envoyés à ce serveur.

    - **`received` (`integer`)**

      Nombre total d'octets reçus de ce serveur.

    - **`fails` (`integer`)**

      Nombre total de tentatives de communication échouées avec le serveur.

    - **`unavail` (`integer`)**

      Nombre de fois où le serveur est devenu indisponible pour les requêtes client (état « `unavail` ») parce que le nombre de tentatives infructueuses a atteint le seuil [max\_fails](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#max_fails).

    - **`health_checks`**

      - **`checks` (`integer`)**

        Nombre total de requêtes de [vérification de santé](https://nginx.org/en/docs/http/ngx_http_upstream_hc_module.html#health_check) effectuées.

      - **`fails` (`integer`)**

        Nombre de vérifications d'état échouées.

      - **`unhealthy` (`integer`)**

        Nombre de fois où le serveur est devenu défaillant (état « `unhealthy` »).

      - **`last_passed` (`boolean`)**

        Booléen indiquant si la dernière requête de vérification de santé a réussi et passé les [tests](https://nginx.org/en/docs/http/ngx_http_upstream_hc_module.html#match).

    - **`downtime` (`integer`)**

      Durée totale passée par le serveur dans les états « `unavail` », « `checking` » et « `unhealthy` ».

    - **`downstart` (`string`)**

      Heure à laquelle le serveur est passé à l'état « `unavail` », « `checking` » ou « `unhealthy` », au format ISO 8601 à la milliseconde près.

    - **`selected` (`string`)**

      Heure à laquelle le serveur a été choisi pour la dernière fois pour traiter une requête, au format ISO 8601 à la milliseconde près.

    - **`header_time` (`integer`)**

      Temps moyen d'obtention de l'[en-tête de réponse](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#var_upstream_header_time) du serveur.

    - **`response_time` (`integer`)**

      Temps moyen d'obtention de la [réponse complète](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#var_upstream_response_time) du serveur.

    - **`response_time_hist`**

      Histogramme des temps de réponse amont, collecté par serveur amont.

      - **`count` (`integer`)**

        Nombre total de réponses enregistrées.

      - **`sum` (`integer`)**

        Somme de tous les temps de réponse amont enregistrés, en millisecondes.

      - **`buckets`**

        Compteurs des tranches de l'histogramme des temps de réponse amont, en millisecondes. Chaque nom de tranche (« 5 », « 10 », « 25 », « 50 », etc.) est une limite de temps en millisecondes, et chaque valeur le nombre de réponses dans cette tranche. La tranche « inf » compte les réponses de plus de 10000 ms.

        - **`5` (`integer`)**

          Nombre total de réponses dont le temps est inférieur ou égal à 5 ms.

        - **`10` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 5 ms et inférieur ou égal à 10 ms.

        - **`25` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 10 ms et inférieur ou égal à 25 ms.

        - **`50` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 25 ms et inférieur ou égal à 50 ms.

        - **`75` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 50 ms et inférieur ou égal à 75 ms.

        - **`100` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 75 ms et inférieur ou égal à 100 ms.

        - **`250` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 100 ms et inférieur ou égal à 250 ms.

        - **`500` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 250 ms et inférieur ou égal à 500 ms.

        - **`750` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 500 ms et inférieur ou égal à 750 ms.

        - **`1000` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 750 ms et inférieur ou égal à 1000 ms.

        - **`2500` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 1000 ms et inférieur ou égal à 2500 ms.

        - **`5000` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 2500 ms et inférieur ou égal à 5000 ms.

        - **`7500` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 5000 ms et inférieur ou égal à 7500 ms.

        - **`10000` (`integer`)**

          Nombre total de réponses dont le temps est supérieur à 7500 ms et inférieur ou égal à 10000 ms.

        - **`inf` (`integer`)**

          Nombre total d'observations dont le temps de réponse dépasse 10000 ms.

  - **`keepalive` (`integer`)**

    Nombre courant de connexions [keepalive](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive) inactives.

  - **`zombies` (`integer`)**

    Nombre actuel de serveurs retirés du groupe mais qui traitent encore des requêtes actives.

  - **`zone` (`string`)**

    Nom de la [zone](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#zone) de mémoire partagée qui conserve la configuration et l'état d'exécution du groupe.

  - **`queue`**

    Pour la [file d'attente](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#queue) des requêtes, les données suivantes sont fournies :

    - **`size` (`integer`)**

      Nombre actuel de requêtes dans la file.

    - **`max_size` (`integer`)**

      Nombre maximal de requêtes pouvant se trouver simultanément dans la file.

    - **`overflows` (`integer`)**

      Nombre total de requêtes rejetées pour cause de file pleine.

  Exemple :

  ```nginx
  {
    "upstream_backend" : {
      "peers" : [
        {
          "id" : 0,
          "server" : "10.0.0.1:8088",
          "name" : "10.0.0.1:8088",
          "backup" : false,
          "weight" : 5,
          "state" : "up",
          "active" : 0,
          "ssl" : {
            "handshakes" : 620311,
            "handshakes_failed" : 3432,
            "session_reuses" : 36442,
            "no_common_protocol" : 4,
            "handshake_timeout" : 0,
            "peer_rejected_cert" : 0,
            "verify_failures" : {
              "expired_cert" : 2,
              "revoked_cert" : 1,
              "hostname_mismatch" : 2,
              "other" : 1
            }
          },
          "max_conns" : 20,
          "requests" : 667231,
          "header_time" : 20,
          "response_time" : 36,
          "response_time_hist" : {
            "count" : 9817,
            "sum" : 57625,
            "buckets" : {
              "5" : 4428,
              "10" : 4755,
              "25" : 350,
              "50" : 235,
              "75" : 54,
              "100" : 47,
              "250" : 1,
              "500" : 0,
              "750" : 0,
              "1000" : 0,
              "2500" : 0,
              "5000" : 0,
              "7500" : 0,
              "10000" : 0,
              "inf" : 0
            }
          },
          "responses" : {
            "1xx" : 0,
            "2xx" : 666310,
            "3xx" : 0,
            "4xx" : 915,
            "5xx" : 6,
            "codes" : {
              "200" : 666310,
              "404" : 915,
              "503" : 6
            },
            "total" : 667231
          },
          "sent" : 251946292,
          "received" : 19222475454,
          "fails" : 0,
          "unavail" : 0,
          "health_checks" : {
            "checks" : 26214,
            "fails" : 0,
            "unhealthy" : 0,
            "last_passed" : true
          },
          "downtime" : 0,
          "downstart" : "2022-06-28T11:09:21.602Z",
          "selected" : "2022-06-28T15:01:25.000Z"
        },
        {
          "id" : 1,
          "server" : "10.0.0.1:8089",
          "name" : "10.0.0.1:8089",
          "backup" : true,
          "weight" : 1,
          "state" : "unhealthy",
          "active" : 0,
          "max_conns" : 20,
          "requests" : 0,
          "responses" : {
            "1xx" : 0,
            "2xx" : 0,
            "3xx" : 0,
            "4xx" : 0,
            "5xx" : 0,
            "codes" : {
            },
            "total" : 0
          },
          "sent" : 0,
          "received" : 0,
          "fails" : 0,
          "unavail" : 0,
          "health_checks" : {
            "checks" : 26284,
            "fails" : 26284,
            "unhealthy" : 1,
            "last_passed" : false
          },
          "downtime" : 262925617,
          "downstart" : "2022-06-28T11:09:21.602Z",
          "selected" : "2022-06-28T15:01:25.000Z"
        }
      ],
      "keepalive" : 0,
      "zombies" : 0,
      "zone" : "upstream_backend"
    }
  }
  ```
- Serveur amont HTTP :

  Paramètres configurables dynamiquement d'un [serveur](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server) amont HTTP :

  - **`id` (`integer`)**

    Identifiant du serveur amont HTTP. Il est attribué automatiquement et ne peut pas être modifié.

  - **`server` (`string`)**

    Identique au paramètre [address](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server) du serveur amont HTTP. Lors de l'ajout d'un serveur, on peut l'indiquer sous forme de nom de domaine. Les changements des adresses IP correspondantes sont alors surveillés et appliqués automatiquement à la configuration amont sans redémarrer nginx. Cela nécessite la directive [resolver](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver) dans le bloc « `http` ». Voir aussi le paramètre [resolve](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#resolve) du serveur amont HTTP.

  - **`service` (`string`)**

    Identique au paramètre [service](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#service) du serveur amont HTTP. Ce paramètre ne peut pas être modifié.

  - **`weight` (`integer`)**

    Identique au paramètre [weight](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#weight) du serveur amont HTTP.

  - **`max_conns` (`integer`)**

    Identique au paramètre [max\_conns](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#max_conns) du serveur amont HTTP.

  - **`max_fails` (`integer`)**

    Identique au paramètre [max\_fails](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#max_fails) du serveur amont HTTP.

  - **`fail_timeout` (`string`)**

    Identique au paramètre [fail\_timeout](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#fail_timeout) du serveur amont HTTP.

  - **`slow_start` (`string`)**

    Identique au paramètre [slow\_start](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#slow_start) du serveur amont HTTP.

  - **`route` (`string`)**

    Identique au paramètre [route](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#route) du serveur amont HTTP.

  - **`backup` (`boolean`)**

    Avec `true`, ajoute un serveur de [secours](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#backup). Ce paramètre ne peut pas être modifié.

  - **`down` (`boolean`)**

    Identique au paramètre [down](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#down) du serveur amont HTTP.

  - **`drain` (`boolean`)**

    Identique au paramètre [drain](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#drain) du serveur amont HTTP.

  - **`parent` (`string`)**

    Identifiant du serveur parent du serveur résolu. Il est attribué automatiquement et ne peut pas être modifié.

  - **`host` (`string`)**

    Nom d'hôte du serveur résolu. Il est attribué automatiquement et ne peut pas être modifié.

  Exemple :

  ```nginx
  {
    "id" : 1,
    "server" : "10.0.0.1:8089",
    "weight" : 4,
    "max_conns" : 0,
    "max_fails" : 0,
    "fail_timeout" : "10s",
    "slow_start" : "10s",
    "route" : "",
    "backup" : true,
    "down" : true
  }
  ```
- Zone de mémoire partagée keyval HTTP :

  Contenu d'une zone de mémoire partagée keyval HTTP avec la méthode GET.

  Exemple :

  ```nginx
  {
    "key1" : "value1",
    "key2" : "value2",
    "key3" : "value3"
  }
  ```
- Zone de mémoire partagée keyval HTTP :

  Contenu d'une zone de mémoire partagée keyval HTTP avec les méthodes POST ou PATCH.

  Exemple :

  ```nginx
  {
    "key1" : "value1",
    "key2" : "value2",
    "key3" : {
      "value" : "value3",
      "expire" : 30000
    }
  }
  ```
- Zone de serveur stream :

  - **`processing` (`integer`)**

    Nombre de connexions clientes en cours de traitement.

  - **`connections` (`integer`)**

    Nombre total de connexions acceptées des clients.

  - **`sessions`**

    Nombre total de sessions terminées, et nombre de sessions terminées avec les codes d'état « `2xx` », « `4xx` » ou « `5xx` ».

    - **`2xx` (`integer`)**

      Nombre total de sessions terminées avec les [codes d'état](https://nginx.org/en/docs/stream/ngx_stream_core_module.html#var_status) « `2xx` ».

    - **`4xx` (`integer`)**

      Nombre total de sessions terminées avec les [codes d'état](https://nginx.org/en/docs/stream/ngx_stream_core_module.html#var_status) « `4xx` ».

    - **`5xx` (`integer`)**

      Nombre total de sessions terminées avec les [codes d'état](https://nginx.org/en/docs/stream/ngx_stream_core_module.html#var_status) « `5xx` ».

    - **`total` (`integer`)**

      Nombre total de sessions clientes terminées.

  - **`discarded` (`integer`)**

    Nombre total de connexions terminées sans création de session.

  - **`received` (`integer`)**

    Nombre total d'octets reçus des clients.

  - **`sent` (`integer`)**

    Nombre total d'octets envoyés aux clients.

  - **`ssl`**

    - **`handshakes` (`integer`)**

      Nombre total de négociations SSL réussies.

    - **`handshakes_failed` (`integer`)**

      Nombre total de négociations SSL échouées.

    - **`session_reuses` (`integer`)**

      Nombre total de réutilisations de session lors des négociations SSL.

    - **`no_common_protocol` (`integer`)**

      Nombre de poignées de main SSL échouées faute de protocole commun.

    - **`no_common_cipher` (`integer`)**

      Nombre de poignées de main SSL échouées faute de chiffrement partagé.

    - **`handshake_timeout` (`integer`)**

      Nombre de poignées de main SSL échouées pour dépassement de délai.

    - **`peer_rejected_cert` (`integer`)**

      Nombre de poignées de main SSL échouées où nginx a présenté son certificat au client, qui l'a rejeté avec un message d'alerte correspondant.

    - **`verify_failures`**

      Erreurs de vérification des certificats SSL

      - **`no_cert` (`integer`)**

        Un client n'a pas fourni le certificat requis.

      - **`expired_cert` (`integer`)**

        Un client a présenté un certificat expiré ou pas encore valide.

      - **`revoked_cert` (`integer`)**

        Un client a présenté un certificat révoqué.

      - **`other` (`integer`)**

        Autres erreurs de vérification des certificats SSL.

  Exemple :

  ```nginx
  {
    "dns" : {
      "processing" : 1,
      "connections" : 155569,
      "sessions" : {
        "2xx" : 155564,
        "4xx" : 0,
        "5xx" : 0,
        "total" : 155569
      },
      "discarded" : 0,
      "received" : 4200363,
      "sent" : 20489184,
      "ssl" : {
        "handshakes" : 76455,
        "handshakes_failed" : 432,
        "session_reuses" : 28770,
        "no_common_protocol" : 4,
        "no_common_cipher" : 2,
        "handshake_timeout" : 0,
        "peer_rejected_cert" : 0,
        "verify_failures" : {
          "no_cert" : 0,
          "expired_cert" : 2,
          "revoked_cert" : 1,
          "other" : 1
        }
      }
    }
  }
  ```
- Limitation des connexions stream :

  - **`passed` (`integer`)**

    Nombre total de connexions ni limitées ni comptées comme limitées.

  - **`rejected` (`integer`)**

    Nombre total de connexions rejetées.

  - **`rejected_dry_run` (`integer`)**

    Nombre total de connexions comptées comme rejetées en mode [simulation](https://nginx.org/en/docs/stream/ngx_stream_limit_conn_module.html#limit_conn_dry_run).

  Exemple :

  ```nginx
  {
    "passed" : 15,
    "rejected" : 0,
    "rejected_dry_run" : 2
  }
  ```
- Groupe amont stream :

  - **`peers`**

    Un tableau de :

    - **`id` (`integer`)**

      Identifiant du serveur.

    - **`server` (`string`)**

      [Adresse](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#server) du serveur.

    - **`service` (`string`)**

      Valeur du paramètre [service](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#service) de la directive [server](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#server).

    - **`name` (`string`)**

      Nom du serveur indiqué dans la directive [server](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#server).

    - **`backup` (`boolean`)**

      Booléen indiquant si le serveur est un serveur de [secours](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#backup).

    - **`weight` (`integer`)**

      [Poids](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#weight) du serveur.

    - **`state` (`string`)**

      État actuel : « `up` », « `down` », « `unavail` », « `checking` » ou « `unhealthy` ».

    - **`active` (`integer`)**

      Nombre actuel de connexions.

    - **`ssl`**

      - **`handshakes` (`integer`)**

        Nombre total de négociations SSL réussies.

      - **`handshakes_failed` (`integer`)**

        Nombre total de négociations SSL échouées.

      - **`session_reuses` (`integer`)**

        Nombre total de réutilisations de session lors des négociations SSL.

      - **`no_common_protocol` (`integer`)**

        Nombre de poignées de main SSL échouées faute de protocole commun.

      - **`handshake_timeout` (`integer`)**

        Nombre de poignées de main SSL échouées pour dépassement de délai.

      - **`peer_rejected_cert` (`integer`)**

        Nombre de poignées de main SSL échouées où nginx a présenté son certificat au serveur amont, qui l'a rejeté avec un message d'alerte correspondant.

      - **`verify_failures`**

        Erreurs de vérification des certificats SSL

        - **`expired_cert` (`integer`)**

          Un serveur amont a présenté un certificat expiré ou pas encore valide.

        - **`revoked_cert` (`integer`)**

          Un serveur amont a présenté un certificat révoqué.

        - **`hostname_mismatch` (`integer`)**

          Le certificat du serveur ne correspond pas au nom d'hôte.

        - **`other` (`integer`)**

          Autres erreurs de vérification des certificats SSL.

    - **`max_conns` (`integer`)**

      Limite [max\_conns](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#max_conns) du serveur.

    - **`connections` (`integer`)**

      Nombre total de connexions clientes transmises à ce serveur.

    - **`connect_time` (`integer`)**

      Temps moyen de connexion au serveur amont.

    - **`first_byte_time` (`integer`)**

      Temps moyen de réception du premier octet de données.

    - **`response_time` (`integer`)**

      Temps moyen de réception du dernier octet de données.

    - **`sent` (`integer`)**

      Nombre total d'octets envoyés à ce serveur.

    - **`received` (`integer`)**

      Nombre total d'octets reçus de ce serveur.

    - **`fails` (`integer`)**

      Nombre total de tentatives de communication échouées avec le serveur.

    - **`unavail` (`integer`)**

      Nombre de fois où le serveur est devenu indisponible pour les connexions client (état « `unavail` ») parce que le nombre de tentatives infructueuses a atteint le seuil [max\_fails](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#max_fails).

    - **`health_checks`**

      - **`checks` (`integer`)**

        Nombre total de requêtes de [vérification de santé](https://nginx.org/en/docs/stream/ngx_stream_upstream_hc_module.html#health_check) effectuées.

      - **`fails` (`integer`)**

        Nombre de vérifications d'état échouées.

      - **`unhealthy` (`integer`)**

        Nombre de fois où le serveur est devenu défaillant (état « `unhealthy` »).

      - **`last_passed` (`boolean`)**

        Booléen indiquant si la dernière requête de vérification de santé a réussi et passé les [tests](https://nginx.org/en/docs/stream/ngx_stream_upstream_hc_module.html#match).

    - **`downtime` (`integer`)**

      Durée totale passée par le serveur dans les états « `unavail` », « `checking` » et « `unhealthy` ».

    - **`downstart` (`string`)**

      Heure à laquelle le serveur est passé à l'état « `unavail` », « `checking` » ou « `unhealthy` », au format ISO 8601 à la milliseconde près.

    - **`selected` (`string`)**

      Heure à laquelle le serveur a été choisi pour la dernière fois pour traiter une connexion, au format ISO 8601 à la milliseconde près.

  - **`zombies` (`integer`)**

    Nombre actuel de serveurs retirés du groupe mais qui traitent encore des connexions actives.

  - **`zone` (`string`)**

    Nom de la [zone](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#zone) de mémoire partagée qui conserve la configuration et l'état d'exécution du groupe.

  Exemple :

  ```nginx
  {
    "dns" : {
      "peers" : [
        {
          "id" : 0,
          "server" : "10.0.0.1:12347",
          "name" : "10.0.0.1:12347",
          "backup" : false,
          "weight" : 5,
          "state" : "up",
          "active" : 0,
          "ssl" : {
            "handshakes" : 200,
            "handshakes_failed" : 4,
            "session_reuses" : 189,
            "no_common_protocol" : 4,
            "handshake_timeout" : 0,
            "peer_rejected_cert" : 0,
            "verify_failures" : {
              "expired_cert" : 2,
              "revoked_cert" : 1,
              "hostname_mismatch" : 2,
              "other" : 1
            }
          },
          "max_conns" : 50,
          "connections" : 667231,
          "sent" : 251946292,
          "received" : 19222475454,
          "fails" : 0,
          "unavail" : 0,
          "health_checks" : {
            "checks" : 26214,
            "fails" : 0,
            "unhealthy" : 0,
            "last_passed" : true
          },
          "downtime" : 0,
          "downstart" : "2022-06-28T11:09:21.602Z",
          "selected" : "2022-06-28T15:01:25.000Z"
        },
        {
          "id" : 1,
          "server" : "10.0.0.1:12348",
          "name" : "10.0.0.1:12348",
          "backup" : true,
          "weight" : 1,
          "state" : "unhealthy",
          "active" : 0,
          "max_conns" : 50,
          "connections" : 0,
          "sent" : 0,
          "received" : 0,
          "fails" : 0,
          "unavail" : 0,
          "health_checks" : {
            "checks" : 26284,
            "fails" : 26284,
            "unhealthy" : 1,
            "last_passed" : false
          },
          "downtime" : 262925617,
          "downstart" : "2022-06-28T11:09:21.602Z",
          "selected" : "2022-06-28T15:01:25.000Z"
        }
      ],
      "zombies" : 0,
      "zone" : "dns"
    }
  }
  ```
- Serveur amont stream :

  Paramètres configurables dynamiquement d'un [serveur](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#server) amont stream :

  - **`id` (`integer`)**

    Identifiant du serveur amont stream. Il est attribué automatiquement et ne peut pas être modifié.

  - **`server` (`string`)**

    Identique au paramètre [address](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#server) du serveur amont stream. Lors de l'ajout d'un serveur, on peut l'indiquer sous forme de nom de domaine. Les changements des adresses IP correspondantes sont alors surveillés et appliqués automatiquement à la configuration amont sans redémarrer nginx. Cela nécessite la directive [resolver](https://nginx.org/en/docs/stream/ngx_stream_core_module.html#resolver) dans le bloc « `stream` ». Voir aussi le paramètre [resolve](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#resolve) du serveur amont stream.

  - **`service` (`string`)**

    Identique au paramètre [service](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#service) du serveur amont stream. Ce paramètre ne peut pas être modifié.

  - **`weight` (`integer`)**

    Identique au paramètre [weight](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#weight) du serveur amont stream.

  - **`max_conns` (`integer`)**

    Identique au paramètre [max\_conns](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#max_conns) du serveur amont stream.

  - **`max_fails` (`integer`)**

    Identique au paramètre [max\_fails](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#max_fails) du serveur amont stream.

  - **`fail_timeout` (`string`)**

    Identique au paramètre [fail\_timeout](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#fail_timeout) du serveur amont stream.

  - **`slow_start` (`string`)**

    Identique au paramètre [slow\_start](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#slow_start) du serveur amont stream.

  - **`backup` (`boolean`)**

    Avec `true`, ajoute un serveur de [secours](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#backup). Ce paramètre ne peut pas être modifié.

  - **`down` (`boolean`)**

    Identique au paramètre [down](https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html#down) du serveur amont stream.

  - **`parent` (`string`)**

    Identifiant du serveur parent du serveur résolu. Il est attribué automatiquement et ne peut pas être modifié.

  - **`host` (`string`)**

    Nom d'hôte du serveur résolu. Il est attribué automatiquement et ne peut pas être modifié.

  Exemple :

  ```nginx
  {
    "id" : 0,
    "server" : "10.0.0.1:12348",
    "weight" : 1,
    "max_conns" : 0,
    "max_fails" : 1,
    "fail_timeout" : "10s",
    "slow_start" : 0,
    "backup" : false,
    "down" : false
  }
  ```
- Zone de mémoire partagée keyval stream :

  Contenu d'une zone de mémoire partagée keyval stream avec la méthode GET.

  Exemple :

  ```nginx
  {
    "key1" : "value1",
    "key2" : "value2",
    "key3" : "value3"
  }
  ```
- Zone de mémoire partagée keyval stream :

  Contenu d'une zone de mémoire partagée keyval stream avec les méthodes POST ou PATCH.

  Exemple :

  ```nginx
  {
    "key1" : "value1",
    "key2" : "value2",
    "key3" : {
      "value" : "value3",
      "expire" : 30000
    }
  }
  ```
- Nœud de synchronisation de zones stream :

  - **`zones`**

    Informations de synchronisation par zone de mémoire partagée.

    Une collection d'objets « Sync Zone »

  - **`status`**

    Informations de synchronisation par nœud du cluster.

    - **`bytes_in` (`integer`)**

      Nombre d'octets reçus par ce nœud.

    - **`msgs_in` (`integer`)**

      Nombre de messages reçus par ce nœud.

    - **`msgs_out` (`integer`)**

      Nombre de messages envoyés par ce nœud.

    - **`bytes_out` (`integer`)**

      Nombre d'octets envoyés par ce nœud.

    - **`nodes_online` (`integer`)**

      Nombre de pairs auxquels ce nœud est connecté.

  Exemple :

  ```nginx
  {
    "zones" : {
      "zone1" : {
        "records_pending" : 2061,
        "records_total" : 260575
      },
      "zone2" : {
        "records_pending" : 0,
        "records_total" : 14749
      }
    },
    "status" : {
      "bytes_in" : 1364923761,
      "msgs_in" : 337236,
      "msgs_out" : 346717,
      "bytes_out" : 1402765472,
      "nodes_online" : 15
    }
  }
  ```
- Zone synchronisée :

  État de synchronisation d'une zone de mémoire partagée.

  - **`records_pending` (`integer`)**

    Nombre d'enregistrements à envoyer au cluster.

  - **`records_total` (`integer`)**

    Nombre total d'enregistrements stockés dans la zone de mémoire partagée.
- Zone de résolveur :

  Statistiques des requêtes et réponses DNS par [zone de résolveur](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver_status_zone).

  - **`requests`**

    - **`name` (`integer`)**

      Nombre total de requêtes de résolution de noms en adresses.

    - **`srv` (`integer`)**

      Nombre total de requêtes de résolution d'enregistrements SRV.

    - **`addr` (`integer`)**

      Nombre total de requêtes de résolution d'adresses en noms.

  - **`responses`**

    - **`noerror` (`integer`)**

      Nombre total de réponses réussies.

    - **`formerr` (`integer`)**

      Nombre total de réponses FORMERR (`Format error`).

    - **`servfail` (`integer`)**

      Nombre total de réponses SERVFAIL (`Server failure`).

    - **`nxdomain` (`integer`)**

      Nombre total de réponses NXDOMAIN (`Host not found`).

    - **`notimp` (`integer`)**

      Nombre total de réponses NOTIMP (`Unimplemented`).

    - **`refused` (`integer`)**

      Nombre total de réponses REFUSED (`Operation refused`).

    - **`timedout` (`integer`)**

      Nombre total de requêtes ayant dépassé le délai.

    - **`unknown` (`integer`)**

      Nombre total de requêtes terminées par une erreur inconnue.

  Exemple :

  ```nginx
  {
    "resolver_zone1" : {
      "requests" : {
        "name" : 25460,
        "srv" : 130,
        "addr" : 2580
      },
      "responses" : {
        "noerror" : 26499,
        "formerr" : 0,
        "servfail" : 3,
        "nxdomain" : 0,
        "notimp" : 0,
        "refused" : 0,
        "timedout" : 243,
        "unknown" : 478
      }
    }
  }
  ```
- Licence :

  État de la licence et du signalement d'usage de l'instance NGINX Plus.

  - **`eval` (`boolean`)**

    Indique si la licence NGINX Plus est une licence d'essai.

  - **`active_till` (`integer`)**

    Horodatage Unix d'expiration de la licence.

  - **`reporting`**

    - **`healthy` (`boolean`)**

      Indique si l'état du signalement est toujours considéré comme sain malgré de récentes tentatives échouées.

    - **`fails` (`integer`)**

      Nombre de tentatives de signalement échouées, remis à zéro à chaque envoi réussi du rapport d'usage.

    - **`grace` (`integer`)**

      Nombre de secondes avant l'arrêt du traitement du trafic après une tentative de signalement échouée.

    - **`uuid` (`string`)**

      Identifiant de l'instance NGINX Plus au format UUID.

  - **`pending_renewal` (`boolean`)**

    Indique si un jeton de licence renouvelé a été [enregistré en attente](https://nginx.org/en/docs/ngx_mgmt_module.html#license_pending_token) sans être encore appliqué.

  Exemple :

  ```nginx
  {
    "eval" : false,
    "active_till" : 1749268757,
    "reporting" : {
      "healthy" : true,
      "fails" : 2,
      "grace" : 15551961,
      "uuid" : "13754cba-29fb-53e5-c32e-a6cf57c84b01"
    },
    "pending_renewal" : false
  }
  ```
- Informations du jeton de licence JWT :

  Représente l'état de la licence JWT et les métadonnées associées.

  - **`id` (`string`)**

    Identifiant unique de la licence. Exemple : `"abc123"`

  - **`type` (`string`)**

    Type de licence. Exemple : `"commercial"`

  - **`status` (`string`)**

    État courant de la licence. Exemple : `"active"`

  - **`expires` (`string`)**

    Date et heure d'expiration de la licence, au format ISO 8601. Exemple : `"2025-12-31T23:59:59Z"`

  Exemple :

  ```nginx
  {
    "id" : "abc123",
    "type" : "commercial",
    "status" : "active",
    "expires" : "2025-12-31T23:59:59Z"
  }
  ```
- Processus de travail :

  Statistiques par processus de travail.

  - **`id` (`integer`)**

    Identifiant du processus de travail.

  - **`pid` (`integer`)**

    Identifiant PID du processus de travail utilisé par le système d'exploitation.

  - **`connections`**

    Nombre de connexions acceptées, rejetées, actives et inactives par processus de travail.

    - **`accepted` (`integer`)**

      Nombre total de connexions client acceptées par le processus de travail.

    - **`dropped` (`integer`)**

      Nombre total de connexions client rejetées par le processus de travail.

    - **`active` (`integer`)**

      Nombre courant de connexions client actives traitées par le processus de travail.

    - **`idle` (`integer`)**

      Nombre de connexions client inactives actuellement traitées par le processus de travail.

  - **`http`**

    - **`requests`**

      Nombre total de requêtes client traitées par le processus de travail.

      - **`total` (`integer`)**

        Nombre total de requêtes client reçues par le processus de travail.

      - **`current` (`integer`)**

        Nombre courant de requêtes client en cours de traitement par le processus de travail.

  Exemple :

  ```nginx
  {
    "id" : 0,
    "pid" : 32212,
    "connections" : {
      "accepted" : 1,
      "dropped" : 0,
      "active" : 1,
      "idle" : 0
    },
    "http" : {
      "requests" : {
        "total" : 15,
        "current" : 1
      }
    }
  }
  ```
- Erreur :

  Objet erreur de nginx.

  - **`error`**

    - **`status` (`integer`)**

      Code d'erreur HTTP.

    - **`text` (`string`)**

      Description de l'erreur.

    - **`code` (`string`)**

      Code d'erreur interne de nginx.

  - **`request_id` (`string`)**

    Identifiant de la requête, égal à la valeur de la variable [$request\_id](https://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_id).

  - **`href` (`string`)**

    Lien vers la documentation de référence.

## Directives

- [[12-directives/api|api]]
- [[12-directives/status-zone-http-api|status_zone]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
