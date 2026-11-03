---
title: "Vue d'ensemble des nouvelles fonctionnalités de la version 2.4 du serveur HTTP Apache"
description: "Apache HTTP Server — Vue d'ensemble des nouvelles fonctionnalités de la version 2.4 du serveur HTTP Apache. Ce document décrit les modifications majeures apportées par la version 2.4 du serveur HTTP Apache. Pour les nouvelles fonctionnalités ajoutées par la version 2.2, se référer au document Nouvelles fonctionnalités de la version 2.2."
tags: [apache, guide]
icon: book-open
---

Ce document décrit les modifications majeures apportées par la version 2.4 du serveur HTTP Apache. Pour les nouvelles fonctionnalités ajoutées par la version 2.2, se référer au document [[11-guides/01-generalites/apercu-des-nouvelles-fonctionnalites-de-la-version-2-2-du-serveur-http|Nouvelles fonctionnalités de la version 2.2]].

## Améliorations du noyau

**Modules multiprocessus (MPMs) chargeables à l'exécution**

Plusieurs MPMs peuvent maintenant être [[11-guides/01-generalites/modules-multi-processus-mpms|compilés en tant que modules chargeables]]. Le choix du MPM à utiliser s'effectue à l'exécution via la directive [[13-directives/loadmodule|LoadModule]].

**MPM Event**

Le [[12-modules/event|MPM Event]] n'en est plus au stade expérimental et est maintenant pleinement supporté.

**Support du mode asynchrone**

Le support des lectures/écritures asynchrones pour les MPMs et les plateformes qui l'implémentent a été amélioré.

**Configuration du niveau de journalisation (LogLevel) par module et par répertoire**

La directive [[13-directives/loglevel|LogLevel]] peut maintenant être définie par module et par répertoire. Les nouveaux niveaux `trace1` à `trace8` ont été ajoutés au dessus du niveau de journalisation `debug`.

**Sections de configuration au niveau requête**

Les sections [[13-directives/if|<If>]], [[13-directives/elseif|<ElseIf>]] et [[13-directives/else|<Else>]] permettent de définir une configuration en fonction de critères liés à la requête.

**Interpréteur d'expressions à usage général**

Un nouvel interpréteur d'expressions permet de spécifier des [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|conditions complexes]] via des directives à syntaxe commune comme [[13-directives/setenvifexpr|SetEnvIfExpr]], [[13-directives/rewritecond|RewriteCond]], [[13-directives/header|Header]], [[13-directives/if|<If>]], etc...

**KeepAliveTimeout en millisecondes**

Il est maintenant possible de définir la directive [[13-directives/keepalivetimeout|KeepAliveTimeout]] en millisecondes.

**Directive NameVirtualHost**

Cette directive n'est plus nécessaire et est maintenant obsolète.

**Directives autorisées dans les fichiers `.htaccess`**

La nouvelle directive [[13-directives/allowoverridelist|AllowOverrideList]] permet de contrôler de manière plus précise la liste des directives autorisées dans les fichiers `.htaccess`.

**Variables dans les fichiers de configuration**

La directive [[13-directives/define|Define]] permet de définir des variables dans les fichiers de configuration, améliorant ainsi la clareté de la présentation si la même valeur est utilisée en plusieurs points de la configuration.

**Diminution de la mémoire utilisée**

Bien qu'elle propose de nombreuses nouvelles fonctionnalités, la version 2.4.x tend à utiliser moins de mémoire que la version 2.2.x.

## Nouveau modules

**[[12-modules/mod_proxy_fcgi|mod_proxy_fcgi]]**

Support des serveur FastCGI d'arrière-plan pour [[12-modules/mod_proxy|mod_proxy]].

**[[12-modules/mod_proxy_scgi|mod_proxy_scgi]]**

Support des serveurs SCGI d'arrière-plan pour [[12-modules/mod_proxy|mod_proxy]].

**[[12-modules/mod_proxy_express|mod_proxy_express]]**

Ajoute à [[12-modules/mod_proxy|mod_proxy]] la configuration dynamique de mandataires inverses en masse.

