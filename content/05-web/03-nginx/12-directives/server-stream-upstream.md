---
title: "server (ngx_stream_upstream_module)"
description: "Directive nginx server (ngx_stream_upstream_module) — Définit l'adresse et d'autres paramètres d'un serveur. L'adresse peut être un nom de domaine ou une adresse IP avec un port obligatoire, ou un chemin de socket de domaine UNIX précédé du préfixe «…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server address [parameters];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Définit l'*adresse* et d'autres *paramètres* d'un serveur. L'adresse peut être un nom de domaine ou une adresse IP avec un port obligatoire, ou un chemin de socket de domaine UNIX précédé du préfixe « `unix:` ». Un nom de domaine qui se résout en plusieurs adresses IP définit plusieurs serveurs à la fois.

Les paramètres suivants peuvent être définis :

- **`weight`=*number***

  définit le poids du serveur ; 1 par défaut.

- **`max_conns`=*number***

  limite le *nombre* maximal de connexions simultanées vers le serveur mandaté (1.11.5). La valeur par défaut est zéro, c'est-à-dire sans limite. Si le groupe ne réside pas en [[12-directives/zone-stream-upstream|mémoire partagée]], la limite s'applique par processus de travail.

  > [!NOTE]
  > Avant la version 1.11.5, ce paramètre faisait partie de notre [abonnement commercial](https://nginx.com/products/).

- **`max_fails`=*number***

  définit le nombre de tentatives de communication infructueuses avec le serveur, survenant pendant la durée fixée par le paramètre `fail_timeout`, au-delà duquel le serveur est considéré comme indisponible pendant une durée également fixée par `fail_timeout`. Par défaut, ce nombre vaut 1. La valeur zéro désactive le décompte. Une tentative infructueuse est ici une erreur ou un dépassement de délai lors de l'établissement de la connexion avec le serveur.

- **`fail_timeout`=*time***

  définit

  - la durée pendant laquelle le nombre indiqué de tentatives échouées doit survenir pour que le serveur soit considéré comme indisponible ;
  - et la durée pendant laquelle le serveur est considéré comme indisponible.

  Par défaut, ce paramètre vaut 10 secondes.

- **`backup`**

  marque le serveur comme serveur de secours. Les connexions lui sont passées quand les serveurs principaux sont indisponibles.

  > [!NOTE]
  > Ce paramètre ne peut pas être utilisé avec les méthodes de répartition [[12-directives/hash-stream-upstream|hash]] et [[12-directives/random-stream-upstream|random]].

- **`down`**

  désigne le serveur comme indisponible en permanence.

- **`resolve`**

  surveille les changements des adresses IP correspondant au nom de domaine du serveur et modifie automatiquement la configuration amont sans redémarrer nginx. Le groupe de serveurs doit résider en [[12-directives/zone-stream-upstream|mémoire partagée]].

  Pour que ce paramètre fonctionne, la directive `resolver` doit être indiquée dans le bloc [[12-directives/resolver-stream-core|stream]] ou dans le bloc [[12-directives/resolver-stream-upstream|upstream]] correspondant.

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

En outre, les paramètres suivants sont disponibles dans le cadre de notre [abonnement commercial](https://nginx.com/products/) :

- **`slow_start`=*time***

  définit la durée (*time*) pendant laquelle le serveur fait remonter son poids de zéro à sa valeur nominale, lorsqu'un serveur défaillant redevient [[12-directives/health-check-stream-upstream-hc|sain]] ou lorsqu'il redevient disponible après avoir été considéré comme indisponible. La valeur par défaut, zéro, désactive ce démarrage progressif.

  > [!NOTE]
  > Ce paramètre ne peut pas être utilisé avec les méthodes de répartition [[12-directives/hash-stream-upstream|hash]] et [[12-directives/random-stream-upstream|random]].

> [!NOTE]
> S'il n'y a qu'un seul serveur dans un groupe, les paramètres `max_fails`, `fail_timeout` et `slow_start` sont ignorés et ce serveur n'est jamais considéré comme indisponible.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
