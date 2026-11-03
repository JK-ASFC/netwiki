---
title: "prefork"
description: "Module Apache prefork — Implémente un serveur web avec démarrage anticipé de processus, sans thread. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, prefork]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Implémente un serveur web avec démarrage anticipé de processus, sans thread |
| **Statut** | MPM |
| **Identificateur** | `mpm_prefork_module` |
| **Fichier source** | `prefork.c` |

## Sommaire

Ce module multi-processus (MPM) implémente un serveur web avec démarrage anticipé de processus. Chaque processus du serveur peut répondre aux requêtes entrantes, et un processus parent contrôle la taille du jeu de processus enfants. Il est particulièrement indiqué pour les sites qui ne doivent pas utiliser les threads afin de maintenir une compatibilité avec certaines bibliothèques non sûres du point de vue des threads. C'est également le MPM le plus approprié si l'on veut isoler les requêtes les unes des autres, de façon à ce qu'un problème concernant une requête n'affecte pas les autres.

Ce MPM s'auto-contrôle de manière efficace, de sorte qu'il est rarement nécessaire d'ajuster ses directives de configuration. Le plus important est la définition de la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]] ; sa valeur doit être assez grande pour pouvoir traiter autant de requêtes simultanées que vous pensez recevoir, mais assez petite pour conserver suffisamment de mémoire RAM pour tous les processus.

Lorsqu’il est construit en tant que module DSO, ce module peut être chargé avec la commande :

```apache
LoadModule mpm_prefork_module modules/mod_mpm_prefork.so
```

## Comment ça marche

Un processus de contrôle unique a pour tâche de lancer les processus enfants qui attendent les connexions et les traitent au fur et à mesure qu'elles arrivent. Apache httpd essaie toujours de maintenir plusieurs processus serveurs inactifs ou *en réserve*, afin de pouvoir traiter les requêtes entrantes. De cette façon, les clients n'ont pas besoin d'attendre le démarrage d'un nouveau processus enfant pour que leurs requêtes puissent être traitées.

Les directives [[13-directives/startservers|StartServers]], [[13-directives/minspareservers|MinSpareServers]], [[13-directives/maxspareservers|MaxSpareServers]] et [[13-directives/maxrequestworkers|MaxRequestWorkers]] permettent de contrôler la manière dont le processus parent crée les processus enfants pour traiter les requêtes. En général, Apache httpd s'auto-contrôle de manière efficace, de sorte que la plupart des sites peuvent conserver les valeurs par défaut des directives. Les sites qui doivent traiter plus de 256 requêtes simultanées doivent augmenter la valeur de [[13-directives/maxrequestworkers|MaxRequestWorkers]], alors que les sites dont la ressource mémoire est limitée doivent la diminuer afin d'éviter une hyperactivité du serveur (utilisation excessive de la mémoire virtuelle sur disque). Vous trouverez plus d'informations à propos du contrôle de la création de processus dans le document [[11-guides/06-divers/optimisation-des-performances-d-apache|conseils en matière de performances]]

Alors que le processus parent est en général démarré en tant que `root` sous Unix afin de pouvoir se mettre à l'écoute sur le port 80, les processus enfants sont lancés par Apache httpd sous un utilisateur avec privilèges restreints. On peut contrôler les privilèges accordés aux processus enfants d'Apache httpd à l'aide des directives [[13-directives/user|User]] et [[13-directives/group|Group]]. Les processus enfants doivent être en mesure de lire tous les contenus destinés à être servis, mais leurs privilèges doivent être aussi bas que possible.

La directive [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] permet de contrôler la fréquence à laquelle le serveur recycle ses processus en arrêtant les plus anciens et en en lançant de nouveaux.

Ce module MPM utilise le mutex `mpm-accept` pour sérialiser l'accès aux connexions entrantes lorsque peut se présenter un problème d'afflux de requêtes (en général quand il y a plusieurs sockets en écoute). Les aspects de l'implémentation de ce mutex peuvent être configurés via la directive [[13-directives/mutex|Mutex]]. Vous trouverez des informations supplémentaires à propos de ce mutex dans la documentation à propos des [[11-guides/06-divers/optimisation-des-performances-d-apache|conseils en matière de performances]]

## Directives

- [[13-directives/maxspareservers|MaxSpareServers]]
- [[13-directives/minspareservers|MinSpareServers]]
- [[13-directives/coredumpdirectory|CoreDumpDirectory]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/enableexceptionhook|EnableExceptionHook]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/pidfile|PidFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listen|Listen]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/listenbacklog|ListenBackLog]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxrequestworkers|MaxRequestWorkers]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxmemfree|MaxMemFree]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/scoreboardfile|ScoreBoardFile]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/receivebuffersize|ReceiveBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/sendbuffersize|SendBufferSize]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/serverlimit|ServerLimit]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/startservers|StartServers]] (définie dans [[12-modules/mpm_common|mpm_common]])
- [[13-directives/user|User]] (définie dans [[12-modules/mod_unixd|mod_unixd]])
- [[13-directives/group|Group]] (définie dans [[12-modules/mod_unixd|mod_unixd]])

## Voir aussi

- [[11-guides/01-generalites/modules-multi-processus-mpms|Modules multi-processus(MPMs)]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
