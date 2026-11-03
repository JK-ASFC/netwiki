---
title: "Utilisation du serveur HTTP Apache sous Microsoft Windows"
description: "Apache HTTP Server — Utilisation du serveur HTTP Apache sous Microsoft Windows. Ce document décrit l'installation, la configuration et l'exécution du serveur HTTP Apache 2.4 sous Microsoft Windows. Si vous avez des questions après avoir lu la documentation, ou si vous avez rencontré des évènements particuliers ou des r"
tags: [apache, guide]
icon: book-open
---

Ce document décrit l'installation, la configuration et l'exécution du serveur HTTP Apache 2.4 sous Microsoft Windows. Si vous avez des questions après avoir lu la documentation, ou si vous avez rencontré des évènements particuliers ou des rapports d'erreur, vous pouvez consultez la [liste de diffusion de la communauté des utilisateurs](http://httpd.apache.org/userslist.html).

Dans ce document, nous supposons que vous installez une distribution binaire d'httpd. Si vous voulez compiler httpd vous-même (par exemple pour aider au développement ou pour rechercher des bogues), référez-vous au document [[11-guides/07-plates-formes/compiler-apache-httpd-pour-microsoft-windows|Compilation de httpd pour Microsoft Windows]].

## Prérequis du système d'exploitation

La plate-forme Windows de base pour l'exécution de httpd 2.4 est Windows 2000 ou supérieur. Veillez à toujours vous procurer et installer le dernier service pack afin d'éviter les bogues du système d'exploitation.

> [!NOTE]
> Les versions du serveur HTTP Apache supérieures à 2.2 ne fonctionneront sous aucun système d'exploitation d'une version antérieure à Windows 2000.

## Téléchargement de httpd pour Windows

Le projet du serveur HTTP Apache proprement dit ne fournit pas de distribution binaire mais seulement le code source. Certains membres du projet *peuvent* mettre à disposition des paquets binaires à titre individuel, mais ceux-ci n'ont pas vocation à être distribués publiquement.

Si vous n'êtes pas en mesure de compiler le serveur HTTP Apache vous-même, vous pouvez vous procurer un paquet binaire auprès des nombreuses distributions disponibles sur Internet.

Quelques solutions populaires pour déployer Apache httpd, et éventuellement PHP et MySQL sous Microsoft Windows :

