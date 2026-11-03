---
title: "Modules multi-processus (MPMs)"
description: "Apache HTTP Server — Modules multi-processus (MPMs). Ce document décrit ce qu'est un Module Multi-Processus, ainsi que la manière dont ces modules sont utilisés par le serveur HTTP Apache."
tags: [apache, guide]
icon: book-open
---

Ce document décrit ce qu'est un Module Multi-Processus, ainsi que la manière dont ces modules sont utilisés par le serveur HTTP Apache.

## Introduction

La conception du serveur HTTP Apache en fait un serveur web puissant et flexible pouvant fonctionner sur une très grande variété de plateformes et toute une gamme d'environnements différents. Plateformes différentes et environnements différents signifient souvent fonctionnalités différentes, ou utilisation de différentes méthodes pour implémenter la même fonctionnalité le plus efficacement possible. Apache httpd s'est toujours accomodé d'une grande variété d'environnements grâce à sa conception modulaire. Cette conception autorise le webmaster à choisir quelles fonctionnalités seront incluses dans le serveur en sélectionnant les modules à charger soit à la compilation, soit à l'exécution.

Le serveur HTTP Apache 2.0 a étendu cette conception modulaire aux fonctions les plus élémentaires d'un serveur web. Le serveur est fourni avec une variété de Modules Multi-Processus (MPMs) qui sont responsables de l'association aux ports réseau de la machine, acceptent les requêtes, et se chargent de répartir ces dernières entre les différents processus enfants.

L'extension de la conception modulaire à ce niveau du serveur comporte deux avantages importants :

- Apache httpd peut supporter plus proprement et efficacement une grande variété de systèmes d'exploitation. En particulier, la version Windows du serveur est maintenant beaucoup plus efficace, depuis que [[12-modules/mpm_winnt|mpm_winnt]] peut utiliser les fonctionnalités réseau natives à la place de la couche POSIX utilisée par Apache httpd 1.3. Cet avantage s'étend aussi aux systèmes d'exploitation qui implémentent des MPMs spécialisés.
- le serveur est plus à même de répondre aux besoins d'un site particulier. Par exemple, les sites qui sont très sollicités peuvent utiliser un MPM threadé comme [[12-modules/worker|worker]] ou [[12-modules/event|event]], tandis que les sites qui privilégient la stabilité ou la compatibilité avec des logiciels plus anciens peuvent utiliser un module comme [[12-modules/prefork|prefork]].

Du point de vue de l'utilisateur, les MPMs ne sont pas différents des autres modules Apache httpd. La principale différence réside dans le fait qu'un et un seul MPM à la fois doit être chargé lorsque le serveur s'exécute. La liste des MPMs disponibles est fournie dans l'index des modules.

## MPM par défaut

La table suivante fournit la liste des MPMs par défaut pour divers systèmes d'exploitation. Il s'agit du MPM qui sera utilisé si vous n'en spécifiez pas un autre à la compilation.

|   |   |
| --- | --- |
| Netware | [[12-modules/mpm_netware\|mpm_netware]] |
| OS/2 | [[12-modules/mpmt_os2\|mpmt_os2]] |
| Unix | [[12-modules/prefork\|prefork]], [[12-modules/worker\|worker]], ou [[12-modules/event\|event]], selon les possibilités de la plate-forme |
| Windows | [[12-modules/mpm_winnt\|mpm_winnt]] |

> [!NOTE]
> Ici, 'Unix' sous-entend les systèmes d'exploitation de type Unix, comme Linux, BSD, Solaris, Mac OS X, etc...

Dans le cas des systèmes d'exploitation de type Unix, le choix du MPM à installer est orienté par deux questions :

1. Est-ce que le système supporte les threads ?

2. Est-ce que le système supporte le polling thread-safe (et en particulier les fonctions kqueue et epoll) ?

Si la réponse aux deux questions est 'oui', le MPM par défaut sera [[12-modules/event|event]].

Si la réponse à la première question est 'oui', et la réponse à la deuxième 'non', le MPM par défaut sera [[12-modules/worker|worker]].

Si la réponse aux deux questions est 'non', le MPM par défaut sera [[12-modules/prefork|prefork]].

En pratique, cela signifie que le MPM par défaut sera presque toujours [[12-modules/event|event]] car tous les systèmes d'exploitation modernes satisfont aux deux conditions.

## Compiler un module MPM en tant que module statique

Les modules MPM peuvent être compilés en tant que modules statiques sur toutes les plates-formes. A la compilation d'Apache, un seul module MPM doit être choisi pour être compilé et lié avec le serveur. La recompilation du serveur sera donc nécessaire si vous souhaitez changer de module MPM.

Pour choisir un module MPM autre que le MPM par défaut, utiliser l'argument `--with-mpm=NOM` du script [[10-commandes/configure|configure]]. *NOM* est le nom du MPM désiré.

Une fois le serveur compilé, il est possible de savoir quel MPM a été choisi à l'aide de la commande `./httpd -l`. Cette commande fournit la liste de tous les modules compilés avec le serveur, y compris le MPM.

## Compiler un module MPM en tant que module DSO (Dynamic Shared Object)

Sous Unix et les plates-formes similaires, les modules MPM peuvent être compilés en tant que modules DSO et chargés dynamiquement dans le serveur comme tout module DSO. Compiler les modules MPM en tant que modules DSO permet de changer de MPM en modifiant la directive [[13-directives/loadmodule|LoadModule]] concernée, sans avoir à recompiler le serveur.

```apache
LoadModule mpm_event_module modules/mod_mpm_event.so
```

Toute tentative de charger plusieurs modules MPM via la directive [[13-directives/loadmodule|LoadModule]] empêchera le serveur de démarrer et affichera l'erreur suivante :

```
AH00534: httpd: Configuration error: More than one MPM
    loaded.
```

Cette fonctionnalité est activée via l'option `--enable-mpms-shared` du script [[10-commandes/configure|configure]]. Si on ajoute l'argument `all`, tous les modules MPM disponibles sur la plate-forme considérée seront installés. Cet argument peut aussi contenir une liste de modules MPM à installer.

Le module MPM par défaut, sélectionné automatiquement ou spécifié via l'option `--with-mpm` du script [[10-commandes/configure|configure]], sera chargé via une directive [[13-directives/loadmodule|LoadModule]] du fichier de configuration du serveur généré. Pour choisir un autre module MPM, vous devrez donc modifier cette directive

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
