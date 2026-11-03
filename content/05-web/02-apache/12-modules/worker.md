---
title: "worker"
description: "Module Apache worker — Module multi-processus implémentant un serveur web hybride multi-processus multi-thread. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, worker]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module multi-processus implémentant un serveur web hybride multi-processus multi-thread |
| **Statut** | MPM |
| **Identificateur** | `mpm_worker_module` |
| **Fichier source** | `worker.c` |

## Sommaire

Ce module multi-processus (MPM) implémente un serveur hybride multi-processus multi-thread. En utilisant les threads pour servir les requêtes, il peut en traiter un grand nombre tout en consommant moins de ressources qu'un serveur à base de processus. Cependant, il conserve une grande partie de la stabilité d'un serveur à base de processus en maintenant plusieurs processus disponibles, chacun de ces derniers possédant de nombreux threads.

Les directives les plus importantes qui permettent de contrôler ce MPM sont [[13-directives/threadsperchild|ThreadsPerChild]], qui définit le nombre de threads lancés par chaque processus enfant et [[13-directives/maxrequestworkers|MaxRequestWorkers]], qui définit le nombre global maximum de threads qui peuvent être lancés.

Lorsqu’il est construit en tant que module DSO, ce module peut être chargé avec la commande :

```apache
LoadModule mpm_worker_module modules/mod_mpm_worker.so
```

## Comment ça marche

Un processus de contrôle unique (le parent) a pour tâche de lancer les processus enfants. Chaque processus enfant crée un nombre fixe de threads serveurs selon la valeur de la directive [[13-directives/threadsperchild|ThreadsPerChild]], ainsi qu'un thread chargé d'attendre les connexions et de les passer à un thread serveur pour traitement au fur et à mesure de leur arrivée.

Le serveur HTTP Apache essaie toujours de maintenir un jeu de threads serveurs inactifs ou *en réserve*, qui se tiennent prêts à traiter les requêtes entrantes. De cette façon, les clients n'ont pas besoin d'attendre la création d'un nouveau thread ou d'un nouveau processus pour que leurs requêtes puissent être traitées. Le nombre de processus lancés initialement est défini par la directive [[13-directives/startservers|StartServers]]. En cours de fonctionnement, le serveur évalue le nombre total de threads inactifs dans tous les processus, et en crée ou en arrête de façon à maintenir ce nombre à l'intérieur des limites définies par les directives [[13-directives/minsparethreads|MinSpareThreads]] et [[13-directives/maxsparethreads|MaxSpareThreads]]. Comme ce module s'auto-contrôle de manière efficace, on peut en général conserver les valeurs par défaut. Le nombre maximum de clients pouvant être servis simultanément (c'est à dire le nombre global maximum de threads pour tous les processus) est défini par la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]]. Le nombre maximum de processus enfants actifs est défini par la valeur de la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]] divisée par la valeur de la directive [[13-directives/threadsperchild|ThreadsPerChild]].

Deux directives permettent de fixer des limites absolues pour le nombre de processus enfants actifs et le nombre de threads serveurs par processus enfant, et ne peuvent être modifiées qu'en arrêtant complètement le serveur et en le démarrant à nouveau. La valeur de la directive [[13-directives/serverlimit|ServerLimit]] constitue une limite absolue pour le nombre de processus enfants actifs, et doit être supérieure ou égale à la valeur de la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]] divisée par la valeur de la directive [[13-directives/threadsperchild|ThreadsPerChild]]. La valeur de la directive [[13-directives/threadlimit|ThreadLimit]] constitue une limite absolue pour le nombre de threads par processus enfant, et doit être supérieure ou égale à la valeur de la directive [[13-directives/threadsperchild|ThreadsPerChild]].

En plus du jeu de processus enfants actifs, il peut exister quelques processus enfants en cours d'arrêt, mais dont au moins un thread serveur est encore en train de traiter une connexion client existante. Il peut subsister en théorie jusqu'à [[13-directives/maxrequestworkers|MaxRequestWorkers]] processus en cours d'arrêt, bien qu'en réalité, ce nombre sera en général beaucoup plus petit. Ce comportement peut être évité en désactivant l'arrêt de processus enfants individuels de la manière suivante :

- définir la valeur de [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] à zéro
- Définir la valeur de [[13-directives/maxsparethreads|MaxSpareThreads]] à la même valeur que [[13-directives/maxrequestworkers|MaxRequestWorkers]]

Voici un exemple typique de configuration du contrôle processus-thread pour le MPM [[12-modules/worker|worker]] :

```apache
ServerLimit         16
StartServers         2
MaxRequestWorkers  150
MinSpareThreads     25
MaxSpareThreads     75
ThreadsPerChild     25
```

Alors que le processus parent est en général démarré en tant que `root` sous Unix afin de se mettre en écoute du port 80, les processus enfants et les threads sont lancés par le serveur sous un utilisateur avec privilèges restreints. On peut utiliser les directives [[13-directives/user|User]] et [[13-directives/group|Group]] pour définir les privilèges des processus enfants. Les processus enfants doivent pouvoir être en mesure de lire tous les contenus destinés à être servis, mais doivent avoir des privilèges aussi bas que possible. De plus, ces directives définissent également les privilèges dont vont hériter les scripts CGI (sauf si on utilise [[10-commandes/suexec|suexec]]).

La directive [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] permet de définir la fréquence à laquelle le serveur recycle ses processus en arrêtant les plus anciens et en en lançant de nouveaux.

Ce module MPM utilise le mutex `mpm-accept` pour sérialiser l'accès aux connexions entrantes lorsqu'un problème d'afflux de requêtes peut survenir (en général, lorsqu'il y a plusieurs sockets en écoute). Les différents aspects de l'implémentation de ce mutex peuvent être configurés via la directive [[13-directives/mutex|Mutex]]. Vous trouverez des informations plus détaillées à propos de ce mutex dans la documentation sur les [[11-guides/06-divers/optimisation-des-performances-d-apache|conseils en matière de performances]].

## Directives

- [[13-directives/coredumpdirectory|CoreDumpDirectory]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/enableexceptionhook|EnableExceptionHook]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/group|Group]] (définie dans [[12-modules/mod_unixd|mod_unixd]])
- [[13-directives/pidfile|PidFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listen|Listen]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listenbacklog|ListenBackLog]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxrequestworkers|MaxRequestWorkers]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxmemfree|MaxMemFree]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxsparethreads|MaxSpareThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/minsparethreads|MinSpareThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/scoreboardfile|ScoreBoardFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/receivebuffersize|ReceiveBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/sendbuffersize|SendBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
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
