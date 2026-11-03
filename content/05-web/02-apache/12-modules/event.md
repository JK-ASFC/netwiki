---
title: "event"
description: "Module Apache event — Une variante du MPM worker conçue pour ne mobiliser des threads que pour les connexions en cours de traitement. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, event]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Une variante du MPM worker conçue pour ne mobiliser des threads que pour les connexions en cours de traitement |
| **Statut** | MPM |
| **Identificateur** | `mpm_event_module` |
| **Fichier source** | `event.c` |

## Sommaire

Le module multi-processus (MPM) [[12-modules/event|event]] est conçu pour permettre le traitement d'un nombre accru de requêtes simultanées en déléguant certaines tâches aux threads d'écoute, libérant par là-même les threads de travail et leur permettant de traiter les nouvelles requêtes.

Pour utiliser le MPM [[12-modules/event|event]], ajoutez `--with-mpm=event` aux arguments du script [[10-commandes/configure|configure]] lorsque vous compilez le programme [[10-commandes/httpd|httpd]].

Lorsque ce module est construit en tant que module DSO, il peut être chargé à l’aide de la commande :

```apache
LoadModule mpm_event_module modules/mod_mpm_event.so
```

## Relations avec le MPM Worker

Le MPM [[12-modules/event|event]] s'inspire du MPM [[12-modules/worker|worker]] qui implémente un serveur hybride multi-processus et multi-threads. Un processus de contrôle unique (le parent) est chargé de lancer des processus enfants. Chaque processus enfant crée un nombre de threads serveurs défini via la directive [[13-directives/threadsperchild|ThreadsPerChild]], ainsi qu'un thread d'écoute qui surveille les requêtes entrantes et les distribue aux threads de travail pour traitement au fur et à mesure de leur arrivée.

Les directives de configuration à l'exécution sont identiques à celles que propose le MPM [[12-modules/worker|worker]], avec l'unique addition de la directive `AsyncRequestWorkerFactor`.

## Comment tout cela fonctionne

Ce module MPM tente de résoudre le "problème keep alive" de HTTP. Lorsqu'un client a effectué une première requête, il peut garder la connexion ouverte et envoyer les requêtes suivantes en utilisant le même socket, ce qui diminue considérablement la charge qui aurait été induite par la création de nouvelles connexions TCP. Cependant, le fonctionnement du serveur HTTP Apache impose de réserver un couple processus enfant/thread pour attendre les données en provenance du client, ce qui présente certains inconvénients. Pour résoudre ce problème, le MPM Event utilise un thread d'écoute dédié pour chaque processus pour gérer les sockets d'écoute, tous les sockets qui sont dans un état de connexion persistante, les sockets où les filtres de gestionnaire et de protocole ont fait leur travail, et ceux pour lesquels la seule chose restant à faire est l'envoi des données au client.

Cette nouvelle architecture, en exploitant les sockets non blocants et les fonctionnalités des noyaux modernes mis en valeur par APR (comme epoll de Linux), n'a plus besoin du [[13-directives/mutex|Mutex]] `mpm-accept` pour éviter le problème de "thundering herd".

La directive `AsyncRequestWorkerFactor` permet de définir le nombre total de connexions qu'un bloc processus/thread peut gérer.

### Connexions asynchrones

Avec les MPM précédents, les connexions asynchrones nécessitaient un thread de travail dédié, mais ce n'est plus le cas avec le MPM Event. La page d'état de [[12-modules/mod_status|mod_status]] montre de nouvelles colonnes dans la section "Async connections" :

**Writing**

Lors de l'envoi de la réponse au client, il peut arriver que le tampon d'écriture TCP soit plein si la connexion est trop lente. Si cela se produit, une instruction `write()` vers le socket renvoie en général `EWOULDBLOCK` ou `EAGAIN` pour que l'on puisse y écrire à nouveau après un certain temps d'inactivité. Le thread de travail qui utilise le socket doit alors être en mesure de récupérer la tâche en attente et la restituer au thread d'écoute qui, à son tour, la réattribuera au premier thread de travail disponible, lorsqu'un évènement sera généré pour le socket (par exemple, "il est maintenant possible d'écrire dans le socket"). Veuillez vous reporter à la section à propos des limitations pour plus de détails.

