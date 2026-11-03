---
title: "mpmt_os2"
description: "Module Apache mpmt_os2 — MPM hybride multi-processus, multi-thread pour OS/2. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mpmt_os2]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | MPM hybride multi-processus, multi-thread pour OS/2 |
| **Statut** | MPM |
| **Identificateur** | `mpm_mpmt_os2_module` |
| **Fichier source** | `mpmt_os2.c` |

## Sommaire

Le serveur se compose d'un processus principal parent, et d'un petit nombre fixe de processus enfants.

La tâche du processus parent consiste à gérer les processus enfants, c'est à dire lancer ces processus de manière à ce qu'il y en ait toujours un nombre égal à la valeur de la directive [[13-directives/startservers|StartServers]] pour traiter les connexions.

Chaque processus enfant comporte un jeu de threads esclaves et un thread maître qui accepte les connexions et les distribue aux esclaves via une file de travail. Le jeu de threads esclaves est dynamique et géré par un thread de maintenance de façon à ce que le nombre de threads inactifs soit maintenu entre [[13-directives/minsparethreads|MinSpareThreads]] et [[13-directives/maxsparethreads|MaxSpareThreads]].

## Directives

- [[13-directives/user|User]] (définie dans [[12-modules/mod_unixd|mod_unixd]])
- [[13-directives/group|Group]] (définie dans [[12-modules/mod_unixd|mod_unixd]])
- [[13-directives/listen|Listen]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listenbacklog|ListenBackLog]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/receivebuffersize|ReceiveBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/sendbuffersize|SendBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxsparethreads|MaxSpareThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/minsparethreads|MinSpareThreads]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/pidfile|PidFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/startservers|StartServers]] (définie dans [[12-modules/mpm_common|mpm_common]])

## Voir aussi

- [[11-guides/01-generalites/modules-multi-processus-mpms|Modules multi-processus (MPMs)]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
