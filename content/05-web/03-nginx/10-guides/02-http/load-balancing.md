---
title: "Utiliser nginx comme répartiteur de charge HTTP"
description: "Nginx — Utiliser nginx comme répartiteur de charge HTTP. La répartition de charge entre plusieurs instances d'une application est une technique courante pour optimiser l'utilisation des ressources, maximiser le débit, réduire la latence et assurer la tolérance aux pannes."
tags: [nginx, guide]
icon: book-open
---

## Introduction

La répartition de charge entre plusieurs instances d'une application est une technique courante pour optimiser l'utilisation des ressources, maximiser le débit, réduire la latence et assurer la tolérance aux pannes.

nginx peut servir de répartiteur de charge HTTP très efficace pour distribuer le trafic entre plusieurs serveurs d'applications et améliorer les performances, l'évolutivité et la fiabilité des applications web.

## Méthodes de répartition de charge

nginx prend en charge les mécanismes (ou méthodes) de répartition de charge suivants :

- tourniquet (*round-robin*) : les requêtes sont distribuées à tour de rôle entre les serveurs d'applications ;

- moins de connexions (*least-connected*) : la requête suivante est attribuée au serveur ayant le moins de connexions actives ;

- hachage d'IP (*ip-hash*) : une fonction de hachage détermine quel serveur choisir pour la requête suivante (selon l'adresse IP du client).

## Configuration de répartition par défaut

La configuration la plus simple de répartition de charge avec nginx peut ressembler à ceci :

```
http {
    upstream myapp1 {
        server srv1.example.com;
        server srv2.example.com;
        server srv3.example.com;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://myapp1;
        }
    }
}
```

Dans l'exemple ci-dessus, trois instances de la même application tournent sur srv1 à srv3. Si la méthode de répartition n'est pas configurée explicitement, c'est le tourniquet qui s'applique. Toutes les requêtes sont [[12-directives/proxy-pass-http-proxy|relayées]] vers le groupe de serveurs myapp1, et nginx applique la répartition de charge HTTP pour distribuer les requêtes.

Le mandataire inverse de nginx assure la répartition de charge pour HTTP, HTTPS, FastCGI, uwsgi, SCGI, memcached et gRPC.

Pour répartir la charge en HTTPS au lieu de HTTP, il suffit d'utiliser « https » comme protocole.

Pour répartir la charge en FastCGI, uwsgi, SCGI, memcached ou gRPC, utilisez respectivement les directives [[12-directives/fastcgi-pass|fastcgi_pass]], [[12-directives/uwsgi-pass|uwsgi_pass]], [[12-directives/scgi-pass|scgi_pass]], [[12-directives/memcached-pass|memcached_pass]] et [[12-directives/grpc-pass|grpc_pass]].

## Répartition selon le moins de connexions

Une autre règle de répartition est celle du moins de connexions. Elle permet de répartir plus équitablement la charge entre les instances lorsque certaines requêtes prennent plus de temps.

Avec cette méthode, nginx évite de surcharger un serveur occupé et distribue les nouvelles requêtes à un serveur moins chargé.

Cette méthode s'active avec la directive [[12-directives/least-conn-http-upstream|least_conn]] dans la configuration du groupe de serveurs :

```
upstream myapp1 {
    least_conn;
    server srv1.example.com;
    server srv2.example.com;
    server srv3.example.com;
}
```

## Répartition selon le temps de réponse

Une autre règle de répartition est celle du moindre temps (*least-time*). Elle choisit le serveur ayant le temps de réponse moyen le plus court et le moins de connexions actives, en tenant compte des requêtes en cours.

Avec cette méthode, nginx choisit le serveur selon le paramètre indiqué dans la directive [[12-directives/least-time-http-upstream|least_time]] :

- `header` : durée de réception du premier octet du serveur ;

- `last_byte` : durée de réception de la réponse complète du serveur ;

- `last_byte inflight` : durée de réception de la réponse complète du serveur, en tenant compte des requêtes non terminées.