**Keep-alive**

La gestion des connexions persistantes constitue la principale amélioration par rapport au MPM Worker. Lorsqu'un thread de travail a terminé l'envoi d'une réponse à un client, il peut restituer la gestion du socket au thread d'écoute, qui à son tour va attendre un évènement en provenance du système d'exploitation comme "le socket est lisible". Si une nouvelle requête arrive en provenance du client, le thread d'écoute l'attribuera au premier thread de travail disponible. Inversement, si le délai [[13-directives/keepalivetimeout|KeepAliveTimeout]] est atteint, le socket sera fermé par le thread d'écoute. Les threads de travail n'ont donc plus à s'occuper des sockets inactifs et ils peuvent être réutilisés pour traiter d'autres requêtes.

**Closing**

Parfois, le MPM doit effectuer une fermeture progressive, c'est à dire envoyer au client une erreur survenue précédemment alors que ce dernier est en train de transmettre des données à httpd. Envoyer la réponse et fermer immédiatement la connexion n'est pas une bonne solution car le client (qui est encore en train d'envoyer le reste de la requête) verrait sa connexion réinitialisée et ne pourrait pas lire la réponse de httpd. La fermeture progressive est limitée dans le temps, mais elle peut tout de même être assez longue, si bien qu'elle est confiée à un thread de travail (y compris les procédures d'arrêt et la fermeture effective du socket). A partir de la version 2.4.28, c'est aussi le cas lorsque des connexions finissent par dépasser leur délai d'attente (le thread d'écoute ne gère jamais les connexions, si ce n'est attendre et dispatcher les évènements qu'elles génèrent).

Ces améliorations sont disponible pour les connexions HTTP ou HTTPS.

### Arrêt de processus en douceur et utilisation du scoreboard

Ce MPM présentait dans le passé des limitations de montée en puissance qui provoquaient l'erreur suivante : "**scoreboard is full, not at MaxRequestWorkers**". La directive [[13-directives/maxrequestworkers|MaxRequestWorkers]] permet de limiter le nombre de requêtes pouvant être servies simultanément à un moment donné ainsi que le nombre de processus autorisés ([[13-directives/maxrequestworkers|MaxRequestWorkers]] / [[13-directives/threadsperchild|ThreadsPerChild]]), alors que le scoreboard représente l'ensemble des processus en cours d'exécution et l'état de leurs threads de travail. Si le scoreboard est plein (autrement dit si aucun des threads n'est dans un état inactif) et si le nombre de requêtes actives servies est inférieur à [[13-directives/maxrequestworkers|MaxRequestWorkers]], cela signifie que certains d'entre eux bloquent les nouvelles requêtes qui pourraient être servies et sont en l'occurrence mises en attente (dans la limite de la valeur imposée par la directive [[13-directives/listenbacklog|ListenBacklog]]). La plupart du temps, ces threads sont bloqués dans un état d'arrêt en douceur car ils attendent de terminer leur travail sur une connexion TCP pour s'arrêter et ainsi libérer une entrée dans le scoreboard (par exemple dans le cas du traitement des requêtes de longue durée, des clients lents ou des connexions en keep-alive). Voici deux scénarios courants :

- Pendant un [[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|graceful restart]], le processus parent demande à tous ses processus enfants de terminer leur travail et de s'arrêter pendant qu'il recharge la configuration et lance de nouveaux processus. Si les processus existants continuent de s'exécuter pendant un certain temps avant de s'arrêter, le scoreboard sera partiellement occupé jusqu'à ce que les entrées correspondantes soient libérées.
- Lorsque la charge du serveur diminue suffisamment pour que httpd commence à stopper certains processus (par exemple pour respecter la valeur de la directive [[13-directives/maxsparethreads|MaxSpareThreads]]). Cette situation est problèmatique car lorsque la charge augmente à nouveau, httpd va essayer de lancer de nouveaux processus. Si cette situation se répète, le nombre de processus peut augmenter sensiblement, aboutissant à un mélange d'anciens processus tentant de s'arrêter et de nouveaux processus tentant d'effectuer un travail quelconque.

A partir de la version 2.4.24, mpm-event est plus intelligent et peut traiter les arrêts graceful de manière plus efficace. Voici certaines de ces améliorations :

- Utilisation de toutes les entrées du scoreboard dans la limite de la valeur définie par [[13-directives/serverlimit|ServerLimit]]. Les directives [[13-directives/maxrequestworkers|MaxRequestWorkers]] et [[13-directives/threadsperchild|ThreadsPerChild]] permettent de limiter le nombre de processus actifs, alors que la directive [[13-directives/serverlimit|ServerLimit]] prend aussi en compte les proccessus en arrêt graceful pour permettre l'utilisation d'entrées supplémentaires du scoreboard en cas de besoin. L'idée consiste à utiliser [[13-directives/serverlimit|ServerLimit]] pour indiquer à httpd conbien de processus supplémentaires seront tolérés avant d'atteindre les limites imposées par les ressources du système.
- Les processus en arrêt graceful doivent fermer leurs connexions en keep-alive.
- Lors d'un arrêt graceful, s'il y a plus de threads de travail en cours d'exécution que de connexions ouvertes pour un processus donné, ces threads sont arrêtés afin de libérer les ressources plus vite (ce qui peut s'avérer nécessaire pour lancer de nouveaux processus).
- Si le scoreboard est plein, empêche d'arrêter d'autres processus en mode graceful afin de réduire la charge jusqu'à ce que tous les anciens processus soient arrêtés (sinon la situation empirerait lors d'une remontée en charge).

