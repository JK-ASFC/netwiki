---
title: "Fichiers journaux"
description: "Apache HTTP Server — Fichiers journaux. Pour véritablement gérer un serveur web, il est nécessaire de disposer d'un retour d'informations à propos de l'activité et des performances du serveur, ainsi que de tout problème qui pourrait survenir. Le serveur HTTP Apache propose des fo"
tags: [apache, guide]
icon: book-open
---

Pour véritablement gérer un serveur web, il est nécessaire de disposer d'un retour d'informations à propos de l'activité et des performances du serveur, ainsi que de tout problème qui pourrait survenir. Le serveur HTTP Apache propose des fonctionnalités de journalisation souples et très complètes. Ce document décrit comment configurer ces fonctionnalités de journalisation et interpréter le contenu des journaux.

## Vue d'ensemble

- [[12-modules/mod_log_config|mod_log_config]]
- [[12-modules/mod_log_forensic|mod_log_forensic]]
- [[12-modules/mod_logio|mod_logio]]
- [[12-modules/mod_cgi|mod_cgi]]

Le serveur HTTP Apache fournit toute une variété de mécanismes différents pour la journalisation de tout ce qui peut se passer au sein de votre serveur, depuis la requête initiale, en passant par le processus de mise en correspondance des URLs, et jusqu'à la fermeture de la connexion, y compris toute erreur pouvant survenir au cours du traitement. De plus, certains modules tiers fournissent des fonctionnalités de journalisation ou insèrent des entrées dans les fichiers journaux existants, et les applications comme les programmes CGI, les scripts PHP ou autres gestionnaires peuvent envoyer des messages vers le journal des erreurs du serveur.

Ce document décrit le fonctionnement des modules de journalisation fournis en standard avec le serveur httpd.

## Avertissement à propos de la sécurité

Tout utilisateur qui a les droits en écriture sur le répertoire dans lequel Apache httpd écrit ses journaux pourra quasi certainement avoir accès à l'uid sous lequel le serveur est démarré, en l'occurrence habituellement root. N'accordez *PAS* aux utilisateurs l'accès en écriture au répertoire dans lequel les journaux sont stockés sans savoir exactement quelles en seraient les conséquences ; voir le document [[11-guides/06-divers/conseils-sur-la-securite|conseils sur la sécurité]] pour plus de détails.

En outre, les journaux peuvent contenir des informations fournies directement par un client, sans caractères d'échappement. Des clients mal intentionnés peuvent donc insérer des caractères de contrôle dans les journaux, et il convient par conséquent d'être très prudent lors de la manipulation des journaux bruts.

## Journal des erreurs

- [[12-modules/core|core]]
- [[13-directives/errorlog|ErrorLog]]
- [[13-directives/errorlogformat|ErrorLogFormat]]
- [[13-directives/loglevel|LogLevel]]

Le journal des erreurs du serveur, dont le nom et la localisation sont définis par la directive [[13-directives/errorlog|ErrorLog]], est le journal le plus important. C'est dans celui-ci que le démon Apache httpd va envoyer les informations de diagnostic et enregistrer toutes les erreurs qui surviennent lors du traitement des requêtes. Lorsqu'un problème survient au démarrage du serveur ou pendant son fonctionnement, la première chose à faire est de regarder dans ce journal, car il vous renseignera souvent sur le problème rencontré et la manière d'y remédier.

Le journal des erreurs est habituellement enregistré dans un fichier (en général `error_log` sur les systèmes de type Unix et `error.log` sur Windows et OS/2). Sur les systèmes de type Unix, le serveur peut aussi enregistrer ses erreurs dans `syslog` ou les rediriger vers un programme par l'intermédiaire d'un tube de communication (pipe).

Le format du journal des erreurs est défini à l'aide de la directive [[13-directives/errorlogformat|ErrorLogFormat]] avec laquelle vous pouvez choisir les valeurs à journaliser. Un format par défaut sera utilisé si vous n'en spécifiez pas un. Un message de journalisation typique se présente comme suit :

```
[Fri Sep 09 10:42:29.902022 2011] [core:error] [pid 35708:tid 4328636416]
[client 72.15.99.187] AH00124: Request exceeded the limit of 10 internal redirects due to probable configuration error
```

