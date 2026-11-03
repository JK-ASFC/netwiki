---
title: "Arrêt et redémarrage du serveur HTTP Apache"
description: "Apache HTTP Server — Arrêt et redémarrage du serveur HTTP Apache. Ce document couvre l'arrêt et le redémarrage du serveur HTTP Apache sur les systèmes Unix et similaires. Les utilisateurs de Windows NT, 2000 and XP doivent consulter Exécuter httpd en tant que service et les utilisateurs de Windows 9x et M"
tags: [apache, guide]
icon: book-open
---

Ce document couvre l'arrêt et le redémarrage du serveur HTTP Apache sur les systèmes Unix et similaires. Les utilisateurs de Windows NT, 2000 and XP doivent consulter [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|Exécuter httpd en tant que service]] et les utilisateurs de Windows 9x et ME doivent consulter [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|Exécuter httpd comme une application de type console]] pour plus d'informations sur le contrôle de httpd à partir de ces plateformes.

## Introduction

Afin d'arrêter ou redémarrer le serveur HTTP Apache, vous devez envoyer un signal aux processus [[10-commandes/httpd|httpd]] en cours d'exécution. Les signaux peuvent être envoyés de deux manières. La première méthode consiste à utiliser la commande unix `kill` pour envoyer directement des signaux aux processus. Vous pouvez remarquer que plusieurs processus [[10-commandes/httpd|httpd]] s'exécutent sur votre système, mais il vous suffit d'envoyer les signaux au processus parent, dont le PID est enregistré dans le fichier précisé par la directive [[13-directives/pidfile|PidFile]]. Autrement dit, vous n'aurez jamais besoin d'envoyer des signaux à aucun des processus enfants, mais seulement au processus parent. Quatre types de signaux peuvent être envoyés au processus parent : `TERM`, `USR1`, `HUP`, et `WINCH`, qui seront décrit plus loin.

Pour envoyer un signal au processus parent, vous devez entrer une commande du style :

```
kill -TERM `cat /usr/local/apache2/logs/httpd.pid`
```

La seconde méthode permettant d'envoyer des signaux aux processus [[10-commandes/httpd|httpd]] consiste à utiliser les options `stop`, `restart`, `graceful` et `graceful-stop` du commutateur `-k` de la ligne de commande comme décrit ci-dessous. Ce sont des arguments du binaire [[10-commandes/httpd|httpd]], mais il est recommandé de les utiliser avec le script de contrôle [[10-commandes/apachectl|apachectl]], qui se chargera de les passer à [[10-commandes/httpd|httpd]].

Après avoir envoyé un signal à [[10-commandes/httpd|httpd]], vous pouvez suivre le cours de son action en entrant :

```
tail -f /usr/local/apache2/logs/error_log
```

Adaptez ces exemples en fonction de la définition de vos directives [[13-directives/serverroot|ServerRoot]] et [[13-directives/pidfile|PidFile]].

## Arrêter immédiatement

**Signal: TERM**

`apachectl -k stop`

A la réception du signal `TERM` ou `stop`, le processus parent tente immédiatement de tuer tous ses processus enfants. Cela peut durer plusieurs secondes. Après cela, le processus parent lui-même se termine. Toutes les requêtes en cours sont terminées, et plus aucune autre n'est traitée.

## Redémarrage en douceur

**Signal: USR1**

`apachectl -k graceful`

A la réception du signal `USR1` ou `graceful`, le processus parent envoie aux processus enfants *l'ordre* de se terminer une fois leur requête courante traitée (ou de se terminer immédiatement s'ils n'ont plus rien à traiter). Le processus parent relit ses fichiers de configuration et réouvre ses fichiers de log. Chaque fois qu'un enfant s'éteint, le processus parent le remplace par un processus enfant de la nouvelle *génération* de la configuration, et celui-ci commence immédiatement à traiter les nouvelles requêtes.

Ce code est conçu pour toujours respecter la directive de contrôle de processus des modules MPMs, afin que les nombres de processus et de threads disponibles pour traiter les demandes des clients soient maintenus à des valeurs appropriées tout au long du processus de démarrage. En outre, il respecte la directive [[13-directives/startservers|StartServers]] de la manière suivante : si après une seconde au moins [[13-directives/startservers|StartServers]] nouveaux processus enfants n'ont pas été créés, un nombre suffisant de processus supplémentaires est créé pour combler le manque. Ainsi le code tente de maintenir à la fois le nombre approprié de processus enfants en fonction de la charge du serveur, et le nombre de processus défini par la directive [[13-directives/startservers|StartServers]].

Les utilisateurs du module [[12-modules/mod_status|mod_status]] noteront que les statistiques du serveur ne sont **pas** remises à zéro quand un signal `USR1` est envoyé. Le code a été conçu à la fois pour minimiser la durée durant laquelle le serveur ne peut pas traiter de nouvelles requêtes (elle sont mises en file d'attente par le système d'exploitation, et ne sont ainsi jamais perdues) et pour respecter vos paramètres de personnalisation. Pour y parvenir, il doit conserver le *tableau* utilisé pour garder la trace de tous les processus enfants au cours des différentes générations.

Dans son état des processus, le module status utilise aussi un caractère `G` afin d'indiquer quels processus enfants ont encore des traitements de requêtes en cours débutés avant que l'ordre graceful restart ne soit donné.