Le comportement décrit dans le dernier point est bien visible via [[12-modules/mod_status|mod_status]] dans la table des connexions avec les deux nouvelles colonnes "Slot" et "Stopping". La première indique le PID et la seconde si le processus est en cours d'arrêt ou non ; l'état supplémentaire "Yes (old gen)" indique un processus encore en exécution après un redémarrage graceful.

### Limitations

La gestion améliorée des connexions peut ne pas fonctionner pour certains filtres de connexion qui se sont déclarés eux-mêmes incompatibles avec le MPM Event. Dans ce cas, le MPM Event réadoptera le comportement du MPM [[12-modules/worker|worker]] et réservera un thread de travail par connexion. Notez que tous les modules inclus dans la distribution du serveur httpd sont compatibles avec le MPM Event.

Une restriction similaire apparaît lorsqu'une requête utilise un filtre en sortie qui doit pouvoir lire et/ou modifier la totalité du corps de la réponse. Si la connexion avec le client se bloque pendant que le filtre traite les données, et si la quantité de données produites par le filtre est trop importante pour être stockée en mémoire, le thread utilisé pour la requête n'est pas libéré pendant que httpd attend que les données soient transmises au client.
Pour illustrer ce cas de figure, nous pouvons envisager les deux situations suivantes : servir une ressource statique (comme un fichier CSS) ou servir un contenu issu d'un programme FCGI/CGI ou d'un serveur mandaté. La première situation est prévisible ; en effet, le MPM Event a une parfaite visibilité sur la fin du contenu, et il peut utiliser les évènements : le thread de travail qui sert la réponse peut envoyer les premiers octets jusqu'à ce que `EWOULDBLOCK` ou `EAGAIN` soit renvoyé, et déléguer le reste de la réponse au thread d'écoute. Ce dernier en retour attend un évènement sur le socket, et délègue le reste de la réponse au premier thread de travail disponible. Dans la deuxième situation par contre (FCGI/CGI/contenu mandaté), le MPM n'a pas de visibilité sur la fin de la réponse, et le thread de travail doit terminer sa tâche avant de rendre le contrôle au thread d'écoute. La seule solution consisterait alors à stocker la réponse en mémoire, mais ce ne serait pas l'option la plus sure en matière de stabilité du serveur et d'empreinte mémoire.

