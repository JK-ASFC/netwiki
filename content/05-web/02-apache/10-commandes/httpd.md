---
title: "httpd"
description: "Commande httpd d’Apache HTTP Server — httpd - Le serveur HTTP d'Apache : syntaxe, options et exemples."
tags: [apache, commande, httpd]
icon: terminal
---

*httpd - Le serveur HTTP d'Apache*

[[10-commandes/httpd|httpd]] est le programme du serveur HTTP d'Apache. Il a été conçu pour fonctionner sous forme de processus démon indépendant. Lorsqu'il est utilisé ainsi, il va créer un jeu de processus enfants ou de threads qui traiteront les requêtes.

En général, [[10-commandes/httpd|httpd]] n'est pas invoqué directement, mais plutôt via [[10-commandes/apachectl|apachectl]] sur les systèmes de style Unix ou [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|en tant que service sous Windows NT, 2000 et XP]] et [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|comme application de console sous Windows 9x et ME]].

## Syntaxe

`httpd [ -d racine-serveur ] [ -f config ] [ -C directive ] [ -c directive ] [ -D paramètre ] [ -e niveau ] [ -E fichier ] [ -k start|restart|graceful|stop|graceful-stop ] [ -h ] [ -l ] [ -L ] [ -S ] [ -t ] [ -v ] [ -V ] [ -X ] [ -M ] [ -T ]`

Sur les [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|systèmes Windows]], les options additionnelles suivantes sont disponibles :

`httpd [ -k install|config|uninstall ] [ -n nom ] [ -w ]`

## Options

**`-d racine-serveur`**

Définit la valeur initiale de la directive [[13-directives/serverroot|ServerRoot]] à *racine-serveur*. Cette valeur peut être écrasée par la directive ServerRoot du fichier de configuration. La valeur par défaut est `/usr/local/apache2`.

**`-f config`**

Utilise les directives du fichier *config* au démarrage. Si *config* ne commence pas par un '/', il est considéré comme relatif au chemin défini par la directive [[13-directives/serverroot|ServerRoot]]. La valeur par défaut est `conf/httpd.conf`.

**`-k start|restart|graceful|stop|graceful-stop`**

Permet de démarrer, redémarrer ou arrêter [[10-commandes/httpd|httpd]]. Voir [[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|Arrêter Apache httpd]] pour plus d'informations.

**`-C directive`**

Exécute la directive de configuration *directive* avant de lire les fichiers de configurations.

**`-c directive`**

Exécute la directive de configuration *directive* après avoir lu les fichiers de configurations.

**`-D paramètre`**

Définit un *paramètre* de configuration à utiliser dans les sections [[13-directives/ifdefine|<IfDefine>]] des fichiers de configuration, ces dernières permettant d'exécuter ou non des commandes au démarrage ou au redémarrage du serveur. Sert aussi à définir certains paramètres de démarrage moins courants comme `-DNO_DETACH` (empêche le processus parent de lancer des processus enfants) et `-DFOREGROUND` (empêche le processus parent d'appeler `setsid()` et autres).

**`-e niveau`**

Définit la directive [[13-directives/loglevel|LogLevel]] à *niveau* pendant le démarrage du serveur. Ceci permet d'augmenter temporairement la verbosité des messages d'erreur afin de déterminer les problèmes de démarrage.

**`-E fichier`**

Envoie les messages d'erreur de démarrage vers le fichier *fichier*.

**`-h`**

Affiche un bref résumé des options de ligne de commande disponibles.

**`-l`**

Affiche la liste des modules compilés dans le le serveur. Ce paramètre n'affiche **pas** les modules chargés dynamiquement via la directive [[13-directives/loadmodule|LoadModule]].

**`-L`**

Affiche une liste des directives fournies par les modules statiques avec les arguments associés, ainsi que les contextes dans lesquels elles sont valides. Les directives fournies par les modules partagés (dynamiques) ne sont pas affichées).

**`-M`**

Affiche une liste des modules statiques et des modules chargés dynamiquement.

**`-S`**

Affiche la configuration telle qu'elle est issue de l'interprétation du fichier de configuration (actuellement, seule la configuration des serveurs virtuels est affichée).

**`-T` (disponible depuis la version 2.3.8)**

Empêche la vérification de la racine des documents (DocumentRoot) au démarrage/redémarrage.

**`-t`**

Exécute une vérification de syntaxe pour les fichiers de configuration seulement. Le programme se termine immédiatement après ces tests de vérification de syntaxe avec soit un code de retour de 0 (syntaxe OK), soit un code de retour différent de 0 (erreur de syntaxe). Si -D *DUMP*\_*VHOSTS* est défini, les détails de la configuration des serveurs virtuels seront affichés. Si -D *DUMP*\_*MODULES* est défini, tous les modules chargés seront affichés.

**`-v`**

Print the version of [[10-commandes/httpd|httpd]], and then exit.

**`-V`**

Le programme affiche la version et les paramètres de compilation de [[10-commandes/httpd|httpd]], puis se termine.

**`-X`**

Exécute httpd en mode debug. Un seul processus sera démarré, et le serveur ne rendra pas la main à la console.

## Fichier

Les chemins par défaut listés ci-après peuvent être modifiés à la compilation ou à l’aide de différents arguments de ligne de commande et directives de configuration. Consulter votre installation locale pour les emplacements réels.

**`/usr/local/apache2/conf/httpd.conf`**

Fichier de configuration globale du serveur.

**`/usr/local/apache2/conf/mime.types`**

Correspondances de types MIME par défaut.

**`/usr/local/apache2/logs/error_log`**

Fichier du journal des erreurs.

**`/usr/local/apache2/logs/access_log`**

Fichier du journal des accès

**`/usr/local/apache2/logs/httpd.pid`**

Fichier contenant l’ID du processus du démon en cours d’exécution.

Les arguments suivants ne sont disponibles que sur la [[11-guides/07-plates-formes/utilisation-du-serveur-http-apache-sous-microsoft-windows|plate-forme Windows]] :

**`-k install|config|uninstall`**

Respectivement : installe Apache httpd en tant que service Windows NT ; modifie les options de démarrage du service Apache httpd ; désinstalle le service Apache httpd.

**`-n nom`**

Le *nom* du service Apache httpd à actionner.

**`-w`**

Garde la console Windows ouverte en cas de problème de façon à ce que le message d'erreur puisse être lu.

## Voir aussi

- [[11-guides/01-generalites/demarrage-d-apache|Démarrer Apache httpd]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
