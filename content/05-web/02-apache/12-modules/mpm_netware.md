---
title: "mpm_netware"
description: "Module Apache mpm_netware — Module multi-processus implémentant un serveur web basé exclusivement sur les threads et optimisé pour Novell NetWare. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mpm_netware]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module multi-processus implémentant un serveur web basé exclusivement sur les threads et optimisé pour Novell NetWare |
| **Statut** | MPM |
| **Identificateur** | `mpm_netware_module` |
| **Fichier source** | `mpm_netware.c` |

## Sommaire

Ce module multi-processus (MPM) implémente un serveur web basé exclusivement sur les threads et optimisé pour Novell NetWare.

Le thread maître est chargé du lancement de threads esclaves qui attendent les connexions et les traitent au fur et à mesure de leur arrivée. Le serveur HTTP Apache essaie toujours de maintenir plusieurs threads esclaves en *spare* (en réserve) ou inactifs. De cette façon, les clients n'ont pas besoin d'attendre le lancement d'un nouveau thread enfant pour que leurs requêtes soient traitées.

Les directives [[13-directives/startthreads|StartThreads]], [[13-directives/minsparethreads|MinSpareThreads]], [[13-directives/maxsparethreads|MaxSpareThreads]], et [[13-directives/maxthreads|MaxThreads]] contrôlent la manière dont le thread maître crée les threads esclaves afin de traiter les requêtes. En général, Apache httpd s'auto-régule correctement, et la plupart des sites ne nécessitent aucune modification des valeurs par défaut de ces directives. Pour les sites dont le serveur est limité en mémoire, il peut s'avérer nécessaire de diminuer la valeur de la directive [[13-directives/maxthreads|MaxThreads]] afin d'éviter une hyper-activité du serveur (arrêts de threads inactifs et lancement incessant de nouveau threads). Vous trouverez plus d'informations à propos du contrôle de la création de processus dans le document [[11-guides/06-divers/optimisation-des-performances-d-apache|conseils en matière de performances]].

La directive `MaxRequestsPerChild` contrôle la fréquence à laquelle le serveur recycle ses processus en arrêtant les anciens et en en lançant de nouveaux. Sous le système d'exploitation NetWare, il est vivement recommandé de laisser cette directive à 0, ce qui permet aux threads esclaves de continuer à traiter les requêtes indéfiniment.

## Directives

- [[13-directives/maxthreads|MaxThreads]]
- [[13-directives/listen|Listen]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listenbacklog|ListenBackLog]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxmemfree|MaxMemFree]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/receivebuffersize|ReceiveBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/sendbuffersize|SendBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxsparethreads|MaxSpareThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/minsparethreads|MinSpareThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/startthreads|StartThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/threadstacksize|ThreadStackSize]] (définie dans [[12-modules/mpm_common|mpm_common]])

## Voir aussi

- [[11-guides/01-generalites/modules-multi-processus-mpms|Modules multi-processus (MPMs)]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