**[[12-modules/mod_remoteip|mod_remoteip]]**

Remplace l'adresse IP distante et le nom d'hôte apparents du client pour la requête courante par la liste d'adresses IP présentée par un mandataire ou un répartiteur de charge via les en-têtes de la requête.

**[[12-modules/mod_heartmonitor|mod_heartmonitor]], [[12-modules/mod_lbmethod_heartbeat|mod_lbmethod_heartbeat]]**

Permet à [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] de répartir la charge en fonction du nombre de connexions actives sur les serveurs d'arrière-plan.

**[[12-modules/mod_proxy_html|mod_proxy_html]]**

Anciennement module tiers, il supporte la correction des liens HTML dans une situation de mandat inverse, où le serveur d'arrière-plan génère des URLs qui ne sont pas valides du point de vue des clients du mandataire.

**[[12-modules/mod_sed|mod_sed]]**

Une amélioration de [[12-modules/mod_substitute|mod_substitute]] qui permet d'éditer le corps de la réponse avec toute la puissance de la commande sed.

**[[12-modules/mod_auth_form|mod_auth_form]]**

Implémente une authentification à base de formulaire.

**[[12-modules/mod_session|mod_session]]**

Permet de conserver les données de sessions des clients sous forme de cookies ou dans une base de données.

**[[12-modules/mod_allowmethods|mod_allowmethods]]**

Permet de restreindre l'utilisation de certaines méthodes HTTP sans interférer avec l'authentification et l'autorisation.

**[[12-modules/mod_lua|mod_lua]]**

Embarque le langage [Lua](http://www.lua.org/) dans httpd pour la configuration et les fonctions logiques courantes (Expérimental).

**[[12-modules/mod_log_debug|mod_log_debug]]**

Permet d'introduire une journalisation personnalisée à différentes phases du traitement de la requête.

**[[12-modules/mod_buffer|mod_buffer]]**

Fournit un tampon pour les piles des filtres en entrée et en sortie.

**[[12-modules/mod_data|mod_data]]**

Convertit un corps de réponse en URL de type données RFC2397.

**[[12-modules/mod_ratelimit|mod_ratelimit]]**

Permet de limiter la bande passante pour certains clients.

**[[12-modules/mod_request|mod_request]]**

Fournit des filtres permettant de gérer et de mettre à disposition les corps des requêtes HTTP.

**[[12-modules/mod_reflector|mod_reflector]]**

Permet de renvoyer comme réponse le corps de la requête via la pile du filtre de sortie.

**[[12-modules/mod_slotmem_shm|mod_slotmem_shm]]**

Met à disposition un fournisseur de mémoire partagée à base de slots (du style tableau de bord).

**[[12-modules/mod_xml2enc|mod_xml2enc]]**

Anciennement module tiers, il supporte l'internationalisation dans les modules de filtrage basés sur libxml2 (support du markup)

**[[12-modules/mod_macro|mod_macro]] (disponible à partir de la version 2.4.5)**

Permet d'utiliser des macros au sein des fichiers de configuration.

**[[12-modules/mod_proxy_wstunnel|mod_proxy_wstunnel]] (disponible à partir de la version 2.4.5)**

Support des tunnels web-socket.

**[[12-modules/mod_authnz_fcgi|mod_authnz_fcgi]] (disponible à partir de la version 2.4.10)**

Permet aux applications d'autorisation FastCGI d'authentifier et/ou autoriser les clients.

**[[12-modules/mod_http2|mod_http2]] (disponible à partir de la version 2.4.17)**

Support de la couche transport HTTP/2.

**[[12-modules/mod_proxy_http2|mod_proxy_http2]] (disponible à partir de la version 2.4.19)**

Support du protocole HTTP/2 pour [[12-modules/mod_proxy|mod_proxy]]

**[[12-modules/mod_proxy_hcheck|mod_proxy_hcheck]] (disponible à partir de la version 2.4.21)**

Support d'un bilan de santé dynamique indépendant pour les serveurs d'arrière-plan mandatés distants.

**[[12-modules/mod_brotli|mod_brotli]] (disponible à partir de la version 2.4.26)**

Support de l'algorithme de compression Brotli.

**[[12-modules/mod_md|mod_md]] (disponible à partir de la version 2.4.30)**

Automatisation de l'obtention de certificats via le protocole ACME.

**[[12-modules/mod_proxy_uwsgi|mod_proxy_uwsgi]] (disponible à partir de la version 2.4.30)**

module passerelle UWSGI pour [[12-modules/mod_proxy|mod_proxy]].

**[[12-modules/mod_socache_redis|mod_socache_redis]] (disponible à partir de la version 2.4.39)**

Supporte le fournisseur de cache d'objets partagés basé sur [Redis](http://redis.io/).

**[[12-modules/mod_systemd|mod_systemd]] (disponible à partir de la version 2.4.42)**

intégration de systemd. Permet d'utiliser httpd en tant que service avec le paramètre systemd `Type=notify`.

## Améliorations des modules

**[[12-modules/mod_ssl|mod_ssl]]**

[[12-modules/mod_ssl|mod_ssl]] peut maintenant vérifier la validité des certificats clients en se connectant à un serveur OCSP. Il est possible de définir un répondeur par défaut, et de choisir si l'on préfère le répondeur désigné dans le certificat client.

En outre, [[12-modules/mod_ssl|mod_ssl]] supporte maintenant l'estampillage OCSP (OCSP stapling), qui permet au serveur d'attester la validité de son certificat auprès du client au cours de la phase de négociation de la connexion.

Enfin, [[12-modules/mod_ssl|mod_ssl]] peut maintenant être configuré pour que celui-ci partage les données de session SSL entre les serveurs via memcached.

Le support des clés EC a été ajouté à celui des clés RSA et DSA.

Support de TLS-SRP (disponible à partir de la version 2.4.4).

**[[12-modules/mod_proxy|mod_proxy]]**

La directive [[13-directives/proxypass|ProxyPass]] est maintenant configurée de manière optimale dans les sections [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]], et offre un gain de performances important par rapport à la syntaxe traditionnelle à deux paramètres lorsqu'elle est présente en grand nombre.