Le premier champ de l'entrée du journal est la date et l'heure du message. Le second champ indique le module qui produit le message (core, dans ce cas) et le niveau de sévérité de ce message. Suivent l'ID du processus et éventuellement l'ID du thread du processus qui a été soumis à cette condition. Le troisième champ contient l'adresse IP du client qui a effectué la requête. Vient ensuite le message d'erreur détaillé.

> [!NOTE]
> Notez que certains messages qui étaient auparavant journalisés au niveau `error` ont été rétrogradés au niveau `info` dans httpd 2.4. Par exemple, les messages "File does not exist" pour les réponses 404 sont journalisés au niveau `info` et n'apparaîtront pas dans le journal des erreurs avec la valeur par défaut `warn` de la directive [[13-directives/loglevel|LogLevel]]. Pour restaurer le comportement précédent, spécifiez `LogLevel warn core:info`.

Une grande variété de messages différents peuvent apparaître dans le journal des erreurs. La plupart d'entre eux sont similaires à l'exemple ci-dessus. Le journal des erreurs peut aussi contenir des informations de débogage en provenance de scripts CGI. Toute information qu'un script CGI écrit sur la sortie d'erreurs standard `stderr` sera recopiée telle quelle dans le journal des erreurs.

Mettre un symbole `%L` dans le journal des erreurs et le journal des accès produit un ID d'entrée de journalisation grâce auquel vous pourrez corréler l'entrée du journal des erreurs avec celle du journal des accès. Si [[12-modules/mod_unique_id|mod_unique_id]] est chargé, son ID de requête unique sera utilisé comme ID d'entrée de journalisation.

Pendant la phase de test, il est souvent utile de visualiser en continu le journal des erreurs afin de détecter tout problème éventuel. Sur les systèmes de type Unix, ceci s'effectue à l'aide de la commande :

```
tail -f error_log
```

## Journalisation par module

La directive [[13-directives/loglevel|LogLevel]] permet de spécifier un niveau de sévérité de journalisation pour chaque module. Vous pouvez ainsi résoudre un problème propre à un module particulier en augmentant son volume de journalisation sans augmenter ce volume pour les autres modules. Ceci est particulièrement utile lorsque vous voulez obtenir des détails sur le fonctionnement de modules comme [[12-modules/mod_proxy|mod_proxy]] ou [[12-modules/mod_rewrite|mod_rewrite]].

Pour ce faire, vous devez spécifier le nom du module dans votre directive `LogLevel` :

```apache
LogLevel info rewrite:trace5
```

Dans cet exemple, le niveau de journalisation général est défini à info, et à `trace5` pour [[12-modules/mod_rewrite|mod_rewrite]].

> [!NOTE]
> Cette directive remplace les directives de journalisation par module des versions précédentes du serveur, comme `RewriteLog`.

## Journal des accès

- [[12-modules/mod_log_config|mod_log_config]]
- [[12-modules/mod_setenvif|mod_setenvif]]
- [[13-directives/customlog|CustomLog]]
- [[13-directives/logformat|LogFormat]]
- [[13-directives/setenvif|SetEnvIf]]

Le journal des accès au serveur enregistre toutes les requêtes que traite ce dernier. La localisation et le contenu du journal des accès sont définis par la directive [[13-directives/customlog|CustomLog]]. La directive [[13-directives/logformat|LogFormat]] permet de simplifier la sélection du contenu du journal. Cette section décrit comment configurer le serveur pour l'enregistrement des informations dans le journal des accès.

Le stockage d'informations dans le journal des accès n'est que le point de départ de la gestion de la journalisation. L'étape suivante consiste à analyser ces informations de façon à pouvoir en extraire des statistiques utiles. L'analyse de journaux en général est en dehors du sujet de ce document et ne fait pas vraiment partie intégrante du travail du serveur web lui-même.

Différentes versions du démon Apache httpd utilisaient d'autres modules et directives pour contrôler la journalisation des accès, à l'instar de mod\_log\_referer, mod\_log\_agent, et de la directive `TransferLog`. La directive [[13-directives/customlog|CustomLog]] rassemble désormais les fonctionnalités de toutes les anciennes directives.

Le format du journal des accès est hautement configurable. Il est défini à l'aide d'une chaîne de format qui ressemble sensiblement à la chaîne de format de style langage C de printf(1). Vous trouverez quelques exemples dans les sections suivantes. Pour une liste exhaustive de ce que peut contenir une chaîne de format, vous pouvez vous référer au chapitre [[12-modules/mod_log_config|chaînes de format]] de la documentation du module [[12-modules/mod_log_config|mod_log_config]].