Cette méthode s'active avec la directive [[12-directives/least-time-http-upstream|least_time]] dans la configuration du groupe de serveurs :

```
upstream myapp1 {
    least_time header;
    server srv1.example.com;
    server srv2.example.com;
    server srv3.example.com;
}
```

## Persistance de session

Avec le tourniquet ou le moins de connexions, chaque requête successive d'un client peut être distribuée à un serveur différent. Rien ne garantit que le même client sera toujours dirigé vers le même serveur.

S'il faut lier un client à un serveur d'applications particulier (autrement dit, rendre sa session « collante » ou « persistante » en choisissant toujours le même serveur), on peut utiliser le mécanisme de hachage d'IP.

Avec le hachage d'IP, l'adresse IP du client sert de clé de hachage pour déterminer quel serveur du groupe doit traiter ses requêtes. Cette méthode garantit que les requêtes d'un même client sont toujours dirigées vers le même serveur, sauf si celui-ci est indisponible.

Pour configurer le hachage d'IP, il suffit d'ajouter la directive [[12-directives/ip-hash|ip_hash]] à la configuration du groupe de serveurs (upstream) :

```
upstream myapp1 {
    ip_hash;
    server srv1.example.com;
    server srv2.example.com;
    server srv3.example.com;
}
```

## Répartition pondérée

On peut aussi influencer davantage les algorithmes de répartition de nginx en utilisant des poids pour les serveurs.

Dans les exemples ci-dessus, aucun poids n'est configuré : tous les serveurs sont considérés comme également aptes pour une méthode de répartition donnée.

Avec le tourniquet en particulier, cela signifie aussi une répartition à peu près égale des requêtes entre les serveurs, à condition qu'il y ait assez de requêtes, qu'elles soient traitées de façon uniforme et qu'elles se terminent assez vite.

Lorsque le paramètre [[12-directives/server-http-upstream|weight]] est indiqué pour un serveur, le poids est pris en compte dans la décision de répartition.

```
upstream myapp1 {
    server srv1.example.com weight=3;
    server srv2.example.com;
    server srv3.example.com;
}
```

Avec cette configuration, toutes les 5 nouvelles requêtes sont réparties ainsi entre les instances : 3 vers srv1, une vers srv2 et une autre vers srv3.

Dans les versions récentes de nginx, on peut de même utiliser des poids avec les méthodes du moins de connexions et du hachage d'IP.

## Vérifications d'état

Le mandataire inverse de nginx comprend des vérifications d'état passives (*in-band*) des serveurs. Si la réponse d'un serveur échoue avec une erreur, nginx marque ce serveur comme défaillant et évite de le choisir pour les requêtes suivantes pendant un certain temps.

La directive [[12-directives/server-http-upstream|max_fails]] définit le nombre de tentatives de communication échouées consécutives qui doivent survenir pendant [[12-directives/server-http-upstream|fail_timeout]]. Par défaut, [[12-directives/server-http-upstream|max_fails]] vaut 1 ; à 0, les vérifications d'état sont désactivées pour ce serveur. Le paramètre [[12-directives/server-http-upstream|fail_timeout]] définit aussi la durée pendant laquelle le serveur reste marqué comme défaillant. Une fois ce délai écoulé après la défaillance, nginx commence à sonder prudemment le serveur avec les requêtes réelles des clients. Si les sondes réussissent, le serveur est de nouveau marqué comme disponible.

## Pour aller plus loin

D'autres directives et paramètres contrôlent la répartition de charge dans nginx, par exemple [[12-directives/proxy-next-upstream-http-proxy|proxy_next_upstream]], [[12-directives/server-http-upstream|backup]], [[12-directives/server-http-upstream|down]] et [[12-directives/keepalive|keepalive]]. Pour plus d'informations, consultez notre [documentation de référence](https://nginx.org/en/docs/).

Enfin, la répartition de charge applicative, les vérifications d'état applicatives, la surveillance de l'activité et la reconfiguration à chaud des groupes de serveurs sont disponibles avec nos abonnements payants NGINX Plus.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