Il est maintenant possible de configurer l'adresse source dans les requêtes mandatées.

Support des sockets de type Unix vers le serveur d'arrière-plan (disponible à partir de la version 2.4.7).

**[[12-modules/mod_proxy_balancer|mod_proxy_balancer]]**

Le gestionnaire de répartition de charge propose de nouvelles fonctionnalités. Ainsi, les possibilités de configuration des membres du groupe de répartition de charge pendant l'exécution ont été améliorées (possibilité d'ajout d'un membre supplémentaire).

Configuration à l'exécution d'un sous-ensemble de paramètres de répartition de charge.

Les membres du groupe de répartition peuvent être définis à 'Drain' de façon à ce qu'ils ne répondent qu'aux sessions persistantes existantes, ce qui permet de les mettre hors ligne en douceur.

Les règlages du répartiteur de charge peuvent être rendus persistants après redémarrage.

**[[12-modules/mod_cache|mod_cache]]**

Le filtre CACHE du module [[12-modules/mod_cache|mod_cache]] peut être inséré à un certain point de la chaîne de filtrage pour contrôler plus finement la mise en cache.

[[12-modules/mod_cache|mod_cache]] peut maintenant mettre en cache des requêtes HEAD.

Chaque fois que cela est possible, les directives de [[12-modules/mod_cache|mod_cache]] peuvent maintenant être définies au niveau du répertoire, et non plus seulement au niveau du serveur principal.

L'URL de base des URLs en cache peut être personnalisée de façon à ce qu'un cluster de caches puisse partager le même préfixe d'URL.

[[12-modules/mod_cache|mod_cache]] peut maintenant servir du contenu non mis à jour lorsqu'un serveur d'arrière-plan n'est pas disponible (erreur 5xx).

