---
title: "AsyncRequestWorkerFactor"
description: "Directive Apache AsyncRequestWorkerFactor (event) — Limite le nombre de connexions simultanées par thread. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, event]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Limite le nombre de connexions simultanées par thread |
| **Syntaxe** | `AsyncRequestWorkerFactor facteur` |
| **Valeur par défaut** | `2` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/event\|event]] |
| **Compatibilité** | Disponible depuis la version 2.3.13 |

## Utilisation

Le MPM event gère certaines connexions de manière asynchrone ; dans ce cas, les threads traitant la requête sont alloués selon les besoins et pour de courtes périodes. Dans les autres cas, un thread est réservé par connexion. Ceci peut conduire à des situations où tous les threads sont saturés et où aucun thread n'est capable d'effectuer de nouvelles tâches pour les connexions asynchrones établies.

Pour minimiser les effets de ce problème, le MPM event utilise deux méthodes :

- il limite le nombre de connexions simultanées par thread en fonction du nombre de processus inactifs;
- si tous les processus sont occupés, il ferme des connexions permanentes, même si la limite de durée de la connexion n'a pas été atteinte. Ceci autorise les clients concernés à se reconnecter à un autre processus possèdant encore des threads disponibles.

Cette directive permet de personnaliser finement la limite du nombre de connexions par thread. Un **processus** n'acceptera de nouvelles connexions que si le nombre actuel de connexions (sans compter les connexions à l'état "closing") est inférieur à :

**[[13-directives/threadsperchild|ThreadsPerChild]] + (`AsyncRequestWorkerFactor` \* *nombre de threads inactifs*)**

Il est possible d'effectuer une estimation du nombre maximum de connexions simultanées pour tous les processus et pour un nombre donné moyen de threads de travail inactifs comme suit :

**([[13-directives/threadsperchild|ThreadsPerChild]] + (`AsyncRequestWorkerFactor` \* *number of idle workers*)) \* [[13-directives/serverlimit|ServerLimit]]**

> [!NOTE]
> **Exemple**
>
> ```apache
> ThreadsPerChild = 10
> ServerLimit = 4
> AsyncRequestWorkerFactor = 2
> MaxRequestWorkers = 40
>
> idle_workers = 4 (moyenne pour tous les processus pour faire simple)
>
> max_connections = (ThreadsPerChild + (AsyncRequestWorkerFactor * idle_workers)) * ServerLimit
>                 = (10 + (2 * 4)) * 4 = 72
> ```

Lorsque tous les threads de travail sont inactifs, le nombre maximum absolu de connexions simultanées peut être calculé de manière plus simple :

**(`AsyncRequestWorkerFactor` + 1) \* [[13-directives/maxrequestworkers|MaxRequestWorkers]]**

> [!NOTE]
> **Exemple**
>
> ```apache
> ThreadsPerChild = 10
> ServerLimit = 4
> MaxRequestWorkers = 40
> AsyncRequestWorkerFactor = 2
> ```
>
> Si tous les threads de tous les processus sont inactifs, alors :
>
> ```apache
> idle_workers = 10
> ```
>
> Nous pouvons calculer le nombre maximum absolu de connexions simultanées de deux manières :
>
> ```apache
> max_connections = (ThreadsPerChild + (AsyncRequestWorkerFactor * idle_workers)) * ServerLimit
>                 = (10 + (2 * 10)) * 4 = 120
>
> max_connections = (AsyncRequestWorkerFactor + 1) * MaxRequestWorkers
>                 = (2 + 1) * 40 = 120
> ```

Le réglage de la directive `AsyncRequestWorkerFactor` nécessite de connaître le trafic géré par httpd pour chaque style d'utilisation spécifique ; si vous modifiez la valeur par défaut, vous devrez par conséquent effectuer des tests approfondis en vous appuyant étroitement sur les données fournies par [[12-modules/mod_status|mod_status]].

La directive [[13-directives/maxrequestworkers|MaxRequestWorkers]] se nommait `MaxClients` avant la version 2.3.13. La valeur ci-dessus montre que cet ancien nom ne correspondait pas à sa signification exacte pour le MPM event.

La directive `AsyncRequestWorkerFactor` accepte des valeurs d'argument de type non entier, comme "1.5".

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
