---
title: "health_check (ngx_http_upstream_hc_module)"
description: "Directive nginx health_check (ngx_http_upstream_hc_module) — Active les vérifications d'état périodiques des serveurs d'un groupe utilisé dans le bloc location englobant. Les paramètres facultatifs suivants sont pris en charge : - interval=time définit…"
tags: [nginx, directive, ngx_http_upstream_hc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `health_check [parameters];` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_hc_module\|ngx_http_upstream_hc_module]] |

## Utilisation

Active les vérifications d'état périodiques des serveurs d'un [[12-directives/upstream-http-upstream|groupe]] utilisé dans le bloc location englobant.

Les paramètres facultatifs suivants sont pris en charge :

- **`interval`=*time***

  définit l'intervalle entre deux vérifications consécutives ; 5 secondes par défaut.

- **`jitter`=*time***

  définit la durée dans laquelle chaque vérification est retardée aléatoirement ; par défaut, aucun retard.

- **`fails`=*number***

  définit le nombre de vérifications échouées consécutives au-delà duquel un serveur est considéré comme défaillant ; 1 par défaut.

- **`passes`=*number***

  définit le nombre de vérifications réussies consécutives au-delà duquel un serveur est considéré comme sain ; 1 par défaut.

- **`uri`=*uri***

  définit l'URI utilisé dans les requêtes de vérification ; « `/` » par défaut.

- **`mandatory` \[`persistent`\]**

  place le serveur dans l'état initial « checking » jusqu'à la fin de la première vérification (1.11.7). Les requêtes des clients ne sont pas transmises aux serveurs dans cet état. Sans ce paramètre, le serveur est initialement considéré comme sain.

  Le paramètre `persistent` (1.19.7) place le serveur dans l'état initial « up » après un rechargement s'il était considéré comme sain avant.

- **`match`=*name***

  indique le bloc `match` qui configure les tests qu'une réponse doit passer pour que la vérification réussisse. Par défaut, la réponse doit avoir un code 2xx ou 3xx.

- **`port`=*number***

  définit le port utilisé pour se connecter au serveur lors d'une vérification (1.9.7). Par défaut, c'est le port du [[12-directives/server-http-upstream|serveur]].

- **`type`=`grpc` \[`grpc_service`=*name*\] \[`grpc_status`=*code*\]**

  active les [vérifications d'état](https://github.com/grpc/grpc/blob/master/doc/health-checking.md#grpc-health-checking-protocol) périodiques d'un serveur gRPC ou d'un service gRPC précis indiqué par le paramètre facultatif `grpc_service` (1.19.5). Si le serveur ne prend pas en charge le protocole gRPC Health Checking, le paramètre facultatif `grpc_status` permet d'indiquer un [statut](https://github.com/grpc/grpc/blob/master/doc/statuscodes.md#status-codes-and-their-use-in-grpc) gRPC non nul (par exemple le code « `12` » / « `UNIMPLEMENTED` ») considéré comme sain :

  ```nginx
  health_check mandatory type=grpc grpc_status=12;
  ```

  Le paramètre `type`=`grpc` doit être indiqué après tous les autres paramètres de la directive ; `grpc_service` et `grpc_status` doivent suivre `type`=`grpc`. Ce paramètre est incompatible avec les paramètres `uri` et `match`.

- **`keepalive_time`=*time***

  active les connexions [[12-directives/keepalive|persistantes]] pour les vérifications d'état et indique la durée pendant laquelle des requêtes peuvent être traitées sur une connexion persistante (1.21.7). Par défaut, les connexions persistantes sont désactivées.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