### Format habituel du journal

Voici une configuration typique pour le journal des accès :

```apache
LogFormat "%h %l %u %t \"%r\" %>s %b" common
CustomLog "logs/access_log" common
```

Ici est définie l'*identité* `common` qui est ensuite associée à une chaîne de format de journalisation particulière. La chaîne de format est constituée de directives débutant par le caractère %, chacune d'entre elles indiquant au serveur d'enregistrer un élément particulier d'information. Des caractères littéraux peuvent aussi être insérés dans la chaîne de format ; il seront copiés tels quels dans le flux de sortie destiné à la journalisation. Les guillemets (`"`) doivent être échappées en les faisant précéder d'un anti-slash (`\`) afin qu'elles ne soient pas interprétées comme la fin de la chaîne de format. La chaîne de format peut aussi contenir les caractères de contrôle spéciaux "`\n`" et "`\t`" pour insérer respectivement un passage à la ligne et une tabulation.

La directive [[13-directives/customlog|CustomLog]] définit un nouveau fichier journal en l'associant à l'identité précédemment définie. Le chemin du nom de fichier associé au journal des accès est relatif au chemin défini par la directive [[13-directives/serverroot|ServerRoot]], sauf s'il débute par un slash.

La configuration ci-dessus va enregistrer les entrées de journalisation selon un format connu sous le nom de Common Log Format (CLF) pour "Format de journalisation standard". Ce format standard peut être produit par de nombreux serveurs web différents et lu par de nombreux programmes d'analyse de journaux. Les entrées de fichier journal générées selon le format CLF ressemblent à ceci :

```
127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET
/apache_pb.gif HTTP/1.0" 200 2326
```

Chaque partie de cette entrée de journal est décrite dans ce qui suit.

**`127.0.0.1` (`%h`)**