Pour l'instant, il est impossible pour un script de rotation des logs utilisant `USR1` de savoir de manière certaine si tous les processus enfants inscrivant des traces de pré-redémarrage sont terminés. Nous vous suggérons d'attendre un délai suffisant après l'envoi du signal `USR1` avant de faire quoi que ce soit avec les anciens logs. Par exemple, si la plupart de vos traitements durent moins de 10 minutes pour des utilisateurs empruntant des liaisons à faible bande passante, alors vous devriez attendre 15 minutes avant de faire quoi que ce soit avec les anciens logs.

> [!NOTE]
> Lorsque vous initiez un redémarrage, une vérification de la syntaxe est tout d'abord effectuée, afin de s'assurer qu'il n'y a pas d'erreurs dans les fichiers de configuration. Si votre fichier de configuration comporte des erreurs de syntaxe, vous recevrez un message d'erreur les concernant, et le serveur refusera de redémarrer. Ceci permet d'éviter la situation où un serveur a été arrêté et ne peut plus redémarrer, et où vous vous retrouvez avec un serveur hors-service.
>
> Ceci ne garantit pas encore que le serveur va redémarrer correctement. Pour vérifier la sémantique des fichiers de configuration en plus de leur syntaxe, vous pouvez essayer de démarrer [[10-commandes/httpd|httpd]] sous un utilisateur non root. S'il n'y a pas d'erreur, il tentera d'ouvrir ses sockets et ses fichiers de log et échouera car il n'a pas les privilèges root (ou parce que l'instance actuelle de [[10-commandes/httpd|httpd]] est déjà associée à ces ports). S'il échoue pour toute autre raison, il y a probablement une erreur dans le fichier de configuration et celle-ci doit être corrigée avant de lancer le redémarrage en douceur.

## Redémarrer immédiatement

**Signal: HUP**

`apachectl -k restart`

A la réception du signal `HUP` ou `restart`, le processus parent tue ses processus enfants comme pour le signal `TERM`, mais le processus parent ne se termine pas. Il relit ses fichiers de configuration, et réouvre ses fichiers de log. Puis il donne naissance à un nouveau jeu de processus enfants et continue de traiter les requêtes.

Les utilisateurs du module [[12-modules/mod_status|mod_status]] noteront que les statistiques du serveur sont remises à zéro quand un signal `HUP` est envoyé.

> [!NOTE]
> Comme dans le cas d'un redémarrage "graceful", une vérification de la syntaxe est effectuée avant que le redémarrage ne soit tenté. Si votre fichier de configuration comporte des erreurs de syntaxe, le redémarrage ne sera pas effectué, et vous recevrez un message concernant ces erreurs.

## Arrêt en douceur

**Signal : WINCH**

`apachectl -k graceful-stop`

A la réception du signal `WINCH` ou `graceful-stop`, le processus parent *ordonne* à ses processus enfants de s'arrêter après le traitement de leur requête en cours (ou de s'arrêter immédiatement s'ils n'ont plus de requête à traiter). Le processus parent va alors supprimer son fichier [[13-directives/pidfile|PidFile]] et cesser l'écoute de tous ses ports. Le processus parent va continuer à s'exécuter, et va surveiller les processus enfants qui ont encore des requêtes à traiter. Lorsque tous les processus enfants ont terminé leurs traitements et se sont arrêtés ou lorsque le délai spécifié par la directive [[13-directives/gracefulshutdowntimeout|GracefulShutdownTimeout]] a été atteint, le processus parent s'arrêtera à son tour. Si ce délai est atteint, tout processus enfant encore en cours d'exécution se verra envoyer le signal `TERM` afin de le forcer à s'arrêter.

L'envoi du signal `TERM` va arrêter immédiatement les processus parent et enfants en état "graceful". Cependant, comme le fichier [[13-directives/pidfile|PidFile]] aura été supprimé, vous ne pourrez pas utiliser `apachectl` ou `httpd` pour envoyer ce signal.

> [!NOTE]
> Le signal `graceful-stop` vous permet d'exécuter simultanément plusieurs instances de [[10-commandes/httpd|httpd]] avec des configurations identiques. Ceci s'avère une fonctionnalité puissante quand vous effectuez des mises à jour "en douceur" de httpd ; cependant, cela peut aussi causer des blocages fatals et des situations de compétition (race conditions) avec certaines configurations.
>
> On a pris soin de s'assurer que les fichiers sur disque comme les fichiers verrou ([[13-directives/mutex|Mutex]]) et les fichiers socket Unix ([[13-directives/scriptsock|ScriptSock]]) contiennent le PID du serveur, et coexistent sans problème. Cependant, si une directive de configuration, un module tiers ou une CGI résidente utilise un autre verrou ou fichier d'état sur disque, il faut prendre soin de s'assurer que chaque instance de [[10-commandes/httpd|httpd]] qui s'exécute n'écrase pas les fichiers des autres instances.
>
> Vous devez aussi prendre garde aux autres situations de compétition, comme l'enregistrement des logs avec un transfert de ceux-ci via un pipe vers le programme [[10-commandes/rotatelogs|rotatelogs]]. Plusieurs instances du programme [[10-commandes/rotatelogs|rotatelogs]] qui tentent d'effectuer une rotation des mêmes fichiers de log en même temps peuvent détruire mutuellement leurs propres fichiers de log.

## Voir aussi

- [[10-commandes/httpd|httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
