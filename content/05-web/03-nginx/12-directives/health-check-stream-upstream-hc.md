---
title: "health_check (ngx_stream_upstream_hc_module)"
description: "Directive nginx health_check (ngx_stream_upstream_hc_module) — Active les vérifications de santé périodiques des serveurs d'un groupe. Les paramètres facultatifs suivants sont pris en charge : - interval=time définit l'intervalle entre deux vérifications…"
tags: [nginx, directive, ngx_stream_upstream_hc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `health_check [parameters];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_hc_module\|ngx_stream_upstream_hc_module]] |

## Utilisation

Active les vérifications de santé périodiques des serveurs d'un [[12-directives/upstream-stream-upstream|groupe]].

Les paramètres facultatifs suivants sont pris en charge :

- **`interval`=*time***

  définit l'intervalle entre deux vérifications consécutives ; 5 secondes par défaut.

- **`jitter`=*time***

  définit la durée dans laquelle chaque vérification est retardée aléatoirement ; par défaut, aucun retard.

- **`fails`=*number***

  définit le nombre de vérifications échouées consécutives au-delà duquel un serveur est considéré comme défaillant ; 1 par défaut.

- **`passes`=*number***

  définit le nombre de vérifications réussies consécutives au-delà duquel un serveur est considéré comme sain ; 1 par défaut.

- **`mandatory` \[`persistent`\]**

  place initialement le serveur à l'état « checking » jusqu'à la fin de la première vérification (1.11.7). Les connexions client ne sont pas passées aux serveurs à l'état « checking ». Sans ce paramètre, le serveur est initialement considéré comme sain.

  Le paramètre `persistent` (1.21.1) place le serveur à l'état initial « up » après un rechargement s'il était considéré comme sain avant celui-ci.

- **`match`=*name***

  indique le bloc `match` qui configure les tests qu'une connexion réussie doit passer pour que la vérification réussisse. Par défaut, en TCP, seule la possibilité d'établir une connexion TCP avec le serveur est vérifiée. En UDP, on attend l'absence de message ICMP « `Destination Unreachable` » en réponse à la chaîne envoyée « `nginx health check` ».

  > [!NOTE]
  > Avant la version 1.11.7, la vérification UDP exigeait par défaut un bloc match avec les paramètres send et expect.

- **`port`=*number***

  définit le port utilisé pour se connecter au serveur lors d'une vérification (1.9.7). Par défaut, c'est le port du [[12-directives/server-stream-upstream|serveur]].

- **`udp`**

  indique que le protocole `UDP` doit être utilisé pour les vérifications au lieu du protocole `TCP` par défaut (1.9.13).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