Il s'agit de l'adresse IP du client (l'hôte distant) qui a envoyé la requête au serveur. Si la directive [[13-directives/hostnamelookups|HostnameLookups]] est positionnée à `On`, le serveur va essayer de déterminer le nom de l'hôte et de l'enregistrer à la place de l'adresse IP. Cette configuration n'est cependant pas recommandée car elle peut ralentir le serveur de manière significative. Il est par conséquent préférable d'utiliser un processeur d'analyse de journaux a posteriori tel que [[10-commandes/logresolve|logresolve]] pour déterminer les noms d'hôte. L'adresse IP indiquée ici n'est pas nécessairement l'adresse IP de la machine devant laquelle se trouve l'utilisateur. Si un serveur mandataire s'intercale entre le serveur et l'utilisateur, l'adresse indiquée sera celle du mandataire et non celle de la machine à l'origine de la requête.

**`-` (`%l`)**

Le "trait d'union" indique que la portion d'information correspondante n'est pas disponible. Dans le cas présent, l'information non disponible est l'identité (RFC 1413) du client telle que déterminée par `identd` sur la machine cliente. Cette information est très peu fiable et ne devrait jamais être utilisée, sauf dans le cas de réseaux internes étroitement contrôlés. Le démon httpd ne cherchera d'ailleurs à obtenir cette information que si la directive [[13-directives/identitycheck|IdentityCheck]] est positionnée à `On`.

**`frank` (`%u`)**

Il s'agit de l'identifiant utilisateur de la personne qui a demandé le document, issu d'une authentification HTTP. Ce même identifiant est en général fourni aux scripts CGI par l'intermédiaire de la valeur de la variable d'environnement `REMOTE_USER`. Si le statut de la requête (voir plus loin) est 401, cette identifiant n'est pas fiable car l'utilisateur n'est pas encore authentifié. Si le document n'est pas protégé par mot de passe, cette partie d'information sera représentée par "`-`", comme la partie précédente.

**`[10/Oct/2000:13:55:36 -0700]` (`%t`)**

L'heure à laquelle la requête a été reçue. Le format est le suivant :

\[jour/mois/année:heure:minutes:secondes zone\] jour = 2\*chiffre mois = 3\*lettre année = 4\*chiffre heure = 2\*chiffre minutes = 2\*chiffre secondes = 2\*chiffre zone = (\`+' | \`-') 4\*chiffre

Il est possible de modifier le format d'affichage de l'heure en spécifiant `%{format}t` dans la chaîne de format du journal, où `format` est une chaîne de format de la forme de celle de la fonction `strftime(3)` de la bibliothèque C standard, ou choisie parmi les formats spéciaux supportés. Pour plus de détails, reportez-vous aux. [[12-modules/mod_log_config|chaînes de format]] de [[12-modules/mod_log_config|mod_log_config]].

**`"GET /apache_pb.gif HTTP/1.0"` (`\"%r\"`)**

La ligne de la requête du client est placée entre guillemets. Elle contient de nombreuses informations utiles. Tout d'abord, la méthode utilisée par le client est `GET`. Ensuite, le client a demandé la ressource `/apache_pb.gif`, et enfin, le client a utilisé le protocole `HTTP/1.0`. Il est aussi possible d'enregistrer séparément une ou plusieurs parties de la requête. Par exemple, la chaîne de format "`%m %U %q %H`" va enregistrer la méthode, le chemin, la chaîne de la requête et le protocole, ce qui donnera le même résultat que "`%r`".

**`200` (`%>s`)**

C'est le code de statut que le serveur retourne au client. Cette information est très importante car elle indique si la requête a fait l'objet d'une réponse positive (codes commençant par 2), une redirection (codes commençant par 3), une erreur due au client (codes commençant par 4), ou une erreur due au serveur (codes commençant par 5). Vous trouverez la liste complète des codes de statut possibles dans la spécification HTTP ([RFC 2616](https://www.rfc-editor.org/rfc/rfc2616)) (RFC2616 section 10).

**`2326` (`%b`)**

La dernière partie indique la taille de l'objet retourné au client, en-têtes non compris. Si aucun contenu n'a été retourné au client, cette partie contiendra "`-`". Pour indiquer l'absence de contenu par "`0`", utilisez `%B` au lieu de `%b`.

### Combined Log Format (Format de journalisation combiné)

Une autre chaîne de format couramment utilisée est le "Combined Log Format" (Format de journalisation combiné). Il s'utilise comme suit :

```apache
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\"" combined
CustomLog "log/access_log" combined
```

Ce format est identique au Common Log Format, avec deux champs supplémentaires. Chacun de ces deux champs utilise la directive commençant par le caractère "%" `%{header}i`, où *header* peut être n'importe quel en-tête de requête HTTP. Avec ce format, le journal des accès se présentera comme suit :

```
127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET
/apache_pb.gif HTTP/1.0" 200 2326
"http://www.example.com/start.html" "Mozilla/4.08 [en]
(Win98; I ;Nav)"
```

Les champs supplémentaires sont :

**`"http://www.example.com/start.html"` (`\"%{Referer}i\"`)**

L'en-tête "Referer" (sic) de la requête HTTP. Il indique le site depuis lequel le client prétend avoir lancé sa requête. (Ce doit être la page qui contient un lien vers `/apache_pb.gif` ou inclut ce dernier fichier).

**`"Mozilla/4.08 [en] (Win98; I ;Nav)"` (`\"%{User-agent}i\"`)**

L'en-tête User-Agent de la requête HTTP. C'est une information d'identification que le navigateur du client envoie à propos de lui-même.

### Journaux d'accès multiples

Plusieurs journaux d'accès peuvent être créés en spécifiant tout simplement plusieurs directives [[13-directives/customlog|CustomLog]] dans le fichier de configuration. Par exemple, les directives suivantes vont créer trois journaux d'accès. Le premier contiendra les informations de base CLF, le second les informations du Referer, et le troisième les informations sur le navigateur. Les deux dernières directives [[13-directives/customlog|CustomLog]] montrent comment simuler les effets des directives `ReferLog` et `AgentLog`.

```apache
LogFormat "%h %l %u %t \"%r\" %>s %b" common
CustomLog "logs/access_log" common
CustomLog "logs/referer_log" "%{Referer}i -> %U"
CustomLog "logs/agent_log" "%{User-agent}i"
```

Cet exemple montre aussi qu'il n'est pas obligatoire d'associer une chaîne de format à un alias au moyen de la directive [[13-directives/logformat|LogFormat]]. Elle peut être définie directement dans la ligne de la directive [[13-directives/customlog|CustomLog]].

### Journalisation conditionnelle

Il est parfois souhaitable d'exclure certaines entrées des journaux d'accès en fonction des caractéristiques de la requête du client. On peut aisément accomplir ceci à l'aide des [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|variables d'environnement]]. Tout d'abord, une variable d'environnement doit être définie pour indiquer que la requête remplit certaines conditions. Pour ceci, on utilise en général la directive [[13-directives/setenvif|SetEnvIf]], puis la clause `env=` de la directive [[13-directives/customlog|CustomLog]] pour inclure ou exclure les requêtes pour lesquelles la variable d'environnement est définie. Quelques exemples :