[[12-modules/mod_cache|mod_cache]] peut maintenant insérer HIT/MISS/REVALIDATE dans un en-tête X-Cache.

**[[12-modules/mod_include|mod_include]]**

Support de l'attribut 'onerror' dans un élément 'include', permettant de renvoyer un message d'erreur personnalisé à la place du message d'erreur par défaut.

**[[12-modules/mod_cgi|mod_cgi]], [[12-modules/mod_include|mod_include]], [[12-modules/mod_isapi|mod_isapi]], ...**

La traduction des en-têtes en variables d'environnement est plus stricte qu'avant, ce qui permet de diminuer l'exposition aux attaques de type cross-site-scripting via injection d'en-têtes. Les noms d'en-têtes contenant des caractères invalides (comme les caractères de soulignement) ne sont plus convertis en variables d'environnement. Le document [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Les variables d'environnement dans Apache]] présente quelques pistes pour contourner ce problème avec les clients anciens qui nécessitent de tels en-têtes (Ceci affecte tous les modules qui utilisent ces variables d'environnement).

**[[12-modules/mod_authz_core|mod_authz_core]] Conteneurs de logique d'autorisation**

La directive [[13-directives/require|Require]] et les directives de conteneurs associées, comme [[13-directives/requireall|<RequireAll>]], permettent de définir une logique d'autorisation avancée.

**[[12-modules/mod_rewrite|mod_rewrite]]**

La directive [[13-directives/rewriterule|RewriteRule]] dispose maintenant des drapeaux `[QSD]` (Query String Discard) et `[END]` qui permettent de simplifier les scénarios de réécriture courants.

Possibilité d'utiliser des expressions booléennes complexes dans la directive [[13-directives/rewritecond|RewriteCond]].

Possibilité d'utiliser des requêtes SQL en tant que fonctions dans la directive [[13-directives/rewritemap|RewriteMap]].

**[[12-modules/mod_ldap|mod_ldap]], [[12-modules/mod_authnz_ldap|mod_authnz_ldap]]**

[[12-modules/mod_authnz_ldap|mod_authnz_ldap]] ajoute le support des groupes imbriqués.

[[12-modules/mod_ldap|mod_ldap]] apporte les directives [[13-directives/ldapconnectionpoolttl|LDAPConnectionPoolTTL]] et [[13-directives/ldaptimeout|LDAPTimeout]], ainsi que d'autres améliorations dans le traitement des délais. Ceci s'avère utile pour les configurations où un pare-feu à mémoire d'état (stateful) rejète les connexions inactives vers le serveur LDAP.

[[12-modules/mod_ldap|mod_ldap]] propose la directive [[13-directives/ldaplibrarydebug|LDAPLibraryDebug]] qui permet de journaliser les informations de débogage fournies par la boîte à outils LDAP utilisée.

**[[12-modules/mod_info|mod_info]]**

[[12-modules/mod_info|mod_info]] est maintenant capable d'afficher la configuration préinterprétée sur stdout au cours du démarrage du serveur.

**[[12-modules/mod_auth_basic|mod_auth_basic]]**

Nouveau mécanisme générique permettant d'effectuer une authentification basique (disponible à partir de la version 2.4.5).

## Améliorations des programmes

**[[10-commandes/fcgistarter|fcgistarter]]**

Nouvel utilitaire pour le démarrage des démons FastCGI.

**[[10-commandes/htcacheclean|htcacheclean]]**

Les URLs présentes dans le cache peuvent maintenant être affichées, accompagnées éventuellement de leurs métadonnées.

Possibilité de supprimer explicitement des URLs individuelles présentes dans le cache.

Les tailles de fichiers peuvent maintenant être arrondies au multiple de la taille de bloc donnée, les limites de taille collant de ce fait d'avantage à la taille réelle sur disque.

La taille du cache peut maintenant être limitée par le nombre d'inodes, en plus de la possibilité de limitation par la taille des fichiers.

**[[10-commandes/rotatelogs|rotatelogs]]**

Possibilité de créer un lien vers le fichier journal courant.