### Matériel d'arrière-plan

Le modèle event a été rendu possible par l'introduction de nouvelles APIs dans les systèmes d'exploitation supportés :

- epoll (Linux)
- kqueue (BSD)
- event ports (Solaris)

Avant que ces APIs soient mises à disposition, les APIs traditionnelles `select` et `poll` devaient être utilisées. Ces APIs deviennent lentes si on les utilise pour gérer de nombreuses connexions ou si le jeu de connexions possède un taux de renouvellement élevé. Les nouvelles APIs permettent de gérer beaucoup plus de connexions et leur performances sont meilleures lorsque le jeu de connexions à gérer change fréquemment. Ces APIs ont donc rendu possible l'écriture le MPM Event qui est mieux adapté à la situation HTTP typique où de nombreuses connexions sont inactives.

Le MPM Event suppose que l'implémentation de `apr_pollset` sous-jacente est raisonnablement sure avec l'utilisation des threads (threadsafe). Ceci évite au MPM de devoir effectuer trop verrouillages de haut niveau, ou d'avoir à réveiller le thread d'écoute pour lui envoyer un socket keep-alive. Ceci n'est possible qu'avec KQueue et EPoll.

## Prérequis

Ce MPM dépend des opérations atomiques compare-and-swap d'APR pour la synchronisation des threads. Si vous compilez pour une plate-forme x86 et n'avez pas besoin du support 386, ou si vous compilez pour une plate-forme SPARC et n'avez pas besoin du support pre-UltraSPARC, ajoutez `--enable-nonportable-atomics=yes` aux arguments du script [[10-commandes/configure|configure]]. Ceci permettra à APR d'implémenter les opérations atomiques en utilisant des instructions performantes indisponibles avec les processeurs plus anciens.

Ce MPM ne fonctionne pas de manière optimale sur les plates-formes plus anciennes qui ne gèrent pas correctement les threads, mais ce problème est sans objet du fait du prérequis concernant EPoll ou KQueue.

- Pour utiliser ce MPM sous FreeBSD, la version 5.3 ou supérieure de ce système est recommandée. Il est cependant possible d'exécuter ce MPM sous FreeBSD 5.2.1 si vous utilisez `libkse` (voir `man libmap.conf`).
- Pour NetBSD, il est recommander d'utiliser la version 2.0 ou supérieure.
- Pour Linux, un noyau 2.6 est recommandé. Il faut aussi s'assurer que votre version de `glibc` a été compilée avec le support pour EPoll.

## Directives

- [[13-directives/asyncrequestworkerfactor|AsyncRequestWorkerFactor]]
- [[13-directives/coredumpdirectory|CoreDumpDirectory]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/enableexceptionhook|EnableExceptionHook]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/group|Group]] (définie dans [[12-modules/mod_unixd|mod_unixd]])
- [[13-directives/listen|Listen]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listenbacklog|ListenBackLog]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/sendbuffersize|SendBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxrequestworkers|MaxRequestWorkers]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxmemfree|MaxMemFree]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxsparethreads|MaxSpareThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/minsparethreads|MinSpareThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/pidfile|PidFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/scoreboardfile|ScoreBoardFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/serverlimit|ServerLimit]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/startservers|StartServers]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/threadlimit|ThreadLimit]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/threadsperchild|ThreadsPerChild]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/threadstacksize|ThreadStackSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/user|User]] (définie dans [[12-modules/mod_unixd|mod_unixd]])

## Voir aussi

- [[11-guides/01-generalites/modules-multi-processus-mpms|Modules multi-processus (MPMs)]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