```apache
# Marque les requêtes en provenance de l'interface loop-back
SetEnvIf Remote_Addr "127\.0\.0\.1" dontlog
# Marque les requêtes pour le fichier robots.txt
SetEnvIf Request_URI "^/robots\.txt$" dontlog
# Journalise toutes les autres requêtes
CustomLog "logs/access_log" common env=!dontlog
```

Autre exemple, imaginons l'enregistrement des requêtes en provenance d'utilisateurs de langue anglaise dans un journal, et celles des autres utilisateurs dans un autre journal.

```apache
SetEnvIf Accept-Language "en" english
CustomLog "logs/english_log" common env=english
CustomLog "logs/non_english_log" common env=!english
```

Dans le contexte d'une mise en cache, il peut être intéressant de connaître l'efficacité du cache. Pour y parvenir, on pourrait utiliser cette méthode simple :

```apache
SetEnv CACHE_MISS 1
LogFormat "%h %l %u %t "%r " %>s %b %{CACHE_MISS}e" common-cache
CustomLog "logs/access_log" common-cache
```

[[12-modules/mod_cache|mod_cache]] va s'exécuter avant [[12-modules/mod_env|mod_env]], et si son action est couronnée de succès, il délivrera le contenu sans faire appel à ce dernier. Si l'URL se trouve dans le cache, la valeur journalisée sera alors `-`, tandis que dans le cas contraire elle sera `1`.

En plus de la syntaxe `env=`, la directive [[13-directives/logformat|LogFormat]] supporte les valeurs de journalisation conditionnelles basées sur le code de la réponse HTTP :

```apache
LogFormat "%400,501{User-agent}i" browserlog
LogFormat "%!200,304,302{Referer}i" refererlog
```