Possibilité d'invoquer un script personnalisé après la rotation.

**[[10-commandes/htpasswd|htpasswd]], [[10-commandes/htdbm|htdbm]]**

Support de l'algorithme bcrypt (disponible à partir de la version 2.4.4).

## Documentation

**mod\_rewrite**

La documentation du module [[12-modules/mod_rewrite|mod_rewrite]] a été réorganisée et presque entièrement réécrite en mettant l'accent sur les exemples et l'utilisation courante, ainsi que sur l'incitation à utiliser d'autres solutions lorsque cela s'avère plus approprié. Le document [[11-guides/05-reecriture-mod-rewrite/00-guide-pour-le-module-apache-mod-rewrite|Rewrite Guide]] constitue maintenant une section de premier niveau ; il est mieux organisé et contient beaucoup plus de détails.

**mod\_ssl**

La documentation du module [[12-modules/mod_ssl|mod_ssl]] a été grandement améliorée, avec plus d'exemples et un niveau "Bien démarrer" qui s'ajoutent aux détails techniques déjà présents dans la précédente documentation.

**Caching Guide**

Le [[11-guides/01-generalites/guide-de-la-mise-en-cache|Guide de la mise en cache]] a été réécrit afin de bien faire la différence entre les fonctionnalités de mise en cache de la RFC2616 HTTP/1.1 fournies par le module [[12-modules/mod_cache|mod_cache]], et la mise en cache générique de type clé/valeur fournie par l'interface [[11-guides/01-generalites/le-cache-des-objets-partages-du-serveur-http-apache|socache]], mais aussi pour couvrir la mise en cache spécialisée fournie par des mécanismes tels que ceux du module [[12-modules/mod_file_cache|mod_file_cache]].

## Modifications concernant les développeur de modules

**Ajout de code pour la vérification de la configuration**

Une nouvelle fonction, `check_config`, a été ajoutée et s'exécute entre les fonctions `pre_config` et `open_logs`. Elle s'exécute aussi avant la fonction `test_config` si l'option `-t` est passée au démon [[10-commandes/httpd|httpd]]. La fonction `check_config` permet aux modules de vérifier l'interdépendance des valeurs des directives de configuration et d'ajuster ces valeurs, alors que les messages du serveur peuvent encore être affichés sur la console. L'utilisateur est ainsi averti des erreurs de configuration avant que la fonction du noyau `open_logs` ne redirige les sorties de la console vers le journal des erreurs.

**Ajout d'un analyseur syntaxique d'expressions**

Nous disposons à présent d'un analyseur générique d'expressions, dont l'API est décrite dans *ap\_expr.h*. Il s'agit d'une adaptation de l'analyseur qu'on trouvait auparavant dans [[12-modules/mod_ssl|mod_ssl]].

**Conteneurs de logique d'autorisation**

Afin de fournir une logique d'autorisation avancée via des directives telles que [[13-directives/requireall|<RequireAll>]], les modules d'autorisation s'enregistrent maintenant en tant que fournisseur par le biais de ap\_register\_auth\_provider().

**Interface de mise en cache des petits objets**

Le fichier d'en-têtes *ap\_socache.h* fournit une interface à base de fournisseur pour la mise en cache des petits objets de données, en s'inspirant de l'implémentation précédente du cache de session par [[12-modules/mod_ssl|mod_ssl]]. Sont supportés actuellement : les fournisseurs utilisant un tampon cyclique en mémoire partagée, les fichiers dbm sur disque, et les caches distribués de type memcache.

**Ajout du point d'ancrage Cache Status**

Le module [[12-modules/mod_cache|mod_cache]] inclut maintenant un nouveau point d'ancrage, `cache_status`, qui est appelé lorsque la décision à propos de la mise en cache est connue. Il en existe une implémentation par défaut qui ajoute les en-têtes optionnels `X-Cache` et `X-Cache-Detail` à la réponse.

La documentation du développeur contient une [[11-guides/09-developpement/api-changes-in-apache-http-server-2-4-since-2-2|liste détaillée des modifications de l'API]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
