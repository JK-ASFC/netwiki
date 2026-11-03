---
title: "server (ngx_http_upstream_module)"
description: "Directive nginx server (ngx_http_upstream_module) — Définit l'adresse (address) et les autres paramètres (parameters) d'un serveur. L'adresse peut être un nom de domaine ou une adresse IP, avec un port facultatif, ou le chemin d'un socket de domaine…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server address [parameters];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Définit l'adresse (*address*) et les autres paramètres (*parameters*) d'un serveur. L'adresse peut être un nom de domaine ou une adresse IP, avec un port facultatif, ou le chemin d'un socket de domaine UNIX précédé du préfixe « `unix:` ». Sans port, le port 80 est utilisé. Un nom de domaine qui se résout en plusieurs adresses IP définit plusieurs serveurs à la fois.

Les paramètres suivants peuvent être définis :

- **`weight`=*number***

  définit le poids du serveur ; 1 par défaut.

- **`max_conns`=*number***

  limite le nombre (*number*) maximal de connexions actives simultanées vers le serveur mandaté (1.11.5). La valeur par défaut, zéro, signifie qu'il n'y a pas de limite. Si le groupe de serveurs n'est pas en [[12-directives/zone-http-upstream|mémoire partagée]], la limite s'applique à chaque processus de travail.

  > [!NOTE]
  > Si les connexions [[12-directives/keepalive|persistantes inactives]], plusieurs [[12-directives/worker-processes|processus de travail]] et la [[12-directives/zone-http-upstream|mémoire partagée]] sont activés, le nombre total de connexions actives et inactives vers le serveur mandaté peut dépasser la valeur `max_conns`.

  > [!NOTE]
  > De la version 1.5.9 à la version 1.11.5, ce paramètre était disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`max_fails`=*number***

  définit le nombre de tentatives de communication échouées avec le serveur, survenues pendant la durée fixée par le paramètre `fail_timeout`, au-delà duquel le serveur est considéré comme indisponible, pendant une durée également fixée par `fail_timeout`. Par défaut, ce nombre est 1. La valeur zéro désactive le décompte des tentatives. Ce qui est considéré comme une tentative échouée est défini par les directives [[12-directives/proxy-next-upstream-http-proxy|proxy_next_upstream]], [[12-directives/fastcgi-next-upstream|fastcgi_next_upstream]], [[12-directives/uwsgi-next-upstream|uwsgi_next_upstream]], [[12-directives/scgi-next-upstream|scgi_next_upstream]], [[12-directives/memcached-next-upstream|memcached_next_upstream]] et [[12-directives/grpc-next-upstream|grpc_next_upstream]].

- **`fail_timeout`=*time***

  définit

  - la durée pendant laquelle le nombre indiqué de tentatives échouées doit survenir pour que le serveur soit considéré comme indisponible ;
  - et la durée pendant laquelle le serveur est considéré comme indisponible.

  Par défaut, ce paramètre vaut 10 secondes.

- **`backup`**

  désigne le serveur comme serveur de secours. Il reçoit les requêtes lorsque les serveurs principaux sont indisponibles.

  > [!NOTE]
  > Ce paramètre ne peut pas être utilisé avec les méthodes de répartition [[12-directives/hash-http-upstream|hash]], [[12-directives/ip-hash|ip_hash]] et [[12-directives/random-http-upstream|random]].

- **`down`**

  désigne le serveur comme indisponible en permanence.

- **`resolve`**

  surveille les changements des adresses IP correspondant au nom de domaine du serveur et modifie automatiquement la configuration du groupe amont sans redémarrer nginx (1.5.12). Le groupe de serveurs doit être en [[12-directives/zone-http-upstream|mémoire partagée]].

  Pour que ce paramètre fonctionne, la directive `resolver` doit être indiquée dans le bloc [[12-directives/resolver-http-core|http]] ou dans le bloc [[12-directives/resolver-http-upstream|upstream]] correspondant.

  > [!NOTE]
  > Avant la version 1.27.3, ce paramètre n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`service`=*name***

  active la résolution des enregistrements DNS [SRV](https://datatracker.ietf.org/doc/html/rfc2782) et définit le nom (*name*) du service (1.9.13). Pour que ce paramètre fonctionne, il faut indiquer le paramètre `resolve` pour le serveur et un nom d'hôte sans numéro de port.

  Si le nom du service ne contient pas de point (« `.` »), le nom conforme à la [RFC](https://datatracker.ietf.org/doc/html/rfc2782) est construit et le protocole TCP est ajouté au préfixe du service. Par exemple, pour rechercher l'enregistrement SRV `_http._tcp.backend.example.com`, il faut indiquer la directive :

  ```nginx
  server backend.example.com service=http resolve;
  ```

  Si le nom du service contient un ou plusieurs points, le nom est construit en joignant le préfixe du service et le nom du serveur. Par exemple, pour rechercher les enregistrements SRV `_http._tcp.backend.example.com` et `server1.backend.example.com`, il faut indiquer les directives :

  ```nginx
  server backend.example.com service=_http._tcp resolve;
  server example.com service=server1.backend resolve;
  ```

  Les enregistrements SRV de plus haute priorité (ceux qui partagent la plus petite valeur de priorité) deviennent les serveurs principaux, les autres des serveurs de secours. Si le paramètre `backup` est indiqué pour le serveur, les enregistrements de haute priorité deviennent des serveurs de secours et les autres sont ignorés.

  > [!NOTE]
  > Avant la version 1.27.3, ce paramètre n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`route`=*string***

  définit le nom de route du serveur.

  > [!NOTE]
  > Avant la version 1.29.6, ce paramètre n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`drain`**

  met le serveur en mode « vidage » (*draining*, 1.13.6). Dans ce mode, seules les requêtes [[12-directives/sticky|liées]] au serveur lui sont transmises.

  > [!NOTE]
  > Avant la version 1.13.6, ce paramètre ne pouvait être modifié qu'avec le module [[11-modules/02-http/ngx_http_api_module|API]].

  > [!NOTE]
  > Avant la version 1.29.6, ce paramètre n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

En outre, les paramètres suivants sont disponibles dans le cadre de notre [abonnement commercial](https://nginx.com/products/) :

- **`slow_start`=*time***

  définit la durée (*time*) pendant laquelle le serveur fait remonter son poids de zéro à sa valeur nominale, lorsqu'un serveur défaillant redevient [[12-directives/health-check-http-upstream-hc|sain]] ou lorsqu'il redevient disponible après avoir été considéré comme indisponible. La valeur par défaut, zéro, désactive ce démarrage progressif.

  > [!NOTE]
  > Ce paramètre ne peut pas être utilisé avec les méthodes de répartition [[12-directives/hash-http-upstream|hash]], [[12-directives/ip-hash|ip_hash]] et [[12-directives/random-http-upstream|random]].

> [!NOTE]
> S'il n'y a qu'un seul serveur dans un groupe, les paramètres `max_fails`, `fail_timeout` et `slow_start` sont ignorés et ce serveur n'est jamais considéré comme indisponible.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