Dans le premier exemple, le `User-agent` sera enregistré si le code d'état HTTP est 400 ou 501. Dans le cas contraire, c'est un caractère "-" qui sera enregistré à la place. Dans le second exemple, le `Referer` sera enregistré si le code d'état HTTP n'est **pas** 200, 304, ou 302 (remarquez le caractère "!" avant les codes d'état).

Bien que nous venions de montrer que la journalisation conditionnelle est souple et très puissante, cette méthode de contrôle du contenu des journaux n'est pas la seule. Les fichiers journaux sont plus utiles quand ils contiennent un enregistrement complet de l'activité du serveur, et il est souvent plus aisé de simplement traiter à posteriori les fichiers journaux pour supprimer les requêtes que vous ne voulez pas y voir apparaître.

## Rotation des journaux

Même sur un serveur modérément sollicité, les fichiers journaux grossissent rapidement — le journal des accès croît à peu près de 1 Mo ou plus toutes les 10000 requêtes. Sans rotation, les journaux consomment de plus en plus d’espace disque et deviennent difficiles à analyser. Il est donc recommandé de configurer une rotation automatique des journaux dès le départ.

### Utilisation de rotatelogs (recommandé)

L’approche la plus simple consiste à utiliser le programme [[10-commandes/rotatelogs|rotatelogs]] intégré à httpd en utilisant la redirection des journaux. Ce programme permet une rotation des journaux sans avoir à redémarrer le serveur et sans outil externe. Pour une rotation des journaux toutes les 24 heures :

```apache
CustomLog "|/usr/local/apache/bin/rotatelogs /var/log/httpd/access_log 86400" combined
ErrorLog  "|/usr/local/apache/bin/rotatelogs /var/log/httpd/error_log 86400"
```

Pour une rotation lorsque la taille du journal atteint une certaine valeur (par exemple 100 Mo) :

```apache
CustomLog "|/usr/local/apache/bin/rotatelogs /var/log/httpd/access_log 100M" combined
```

Vous pouvez aussi utiliser un motif de nom de fichier avec horodatage sous forme d’une chaîne au format `strftime` :

```apache
CustomLog "|/usr/local/apache/bin/rotatelogs /var/log/httpd/access_log.%Y-%m-%d 86400" combined
```

Voir [[10-commandes/rotatelogs|rotatelogs]] pour une description complète de ses options, en particulier les temps de décalage, les limitations de nombre de fichiers et la compression.

### Utilisation de logrotate ou de la gestion des journaux par le système

La plupart des distributions de Linux fournissent le programme `logrotate` qui effectue une rotation, une compression et une expiration des fichiers journaux selon une planification. Si votre distribution comporte déjà une configuration de logrotate pour httpd (examinez `/etc/logrotate.d/`), elle gère peut-être déjà la rotation pour vous.

Lorsqu’on utilise un outil de rotation externe comme `logrotate`, il faut faire en sorte que httpd réouvre ses fichiers journaux quand les anciens ont été mis de côté. Pour ce faire, l’approche standard est un redémarrage *graceful* :

```bash
/usr/sbin/apachectl graceful
```

Votre script `postrotate` dans la configuration de logrotate doit contenir cette dernière commande (ou la commande équivalente `systemctl reload`). Comme httpd continue d’écrire dans l’ancien fichier jusqu’à ce qu’il reçoive le signal, tout post-traitement des fichiers ayant subi une rotation doit prévoir un bref délai.

## Journaux redirigés

httpd peut écrire dans les fichiers journaux des erreurs et des accès à travers un tube (pipe) vers un autre processus, plutôt que d’écrire directement dans un fichier. Pour mettre en œuvre cette redirection, remplacez le nom du fichier par le caractère pipe "`|`", suivi de la commande qui recevra les entrées du journal sur son entrée standard :

```apache
CustomLog "|/usr/local/apache/bin/rotatelogs /var/log/httpd/access_log 86400" combined
```

httpd démarre le processus de redirection des journaux au démarrage du serveur et le redémarre automatiquement s’il se plante (ce comportement est parfois nommé « journalisation redirigée fiable »). L’ensemble de la commande à partir du caractère pipe doit être entourée de guillemets — cette syntaxe fonctionne pour les deux directives [[13-directives/customlog|CustomLog]] et [[13-directives/errorlog|ErrorLog]].

Les processus de redirection des journaux sont lancés par le processus httpd parent et héritent de son identifiant utilisateur. Cela signifie en général qu’ils s’exécutent en tant que root ; faites donc en sorte que les programmes de redirection des journaux restent simples et sécurisés.

Par défaut, le processus de redirection des journaux est lancé directement, sans passer par un shell. Vous pouvez utiliser "`|$`" à la place de "`|`" pour effectuer ce lancement via un shell (en général `/bin/sh -c`) :

```apache
CustomLog "|$/usr/local/apache/bin/rotatelogs /var/log/httpd/access_log 86400" combined
```

La variante avec shell est parfois requise si votre commande redirigée utilise des fonctionnalités du shell comme les caractères génériques ou le développement de variable. Dans la plupart des cas, il est préférable d’utiliser l’invocation directe (sans passer par un shell).

> [!NOTE]
> **Note à propos de la plateforme Windows**
>
> Notez que sous Windows, la mémoire allouée au bureau (desktop heap) peut devenir insuffisante si vous utilisez de nombreux processus vers lesquels sont redirigés des journaux via un pipe, et ceci particulièrement si httpd s'exécute en tant que service. La quantité de mémoire du bureau allouée à chaque service est spécifiée dans le troisième argument du paramètre `SharedSection` de la clé de registre HKEY\_LOCAL\_MACHINE\\System\\CurrentControlSet\\Control\\SessionManager\\SubSystems\\Windows. **Modifiez cette valeur avec prudence** ; les précautions d'usage s'imposent lorsqu'on modifie la base de registre, mais vous pouvez aussi saturer la mémoire du bureau si vous spécifiez une valeur trop élevée.

## Hôtes virtuels

Lorsqu'un serveur possède plusieurs [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|hôtes virtuels]], il existe de nombreuses solutions pour gérer les fichiers journaux. Par exemple, on peut utiliser les journaux comme s'il s'agissait d'un serveur avec un seul hôte. Il suffit pour cela de placer les directives de journalisation en dehors des sections [[13-directives/virtualhost|<VirtualHost>]] au niveau du serveur principal, ce qui a pour effet de journaliser toutes les requêtes dans le même journal des accès et des erreurs. Cette technique est cependant inappropriée pour recueillir des statistiques sur chaque hôte virtuel individuellement.

Si des directives [[13-directives/customlog|CustomLog]] ou [[13-directives/errorlog|ErrorLog]] sont placées dans une section [[13-directives/virtualhost|<VirtualHost>]], toutes les requêtes ou erreurs pour cet hôte virtuel ne seront enregistrées que dans le fichier spécifié. Tout hôte virtuel qui ne possède pas de directives de journalisation verra ses requêtes enregistrées dans le journal du serveur principal. Cette technique est appropriée pour un petit nombre d'hôtes virtuels, mais si ce nombre est important, elle peut devenir compliquée à gérer. En outre, des problèmes de [[11-guides/03-serveurs-virtuels/limites-des-descripteurs-de-fichiers|nombre de descripteurs de fichiers insuffisant]] peuvent rapidement apparaître.

Il existe un très bon compromis pour le journal des accès. En intégrant les informations à propos de l'hôte virtuel à la chaîne de format du journal, il est possible de journaliser tous les hôtes dans le même journal, puis de séparer ultérieurement le journal en plusieurs journaux individuels. Considérons par exemple les directives suivantes :

```apache
LogFormat "%v %p %h %l %u %t \"%r\" %>s %b" commonvhost
CustomLog "logs/access_log" commonvhost
```

Le champ `%v` sert à enregistrer le nom de l'hôte virtuel qui traite la requête. Un programme tel que [[10-commandes/split-logfile|split-logfile]] peut ensuite être utilisé pour générer "à froid" autant de journaux que d'hôtes virtuels.

## Autres fichiers journaux

- [[12-modules/mod_logio|mod_logio]]
- [[12-modules/mod_log_config|mod_log_config]]
- [[12-modules/mod_log_debug|mod_log_debug]]
- [[12-modules/mod_log_forensic|mod_log_forensic]]
- [[12-modules/mod_cgi|mod_cgi]]
- [[13-directives/bufferedlogs|BufferedLogs]]
- [[13-directives/forensiclog|ForensicLog]]
- [[13-directives/logformat|LogFormat]]
- [[13-directives/logmessage|LogMessage]]
- [[13-directives/pidfile|PidFile]]
- [[13-directives/scriptlog|ScriptLog]]
- [[13-directives/scriptlogbuffer|ScriptLogBuffer]]
- [[13-directives/scriptloglength|ScriptLogLength]]

### Enregistrement du nombre réel d'octets envoyés et reçus

Le module [[12-modules/mod_logio|mod_logio]] fournit deux champs [[13-directives/logformat|LogFormat]] supplémentaires (%I et %O) qui permettent d'enregistrer le nombre réel d'octets reçus et envoyés sur le réseau.

### Journalisation de style investigation judiciaire (forensic logging)

Le module [[12-modules/mod_log_forensic|mod_log_forensic]] permet la journalisation à des fins d'investigation judiciaire des requêtes des clients. La journalisation est effectuée avant et après le traitement de la requête, qui fait donc l'objet de deux entrées dans le journal. Le générateur de journaux d'investigation est très strict et ne permet aucune personnalisation. C'est un inestimable outil de débogage et de sécurité.

### Fichier PID

Au démarrage, le démon httpd Apache enregistre l'identifiant du processus httpd parent dans le fichier `logs/httpd.pid`. Le nom de ce fichier peut être modifié à l'aide de la directive [[13-directives/pidfile|PidFile]]. Cet identifiant permet à l'administrateur de redémarrer et arrêter le démon en envoyant des signaux au processus parent ; sous Windows, vous devez utiliser l'option de ligne de commande -k. Pour plus de détails, consulter la page [[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|Arrêt et redémarrage]].

### Journal des scripts

Afin de faciliter le débogage, la directive [[13-directives/scriptlog|ScriptLog]] vous permet d'enregistrer les entrées et sorties des scripts CGI. Elle ne doit être utilisée que pendant la phase de test, et en aucun cas sur un serveur en production. Vous trouverez plus d'informations dans la documentation du module [[12-modules/mod_cgi|mod_cgi]].

### Journalisation de débogage configurable

La directive [[13-directives/logmessage|LogMessage]] vous permet de créer vos propres messages de journalisation personnalisés pour faciliter vos opérations de débogage.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
