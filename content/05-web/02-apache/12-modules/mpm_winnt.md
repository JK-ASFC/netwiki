---
title: "mpm_winnt"
description: "Module Apache mpm_winnt — Module multi-processus optimisé pour Windows NT. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mpm_winnt]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module multi-processus optimisé pour Windows NT. |
| **Statut** | MPM |
| **Identificateur** | `mpm_winnt_module` |
| **Fichier source** | `mpm_winnt.c` |

## Sommaire

Ce module multi-processus (MPM) est le module par défaut pour les systèmes d'exploitation de style Windows NT. Il consiste en un processus de contrôle unique qui lance un processus enfant unique, ce dernier créant à son tour des threads pour traiter les requêtes.

La directive [[13-directives/threadsperchild|ThreadsPerChild]] définit le nombre maximal de connexions clientes simultanées.

Ce MPM utilise par défaut les APIs Windows avancées pour accepter les nouvelles connexions des clients. Avec certaines configurations, des produits tiers peuvent interférer avec cette implémentation, et provoquer l'enregistrement des messages suivants dans les journaux du serveur :

```
Child: Encountered too many AcceptEx faults accepting client connections.
winnt_mpm: falling back to 'AcceptFilter none'.
```

Le MPM se rabat sur une implémentation plus sûre, mais certaines requêtes n'ont pas été traitées correctement. Pour éviter cette erreur, définissez la directive [[13-directives/acceptfilter|AcceptFilter]] à `none`.

```apache
AcceptFilter http none
AcceptFilter https none
```

*Avec les versions 2.0 et 2.2 d'Apache httpd, c'est la directive `Win32DisableAcceptEx` qui était utilisée à cet effet.*

Le MPM WinNT diffère des autres MPMs Unix comme worker et event à bien des égards :

- Lorsqu'un processus enfant s'arrête suite à un arrêt ou redémarrage du serveur, ou lorsque que la limite [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] est atteinte, les requêtes en cours de traitement par ce processus en cours d'arrêt n'ont que [[13-directives/timeout|TimeOut]] secondes pour s'exécuter avant l'arrêt du processus. Les autres types de redémarrage ou arrêt ne sont pas implémentés.
- Les nouveau processus enfants relisent les fichiers de configuration au lieu d'en hériter du parent. Ce comportement ne pose pas de problème si le processus enfant est créé au démarrage ou redémarrage, mais dans le cas où un processus enfant est créé parce qu'un autre processus enfant s'est arrêté ou a atteint la limite [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]], tout changement survenu entre temps dans la configuration sera alors pris en compte dans le processus enfant, et parent et enfant utiliseront une configuration différente. Si des modifications planifiées de la configuration ont été partiellement effectuées, et si la configuration courante n'est pas interprétable, le processus enfant de remplacement ne pourra pas démarrer, et le serveur s'arrêtera. En conséquence, toute modification des fichiers de configuration doit être accompagnée d'un redémarrage du serveur.
- Les hooks `monitor` et `fatal_exception` ne sont pas encore implémentés.
- La directive `AcceptFilter` est implémentée par le MPM et fournit un type de contrôle différent sur le traitement des nouvelles connexions (Voir la documentation de la directive [[13-directives/acceptfilter|AcceptFilter]] pour plus de détails).

## Directives

- [[13-directives/acceptfilter|AcceptFilter]] (définie dans [[12-modules/core|core]])
- [[13-directives/coredumpdirectory|CoreDumpDirectory]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/pidfile|PidFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listen|Listen]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listenbacklog|ListenBackLog]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxmemfree|MaxMemFree]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/scoreboardfile|ScoreBoardFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/receivebuffersize|ReceiveBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/sendbuffersize|SendBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/threadlimit|ThreadLimit]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/threadsperchild|ThreadsPerChild]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/threadstacksize|ThreadStackSize]] (définie dans [[12-modules/mpm_common|mpm_common]])

## Voir aussi

- [[11-guides/01-generalites/modules-multi-processus-mpms|Modules multi-processus (MPMs)]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