- [Apache Lounge](http://www.apachelounge.com/download/)
- [WampServer](http://www.wampserver.com/)

## Personnaliser httpd pour Windows

La configuration de httpd est enregistrée dans les fichiers du sous-répertoire `conf`. Ce sont les même fichiers que ceux utilisés pour configurer la version Unix, mais il y a quelques directives spécifiques à httpd pour Windows. Voir l'index des directives pour la liste des directives disponibles.

La configuration par défaut de la distribution source installe le serveur dans \\Apache24. Cet emplacement peut être modifié à la compilation, mais il est important qu'en fin de compte, la directive `ServerRoot` dans httpd.conf corresponde effectivement à la racine de l'installation. Les distributions binaires peuvent parfois modifier la racine de l'installation par défaut, ou même la structure complète de la configuration initiale.

Les principales spécificités de httpd pour Windows sont :

- Comme httpd pour Windows est un programme multithread, il ne lance pas de processus séparé pour chaque requête, comme httpd peut le faire sous Unix. En fait, il n'y a en général que deux processus httpd en exécution : un processus parent, et un processus enfant qui traite les requêtes. Chaque requête est traitée par un thread séparé au sein du processus enfant.

  Les directives de gestion de processus diffèrent également :

  [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]] : comme dans la version Unix, cette directive contrôle le nombre de connexions qu'un processus enfant particulier va traiter avant de s'arrêter. Cependant, à la différence d'Unix, un processus de remplacement n'est pas instantanément disponible. Utilisez la définition par défaut `MaxConnectionsPerChild 0`, sauf si vous risquez de manquer de mémoire dans des modules tiers ou dans des applications in-process.

  > [!WARNING]
  > **Attention : le fichier de configuration du serveur est rechargé lorsqu'un nouveau processus enfant est démarré. En conséquence, si vous avez modifié `httpd.conf`, le nouveau processus enfant peut ne pas démarrer, ou vous pouvez obtenir des résultats inattendus.**

  [[13-directives/threadsperchild|ThreadsPerChild]] : il s'agit d'une nouvelle directive. Elle indique au serveur le nombre de threads qu'il doit utiliser. Elle définit le nombre maximum de connexions simultanées que le serveur peut gérer ; vous devez donc vous assurer que ce nombre soit suffisamment grand pour les besoins de votre site. La valeur par défaut `ThreadsPerChild 150` est recommandée, mais doit être ajustée à la valeur maximale estimée de connexions simultanées à accepter.
- Les directives qui acceptent des noms de fichiers comme arguments doivent utiliser des noms de fichiers Windows et non Unix. Cependant, comme httpd peut interpréter les anti-slashes comme des séquences d'échappement de caractères, vous devez absolument utiliser des slashes dans les noms de chemins à la place des anti-slashes.
- Alors que les noms de fichiers sont en général insensibles à la casse sous Windows, les URLs sont encore sensibles à la casse en interne avant d'être mises en correspondance avec le système de fichiers. Par exemple, les directives [[13-directives/location|<Location>]], [[13-directives/alias|Alias]], et [[13-directives/proxypass|ProxyPass]] utilisent toutes des arguments sensibles à la casse. Pour cette raison, il est particulièrement recommandé d'utiliser la directive [[13-directives/directory|<Directory>]] lorsqu'on désire limiter l'accès à certains contenus du système de fichiers, car cette directive s'applique à tout contenu d'un répertoire, sans tenir compte de la manière dont on y accède. Pour vous assurer que seules des minuscules sont utilisées dans les URLs, vous pouvez utiliser ceci :

  ```apache
  RewriteEngine On
  RewriteMap lowercase int:tolower
  RewriteCond "%{REQUEST_URI}" "[A-Z]"
  RewriteRule "(.*)" "${lowercase:$1}" [R,L]
  ```
- Lors de son exécution, httpd n'a besoin d'un accès en écriture qu'au répertoire des journaux et à toute arborescence de répertoires de cache configurée. Suite au problème d'insensibilité à la casse et au format de noms courts 8.3, httpd doit valider tous les noms de chemins fournis. Cela signifie que chaque répertoire que httpd évalue doit avoir les droits en lecture, listage et parcours, et ceci depuis la racine jusqu'aux feuilles. Si Apache2.4 est installé dans C:\\Program Files, le répertoire racine, Program Files et Apache2.4 doivent tous être visibles pour httpd
- httpd peut charger divers modules sans qu'il soit nécessaire de recompiler le serveur. Si httpd est compilé normalement, il va installer de nombreux modules optionnels dans le répertoire `\Apache2.4\modules`. Pour activer ces modules ou d'autres modules, on doit utiliser la directive [[13-directives/loadmodule|LoadModule]]. Par exemple, pour activer le module status, ajoutez la ligne suivante (en plus des directives d'activation de status dans `access.conf`) :

  ```apache
  LoadModule status_module "modules/mod_status.so"
  ```

  Des informations sont aussi à votre disposition pour [[12-modules/mod_so|créer des modules chargeables]]
- httpd peut aussi charger des extensions ISAPI (Internet Server Application Programming Interface), comme celles qu'utilise Microsoft IIS et d'autres serveurs Windows. [[12-modules/mod_isapi|Voir ici pour plus d'informations]]. Notez que httpd ne peut **pas** charger de filtres ISAPI, et que les gestionnaires ISAPI contenant des extensions de fonctionnalités Microsoft ne fonctionneront pas.
- Pour les scripts CGI, la méthode qu'utilise httpd pour déterminer l'interpréteur du script est configurable grâce à la directive [[13-directives/scriptinterpretersource|ScriptInterpreterSource]]
- Comme il est souvent difficile de gérer des fichiers avec des noms du style `.htaccess` sous Windows, vous avez tout intérêt à changer le nom de ce fichier de configuration par répertoire à l'aide de la directive [[13-directives/accessfilename|AccessFilename]].
- Toute erreur survenant au cours du processus de démarrage de httpd est enregistrée dans le journal des évènements de Windows si l'on est sous Windows NT. Ce mécanisme fonctionne comme une sauvegarde pour les situations où httpd n'est pas encore prêt à utiliser le fichier `error.log`. Vous pouvez consulter le journal des évènements applicatifs Windows en utilisant l'observateur d'évènements : Démarrage - Paramètres - Panneau de configuration - Outils d'administration - Observateur d'évènements.

## Exécuter httpd en tant que service

httpd fournit un utilitaire nommé Apache Service Monitor (Moniteur du service httpd). Grâce à lui, vous pouvez voir et gérer l'état de tous les services httpd installés sur toutes les machines du réseau. Pour pouvoir gérer un service httpd avec le moniteur, vous devez d'abord installer le service (soit automatiquement au cours de l'installation, soit manuellement).

Vous pouvez installer httpd en tant que service Windows NT à partir de la ligne de commandes et depuis le sous-répertoire httpd `bin` comme suit :

```
httpd.exe -k install
```

Si vous avez installé plusieurs services httpd sur votre ordinateur, vous devrez spécifier le nom du service que vous voulez installer en utilisant la commande suivante (notez que si vous spécifiez un nom durant l'installation, vous devrez aussi le spécifier pour toute opération comportant l'option -k) :

```
httpd.exe -k install -n "Nom-service"
```

Si un service doit utiliser un fichier de configuration spécifique, utilisez ceci :

```
httpd.exe -k install -n "Nom-service" -f "c:\fichiers\Nom-service.conf"
```

Si vous utilisez la première commande sans paramètre particulier, excepté `-k install`, le service aura pour nom `Apache2.4` et le fichier de configuration sera censé être `conf\httpd.conf`.

Supprimer un service httpd est très simple. Utilisez simplement :

```
httpd.exe -k uninstall
```

On peut spécifier un service httpd particulier en utilisant :

```
httpd.exe -k uninstall -n "Nom service"
```

Normalement, le démarrage, le redémarrage et l'arrêt d'un service httpd s'effectuent via le Moniteur de Service httpd, ou en utilisant des commandes telles que `NET START Apache2.4` et `NET STOP Apache2.4`, ou encore via le gestionnaire de services standard de Windows. Avant de démarrer httpd en tant que service dans quelque but que ce soit, vous devez tester le fichier de configuration du service en utilisant :

```
httpd.exe -n "Nom-service" -t
```

Vous pouvez aussi contrôler un service httpd à l'aide de ses options de ligne de commande. Avec cette méthode, pour démarrer un service httpd installé, vous utiliserez :

```
httpd.exe -k start -n "Nom-Service"
```

Pour arrêter un service httpd via les options de lignes de commande, utilisez ceci :

```
httpd.exe -k stop -n "Nom-Service"
```

ou

```
httpd.exe -k shutdown -n "Nom-Service"
```

Vous pouvez aussi redémarrer un service en exécution et le forcer à relire son fichier de configuration en utilisant :

```
httpd.exe -k restart -n "Nom-Service"
```

Par défaut, tous les services httpd sont configurés pour s'exécuter sous l'utilisateur system (le compte `LocalSystem`). Le compte `LocalSystem` n'a pas de privilèges sur votre réseau, que ce soit via un mécanisme sécurisé de Windows, y compris le système de fichiers, des tubes nommés, DCOM ou des RPC sécurisés. Il a cependant des privilèges élevés en local.

> [!WARNING]
> **N'accordez jamais de privilèges réseau au compte `LocalSystem` ! Si httpd doit pouvoir accéder à des ressources réseau, créez un compte séparé pour httpd comme indiqué ci-dessous.**

Il est fortement fortement conseillé aux utilisateurs de créer un compte séparé pour exécuter le(s) service(s) httpd, et même obligatoire si vous devez accéder à des ressources réseau via httpd.

1. Créez un compte d'utilisateur du domaine normal, et assurez-vous de retenir son mot de passe.
2. Accordez à l'utilisateur nouvellement créé les privilèges `Log on as a service`.
3. Vérifiez que le compte nouvellement créé est membre du groupe Utilisateurs
4. Accordez à ce compte les droits Lecture et Exécution (RX) sur tous les documents et répertoires de scripts (`htdocs` et `cgi-bin` par exemple), et aussi sur l'exécutable binaire `httpd.exe`.
5. Accordez aussi à ce compte les droits de modification sur le répertoire `logs`.

> [!NOTE]
> Il est en général de bonne pratique d'accorder à l'utilisateur sous lequel le service httpd s'exécute les droits en lecture et exécution (RX) sur l'ensemble du répertoire Apache2.4, sauf pour le sous-répertoire `logs`, sur lequel l'utilisateur doit avoir au moins les droits de modification (RWXD).

Si vous permettez à ce compte de se connecter en tant qu'utilisateur et service, vous pouvez ouvrir une session sous ce compte et vérifier s'il a bien le droit d'exécuter les scripts, de lire les pages web, et si vous pouvez démarrer httpd à partir d'une console Windows. Si tout fonctionne, et si vous avez suivi les étapes ci-dessus, httpd devrait s'exécuter en tant que service sans problème.

> [!NOTE]
> **Le code d'erreur 2186** indique probablement que httpd ne peut pas accéder à une ressource réseau nécessaire, et que vous devez revoir la configuration "Log On As" (Se connecter en tant que ...) du service.

Lorsqu'httpd démarre en tant que service, il se peut que vous obteniez un message d'erreur du Gestionnaire de Services Windows. Par exemple, si vous essayez de démarrer httpd en utilisant l'applet Services du Panneau de configuration de Windows, vous pouvez obtenir le message suivant :

```
Could not start the Apache2.4 service on \\COMPUTER
Error 1067; The process terminated unexpectedly.
```

Vous obtiendrez cette erreur à caractère général pour tout problème survenant au cours du démarrage du service httpd. Afin de déterminer exactement la cause du problème, vous devez suivre les instructions permettant d'exécuter httpd pour Windows depuis la ligne de commande.

Si vous rencontrez des problèmes avec le service, il est conseillé de suivre les instructions ci-dessous afin d'essayer de démarrer httpd.exe depuis une console, et d'analyser les erreurs plutôt que vous démener à essayer de démarrer le service.

## Exécuter httpd depuis la console

Il est en général recommandé d'exécuter httpd en tant que service, mais il est parfois plus simple d'utiliser la ligne de commande, en particulier au cours de la configuration initiale et les tests.

Pour exécuter httpd depuis la ligne de commande et en tant qu'application de console, utilisez la commande suivante :

```
httpd.exe
```

httpd va démarrer, et continuera son exécution jusqu'à ce qu'on l'arrête en tapant Ctrl-C.

Vous pouvez également démarrer httpd via le raccourci "Démarrer httpd dans une console" placé dans `Démarrer --> Programmes --> Apache HTTP Server 2.4.xx --> Control Apache Server` au cours de l'installation. Ceci va ouvrir une console Windows, et y démarrer httpd. Si vous n'avez pas installé httpd en tant que service, la fenêtre Windows restera ouverte jusqu'à ce que vous arrêtiez httpd en tapant Ctrl-C dans cette fenêtre. Le serveur va alors s'arrêter au bout de quelques secondes. Cependant, si vous avez installé httpd en tant que service, c'est ce dernier que le raccourci ci-dessus va lancer. Si le service httpd est déjà en cours d'exécution, le raccourci va rester sans effet.

Si httpd s'exécute en tant que service, vous pouvez l'arrêter en ouvrant une autre console et en entrant :

```
httpd.exe -k shutdown
```

Plutôt que de lancer httpd à partir d'une console, il est préférable de l'exécuter en tant que service car dans ce cas, il termine proprement les opérations en cours avant de s'éteindre.

Si le serveur a été lancé depuis une console, vous ne pouvez l'arrêter qu'en pressant la combinaison de touches Ctrl-C dans la même fenêtre.

Vous pouvez aussi redémarrer httpd. Ceci le force à recharger son fichier de configuration. Toute opération en cours peut être achevée sans interruption. Pour redémarrer httpd, vous pouvez soit taper Control-Break dans la fenêtre de console que vous avez utilisée pour le démarrer, soit entrer :

```
httpd.exe -k restart
```

si le serveur s'exécute en tant que service.

> [!NOTE]
> Note pour les utilisateurs familiers de la version Unix de httpd : les commandes ci-dessus représentent pour Windows l'équivalent des commandes `kill -TERM pid` et `kill -USR1 pid`. L'option de ligne de commande `-k` a été choisie à titre de rapprochement avec la commande `kill` utilisée sous Unix.

Si la fenêtre de la console httpd se ferme immédiatement ou inopinément après le démarrage de httpd, ouvrez une console Windows depuis le menu Démarrer --\> Programmes. Placez-vous dans le répertoire d'installation de httpd, tapez la commande `httpd.exe`, et observez le message d'erreur. Allez ensuite dans le répertoire des journaux, et visualisez le fichier `error.log` pour détecter d'éventuelles erreurs de configuration. Si httpd a été installé dans `C:\Program Files\Apache Software Foundation\Apache2.4\`, vous pouvez entrer ce qui suit :

```
c:
cd "\Program Files\Apache Software Foundation\Apache2.4\bin"
httpd.exe
```

Attendez ensuite que httpd s'arrête ou tapez Ctrl-C. Entrez alors la commande suivante :

```
cd ..\logs
more < error.log
```

Lorsqu'on travaille avec httpd, il est important de comprendre comment ce dernier trouve son fichier de configuration. Vous pouvez spécifier un fichier de configuration à partir de la ligne de commande de deux façons :

- L'option `-f` permet de spécifier un chemin absolu ou relatif vers un fichier de configuration particulier :

  (sous Windows 9x, il est recommandé d'utiliser la ligne de commande à cause du manque de fiabilité du support des services fourni par ce système).

  ```
  httpd.exe -f "c:\fichiers-de-mon-serveur\autre-config.conf"
  ```

  ou

  ```
  httpd.exe -f fichiers-de-mon-serveur\autre-config.conf
  ```
- L'option `-n` permet de spécifier le service httpd installé dont le fichier de configuration doit être utilisé :

  ```
  httpd.exe -n "Nom-service"
  ```

Dans les deux cas, la directive [[13-directives/serverroot|ServerRoot]] doit être correctement définie dans le fichier de configuration.

Si vous ne spécifiez aucun fichier de configuration à l'aide des options `-f` ou `-n`, httpd utilisera le nom du fichier de configuration compilé dans le serveur, en général `conf\httpd.conf`. Ce chemin codé en dur est relatif au répertoire d'installation. Vous pouvez vérifier ce chemin à partir de la valeur de l'étiquette `SERVER_CONFIG_FILE` en invoquant httpd avec l'option `-V`, comme ceci :

```
httpd.exe -V
```

httpd va ensuite essayer de déterminer la valeur de son [[13-directives/serverroot|ServerRoot]] en effectuant les recherches suivantes, dans cet ordre :

1. Une directive [[13-directives/serverroot|ServerRoot]] via l'option de ligne de commande `-C`.
2. L'option de ligne de commande `-d`.
3. Le répertoire de travail courant.
4. Une entrée de la base de registre créée dans le cas d'une installation binaire.
5. La racine des documents (`DocumentRoot`) codée en dur dans le serveur. Elle correspond par défaut à `/apache`, et vous pouvez le vérifier en tapant `httpd.exe -V` et en recherchant l'étiquette `HTTPD_ROOT`.

Si vous n'avez pas effectué d'installation binaire, dans certains scénarios, httpd va signaler l'absence de cette clé de registre. On peut passer outre cet avertissement si le serveur a été en mesure de trouver son fichier de configuration d'une autre manière.

La valeur de cette clé correspond au répertoire [[13-directives/serverroot|ServerRoot]] qui contient lui-même le sous-répertoire `conf`. Lors de son démarrage, httpd lit le fichier `httpd.conf` à partir de ce répertoire. Si ce fichier contient une directive [[13-directives/serverroot|ServerRoot]] qui spécifie un répertoire différent de celui que contient la clé de registre ci-dessus, httpd oubliera la clé de registre, et utilisera le répertoire spécifié par le fichier de configuration. Si vous déplacez le répertoire httpd ou ses fichiers de configuration, il est vital de mettre à jour la directive [[13-directives/serverroot|ServerRoot]] dans `httpd.conf` afin de refléter la nouvelle localisation.

## Vérification de l'installation

Une fois httpd démarré (soit à partir d'une console Windows, soit en tant que service), ce dernier va se mettre à l'écoute sur le port 80 (à moins que vous ayiez modifié la directive [[13-directives/listen|Listen]] dans les fichiers de configuration ou que vous ayiez installé httpd pour l'utilisateur courant seulement). Pour vous connecter au serveur et accéder à la page par défaut, lancez un navigateur et entrez cette URL :

```
http://localhost/
```

httpd devrait renvoyer une page de bienvenue et vous devriez voir s'afficher "It Works!". Si rien ne se passe ou si vous obtenez une erreur, consultez le fichier `error.log` dans le sous-répertoire `logs`. Si votre serveur n'est pas connecté au réseau, ou si vous avez de sérieux problèmes avec la configuration de votre DNS (Domain Name Service), vous devez utiliser cette URL :

```
http://127.0.0.1/
```

Si httpd écoute un port non standard, vous devez le préciser explicitement dans l'URL :

```
http://127.0.0.1:8080/
```

Après que votre installation de base fonctionne, vous devez la configurer correctement en éditant les fichiers du sous-répertoire `conf`. Encore une fois, si vous modifiez la configuration du service httpd sous Windows NT, essayez d'abord de redémarrer le service depuis la ligne de commande afin de vous assurer de l'absence d'erreur.

Comme httpd **ne peut pas** partager le même port avec d'autres applications TCP/IP, il se peut que vous soyez amené à arrêter, désinstaller ou reconfigurer certains services avant de démarrer httpd. Ces services entrant en conflit avec httpd comprennent les autres serveurs WWW, certaines implémentations de pare-feu, et même certaines applications client (comme Skype) qui utilisent le port 80 afin de contourner les pare-feu.

## Configuration de l'accès aux ressources réseau

L'accès à des fichiers par le réseau peut être spécifié via deux mécanismes fournis par Windows :

**Association de lettres de lecteur**

Par exemple, `Alias "/images/" Z:/`

**chemins UNC**

Par exemple, `Alias "/images/" "//imagehost/www/images/"`

L'association de lettres de lecteur permet à l'administrateur de maintenir une correspondance avec une certaine machine et un certain chemin en dehors de la configuration d'Apache httpd. Cependant, ces associations ne sont possibles que dans le cadre des sessions interactives, et ne sont pas directement disponibles pour Apache httpd lorsqu'il est démarré en tant que service. **N'utilisez par conséquent que des chemins UNC pour les ressources réseau dans httpd.conf,** de façon à ce que les ressources soient accessibles quelle que soit la manière dont Apache httpd a été démarré (des procédures exotiques et probablement sujettes aux erreurs peuvent permettre de contourner la restriction due aux associations de lettres de lecteur, mais leur utilisation est déconseillée).

**Exemple de DocumentRoot avec chemin UNC**

```apache
UNCList dochost
DocumentRoot "//dochost/www/html/"
```

**Exemple de DocumentRoot avec adresse IP dans le chemin UNC**

```apache
UNCList 192.168.1.50
DocumentRoot "//192.168.1.50/docs/"
```

**Exemple d'Alias et répertoire correspondant avec chemin UNC**

```apache
UNCList imagehost1 imagehost2
Alias "/images/" "//imagehost/www/images/"
Alias "/images2/" "//imagehost2/www/images/"

<Directory "//imagehost/www/images/">
#...
</Directory>
<Directory "//imagehost2/www/images/">
#...
</Directory>
```

Lorsque Apache s'exécute en tant que service, vous devez créer un compte spécifique afin de pouvoir accéder aux ressources réseau, comme décrit ci-dessus.

## Personnalisation sous Windows

- Si on utilise un grand nombre de redirections de journaux via des pipes, il est souvent nécessaire d'augmenter la taille de la mémoire du bureau ("desktop heap"). Pour une information plus détaillée, veuillez vous reporter à la documentation sur les [[11-guides/01-generalites/fichiers-journaux|redirections de journaux]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
