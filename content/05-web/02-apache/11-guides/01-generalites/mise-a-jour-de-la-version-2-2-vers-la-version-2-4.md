---
title: "Mise à jour de la version 2.2 vers la version 2.4"
description: "Apache HTTP Server — Mise à jour de la version 2.2 vers la version 2.4. Afin d'assister les utilisateurs lors de leurs opérations de mise à jour, nous maintenons un document qui comporte des informations critiques à l'attention des personnes qui utilisent déjà le serveur HTTP Apache. Ces informations ne sont qu"
tags: [apache, guide]
icon: book-open
---

Afin d'assister les utilisateurs lors de leurs opérations de mise à jour, nous maintenons un document qui comporte des informations critiques à l'attention des personnes qui utilisent déjà le serveur HTTP Apache. Ces informations ne sont que de brèves notes, et vous trouverez plus d'informations dans le document [[11-guides/01-generalites/vue-d-ensemble-des-nouvelles-fonctionnalites-de-la-version-2-4-du-serv|Nouvelles fonctionnalités]], ou dans le fichier `src/CHANGES`. Les développeurs d'applications et de modules trouveront un résumé des modifications de l'API dans la vue d'ensemble [[11-guides/09-developpement/api-changes-in-apache-http-server-2-4-since-2-2|Mises à jour de l'API]].

Ce document présente les changements de comportement du serveur qui peuvent nécessiter une modification de la configuration, et une méthode pour utiliser la version 2.4 du serveur en parallèle avec la version 2.2. Pour tirer parti des nouvelles fonctionnalités de la version 2.4, reportez-vous au document "Nouvelles fonctionnalités".

Ce document ne décrit que les modifications intervenues entre les versions 2.2 et 2.4. Si vous effectuez une mise à jour depuis la version 2.0, vous devez aussi consulter le [document de mise à jour de 2.0 vers 2.2.](http://httpd.apache.org/docs/2.2/upgrading.html)

## Modifications des paramètres de compilation

Le processus de compilation est très similaire à celui de la version 2.2. Dans la plupart des cas, vous pourrez utiliser votre ancienne ligne de commande `configure` (telle qu'elle est enregistrée dans le fichier `build/config.nice` situé dans le répertoire de compilation du serveur). Voici certains changements intervenus dans la configuration par défaut :

- Les modules suivants ont été supprimés : mod\_authn\_default, mod\_authz\_default et mod\_mem\_cache. Si vous utilisiez mod\_mem\_cache sous la version 2.2, vous devez maintenant utiliser [[12-modules/mod_cache_disk|mod_cache_disk]] dans la version 2.4.
- Toutes les implémentations de répartition de charge ont été déplacées vers des sous-modules spécifiques de mod\_proxy, comme [[12-modules/mod_lbmethod_bybusyness|mod_lbmethod_bybusyness]]. Vous devrez compiler et chargés tous les modules correspondants que votre configuration utilise.
- Le support de BeOS, TPF, et des anciennes plates-formes telles que A/UX, Next, et Tandem a été supprimé, car elles ne sont plus considérées comme maintenues.
- configure: les modules dynamiques (DSO) sont compilés par défaut
- configure: par défaut, seul un jeu de modules de base est chargé. Les autres directives `LoadModule` sont mises en commentaires dans le fichier de configuration.
- configure: le jeu de modules "most" est compilé par défaut
- configure: le jeu de modules "reallyall" ajoute les modules de développeur au jeu "all".

## Modifications de la configuration à l'exécution

Des changements significatifs dans la configuration de l'autorisation, ainsi que quelques changements mineurs, peuvent nécessiter une mise à jour des fichiers de configuration de la version 2.2 avant de les utiliser sous la version 2.4.

### Autorisation

Tout fichier de configuration qui gère des autorisations devra probablement être mis à jour.

Vous devez vous reporter au document [[11-guides/02-guides-pratiques/authentification-et-autorisation|Authentification, autorisation et contrôle d'accès]], et plus particulièrement à la section [[11-guides/02-guides-pratiques/authentification-et-autorisation|Pour aller plus loin qu'une simple autorisation]] qui explique les nouveaux mécanismes permettant de contrôler l'ordre dans lequel les directives d'autorisation sont appliquées.

Les directives qui contrôlent la manière dont les modules d'autorisation réagissent lorsqu'ils ne reconnaissent pas l'utilisateur authentifié ont été supprimées : elles comprennent les directives AuthzLDAPAuthoritative, AuthzDBDAuthoritative, AuthzDBMAuthoritative, AuthzGroupFileAuthoritative, AuthzUserAuthoritative et AuthzOwnerAuthoritative. Ces directives ont été remplacées par les directives plus explicites [[13-directives/requireany|<RequireAny>]], [[13-directives/requirenone|<RequireNone>]], et [[13-directives/requireall|<RequireAll>]].

Si vous utilisez [[12-modules/mod_authz_dbm|mod_authz_dbm]], vous devez mettre à jour votre configuration en remplaçant les directives du style `Require group ...` par des directives du style `Require dbm-group ...`.

#### Contrôle d'accès

Dans la version 2.2, le contrôle d'accès basé sur le nom d'hôte du client, son adresse IP, ou d'autres caractéristiques de la requête était assuré via les directives [[13-directives/order|Order]], [[13-directives/allow|Allow]], [[13-directives/deny|Deny]], et [[13-directives/satisfy|Satisfy]].

Dans la version 2.4, ce contrôle d'accès est assuré, comme tout contrôle d'autorisation, par le nouveau module [[12-modules/mod_authz_host|mod_authz_host]]. Bien que le module [[12-modules/mod_access_compat|mod_access_compat]] soit fourni à des fins de compatibilité avec les anciennes configurations, les anciennes directives de contrôle d'accès devront être remplacées par les nouveaux mécanismes d'authentification.

> [!NOTE]
> **Mélanger anciennes et nouvelles directives**
>
> Mélanger d'anciennes directives comme [[13-directives/order|Order]], [[13-directives/allow|Allow]] ou [[13-directives/deny|Deny]] avec des nouvelles comme [[13-directives/require|Require]] est techniquement possible mais déconseillé. En effet, [[12-modules/mod_access_compat|mod_access_compat]] a été conçu pour supporter des configurations ne contenant que des anciennes directives afin de faciliter le passage à la version 2.4. Les exemples ci-dessous vous permettront de vous faire une meilleure idée des problèmes qui peuvent survenir.

Voici quelques exemples de contrôle d'accès avec l'ancienne et la nouvelle méthode :

Dans cet exemple, il n'y a pas d'authentification et toutes les requêtes sont rejetées :

**version 2.2 :**

```apache
Order deny,allow
Deny from all
```

**version 2.4 :**

```apache
Require all denied
```

Dans cet exemple, il n'y a pas d'authentification et toutes les requêtes sont acceptées :

**version 2.2 :**

```apache
Order allow,deny
Allow from all
```

**version 2.4 :**

```apache
Require all granted
```

Dans l'exemple suivant, il n'y a pas d'authentification et tous les hôtes du domaine example.org ont l'autorisation d'accès, tous les autres étant rejetés :

**version 2.2 :**

```apache
Order Deny,Allow
Deny from all
Allow from example.org
```

**version 2.4 :**

```apache
Require host example.org
```

Dans l'exemple suivant, tous les hôtes du domaine example.org ont l'autorisation d'accès, tous les autres sont rejetés :

**version 2.2 :**

```apache
Order Deny,Allow
Deny from all
Allow from example.org
```

**version 2.4 :**

```apache
Require host example.org
```

Dans l'exemple suivant, le mélange d'anciennes et de nouvelles directives produit des résultats inattendus.

**Mélange d'anciennes et de nouvelles directives : RESULTAT INATTENDU**

```apache
DocumentRoot "/var/www/html"

<Directory "/">
    AllowOverride None
    Order deny,allow
    Deny from all
</Directory>

<Location "/server-status">
    SetHandler server-status
    Require local
</Location>

access.log - GET /server-status 403 127.0.0.1
error.log - AH01797: client denied by server configuration: /var/www/html/server-status
```

Pourquoi httpd interdit l'accès à server-status alors que la configuration semble l'autoriser ? Parce que dans ce scénario de [[11-guides/01-generalites/sections-de-configuration|fusion]] de configuration, les directives de [[12-modules/mod_access_compat|mod_access_compat]] sont prioritaires par rapport à celles de [[12-modules/mod_authz_host|mod_authz_host]].

L'exemple suivant quant à lui produit un résultat conforme :

**Mélange d'anciennes et de nouvelles directives : RESULTAT CONFORME**

```apache
DocumentRoot "/var/www/html"

<Directory "/">
    AllowOverride None
    Require all denied
</Directory>

<Location "/server-status">
    SetHandler server-status
    Order deny,allow
    Deny from all
    Allow From 127.0.0.1
</Location>

access.log - GET /server-status 200 127.0.0.1
```

En conclusion, même si une configuration hybride peut fonctionner, essayez de l'éviter lors de la mise à jour : soit conservez les anciennes directives, puis migrez-les vers les nouvelles ultérieurement, soit effectuez une migration immédiate de toutes les anciennes directives vers les nouvelles.

Dans de nombreuses configurations avec authentification où la directive `Satisfy` était définie à sa valeur par défaut *ALL*, les lignes de configuration qui désactivent le contrôle d'accès basé sur l'hôte sont maintenant omises :

**Version 2.2 :**

```apache
# configuration en version 2.2 qui désactive le contrôle d'accès basé sur le nom
# d'hôte pour n'utiliser que l'authentification
Order Deny,Allow
Allow from all
AuthType Basic
AuthBasicProvider file
AuthUserFile /example.com/conf/users.passwd
AuthName secure
Require valid-user
```

**Version 2.4 :**

```apache
# Pas besoin de remplacer les directives de contrôle d'accès basées sur le nom
# d'hôte désactivées
AuthType Basic
AuthBasicProvider file
AuthUserFile /example.com/conf/users.passwd
AuthName secure
Require valid-user
```

Dans les configurations où l'authentification et le contrôle d'accès se combinaient dans un but précis, les directives de contrôle d'accès doivent être migrées. Dans l'exemple suivant, les requêtes qui correspondent aux *deux* critères sont acceptées :

**Version 2.2 :**

```apache
Order allow,deny
Deny from all
# ALL est la valeur par défaut de Satisfy
Satisfy ALL
Allow from 127.0.0.1
AuthType Basic
AuthBasicProvider file
AuthUserFile /example.com/conf/users.passwd
AuthName secure
Require valid-user
```

**Version 2.4 :**

```apache
AuthType Basic
AuthBasicProvider file
AuthUserFile /example.com/conf/users.passwd
AuthName secure
<RequireAll>
  Require valid-user
  Require ip 127.0.0.1
</RequireAll>
```

Dans les configurations où l'authentification et le contrôle d'accès se combinaient dans un but précis, les directives de contrôle d'accès doivent être migrées. Dans l'exemple suivant, les requêtes qui correspondent à *au moins un* critère sont acceptées :

**Version 2.2 :**

```apache
Order allow,deny
Deny from all
Satisfy any
Allow from 127.0.0.1
AuthType Basic
AuthBasicProvider file
AuthUserFile /example.com/conf/users.passwd
AuthName secure
Require valid-user
```

**Version 2.4 :**

```apache
AuthType Basic
AuthBasicProvider file
AuthUserFile /example.com/conf/users.passwd
AuthName secure
# Implicite : <RequireAny>
Require valid-user
Require ip 127.0.0.1
```

### Autres changements dans la configuration

D'autres ajustements mineurs peuvent s'avérer nécessaires pour certaines configurations particulières, comme décrit ci-dessous.

- La directive `MaxRequestsPerChild` a été renommée en [[13-directives/maxconnectionsperchild|MaxConnectionsPerChild]]; ce nouveau nom reflète mieux l'usage de cette directive. L'ancien nom est encore supporté.
- La directive `MaxClients` a été renommée en [[13-directives/maxrequestworkers|MaxRequestWorkers]]; ce nouveau nom reflète mieux l'usage de cette directive. Pour les modules multiprocessus asynchrones, comme [[12-modules/event|event]], le nombre maximal de clients n'est pas équivalent au nombre de threads du worker. L'ancien nom est encore supporté.
- La directive [[13-directives/defaulttype|DefaultType]] ne produit plus aucun effet, si ce n'est d'émettre un avertissement si elle est définie à une valeur autre que `none`. D'autres directives de configuration la remplacent dans la version 2.4.
- La valeur par défaut de la directive [[13-directives/allowoverride|AllowOverride]] est maintenant `None`.
- La valeur par défaut de la directive [[13-directives/enablesendfile|EnableSendfile]] est maintenant Off.
- La valeur par défaut de la directive [[13-directives/fileetag|FileETag]] est maintenant "MTime Size" (sans INode).
- [[12-modules/mod_dav_fs|mod_dav_fs]]: le format du fichier [[13-directives/davlockdb|DavLockDB]] a changé pour les systèmes avec inodes. L'ancien fichier [[13-directives/davlockdb|DavLockDB]] doit être supprimé dans le cadre de la mise à jour.
- La directive [[13-directives/keepalive|KeepAlive]] n'accepte que les valeurs `On` ou `Off`. Avant, toute valeur autre que "Off" ou "0" était traitée comme "On".
- Les directives AcceptMutex, LockFile, RewriteLock, SSLMutex, SSLStaplingMutex et WatchdogMutexPath ont été remplacées par la directive unique [[13-directives/mutex|Mutex]]. Vous devez évaluer l'impact de ces directives obsolètes dans votre configuration version 2.2 afin de déterminer si elles peuvent être simplement supprimées, ou si elles doivent être remplacées par la directive [[13-directives/mutex|Mutex]].
- [[12-modules/mod_cache|mod_cache]]: la directive [[13-directives/cacheignoreurlsessionidentifiers|CacheIgnoreURLSessionIdentifiers]] effectue maintenant une correspondance exacte dans la chaîne de paramètres au lieu d'une correspondance partielle. Si votre configuration mettait en jeu des sous-chaînes comme `sessionid` pour correspondre à `/une-application/image.gif;jsessionid=123456789`, vous devez maintenant utiliser la chaîne de correspondance complète `jsessionid`.
- [[12-modules/mod_cache|mod_cache]]: le second paramètre de la directive [[13-directives/cacheenable|CacheEnable]] ne concerne les contenus en mandat direct que s'ils débutent par le protocole approprié. Dans les versions 2.2 et antérieures, un paramètre tel que '/' concernait tous les contenus.
- [[12-modules/mod_ldap|mod_ldap]]: la directive [[13-directives/ldaptrustedclientcert|LDAPTrustedClientCert]] s'utilise maintenant exclusivement au sein d'une configuration de niveau répertoire. Si vous utilisez cette directive, passez en revue votre configuration pour vous assurer qu'elle est bien présente dans tous les contextes de répertoire nécessaires.
- [[12-modules/mod_filter|mod_filter]]: la syntaxe de la directive [[13-directives/filterprovider|FilterProvider]] utilise maintenant une expression booléenne pour déterminer si un filtre s'applique.
- [[12-modules/mod_include|mod_include]]:

  - L'élément `#if expr` utilise maintenant le nouvel [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|interpréteur d'expressions]]. L'ancienne syntaxe peut être réactivée via la directive [[13-directives/ssilegacyexprparser|SSILegacyExprParser]].
  - Dans la portée du répertoire, une directive de configuration SSI\* ne provoque plus la réinitialisation à leur valeur par défaut de toutes les directives SSI\* de niveau répertoire.
- [[12-modules/mod_charset_lite|mod_charset_lite]] : l'option `DebugLevel` a été supprimée en faveur d'une configuration de la directive [[13-directives/loglevel|LogLevel]] au niveau répertoire.
- [[12-modules/mod_ext_filter|mod_ext_filter]] : l'option `DebugLevel` a été supprimée en faveur d'une configuration de la directive [[13-directives/loglevel|LogLevel]] au niveau répertoire.
- [[12-modules/mod_proxy_scgi|mod_proxy_scgi]]: certaines applications web ne fonctionneront plus correctement avec la nouvelle configuration de `PATH_INFO` qui est différente de celle de la version 2.2. La configuration précédente peut être restaurée en définissant la variable `proxy-scgi-pathinfo`.
- [[12-modules/mod_ssl|mod_ssl]]: le contrôle de révocation des certificats basé sur les CRL doit être maintenant explicitement configuré via la directive [[13-directives/sslcarevocationcheck|SSLCARevocationCheck]].
- [[12-modules/mod_substitute|mod_substitute]]: la taille maximale d'une ligne est maintenant 1Mo.
- [[12-modules/mod_reqtimeout|mod_reqtimeout]]: si ce module est chargé, il définit maintenant certains temps d'attente par défaut.
- [[12-modules/mod_dumpio|mod_dumpio]]: la directive `DumpIOLogLevel` n'est plus supportée. Les données sont toujours enregistrées au niveau `trace7` de [[13-directives/loglevel|LogLevel]]
- Jusqu'à la version 2.2, sur les plateformes de style Unix, les commandes de redirection des logs définies via [[13-directives/errorlog|ErrorLog]] ou [[13-directives/customlog|CustomLog]] étaient invoquées en utilisant `/bin/sh -c`. A partir de la version 2.4, les commandes de redirection des logs sont exécutées directement. Pour retrouver l'ancien comportement, voir la [[11-guides/01-generalites/fichiers-journaux|documentation sur la redirection des logs]]

## Changements divers

- `mod_auto_index`: extrait maintenant les titres et affiche la description pour les fichiers .xhtml qui étaient jusqu'alors ignorés.
- [[12-modules/mod_ssl|mod_ssl]] : le format par défaut des variables `*_DN` a changé. Il est cependant encore possible d'utiliser l'ancien format via la nouvelle option `LegacyDNStringFormat` de la directive [[13-directives/ssloptions|SSLOptions]]. Le protocole SSLv2 n'est plus supporté. Les directives [[13-directives/sslproxycheckpeercn|SSLProxyCheckPeerCN]] et [[13-directives/sslproxycheckpeerexpire|SSLProxyCheckPeerExpire]] sont maintenant définies par défaut à On, et les requêtes mandatées vers des serveurs HTTPS possèdant des certificats non conformes ou périmés échoueront donc avec un code d'erreur 502 (Bad gateway).
- [[10-commandes/htpasswd|htpasswd]] utilise maintenant par défaut les condensés MD5 sur toutes les plates-formes.
- La directive [[13-directives/namevirtualhost|NameVirtualHost]] n'a plus aucun effet, si ce n'est l'émission d'un avertissement. Toute combinaison adresse/port apparaissant dans plusieurs serveurs virtuels est traitée implicitement comme un serveur virtuel basé sur le nom.
- [[12-modules/mod_deflate|mod_deflate]] n'effectue plus de compression s'il s'aperçoit que la quantité de données ajoutée par la compression est supérieure à la quantité de données à compresser.
- Les pages d'erreur multilingues de la version 2.2.x ne fonctionneront qu'après avoir été corrigées pour respecter la nouvelle syntaxe de l'élément `#if expr=` du module [[12-modules/mod_include|mod_include]], ou si la directive [[13-directives/ssilegacyexprparser|SSILegacyExprParser]] a été activée pour le répertoire contenant les pages d'erreur.
- La fonctionnalité fournie par `mod_authn_alias` dans les précédentes versions (en fait la directive [[13-directives/authnprovideralias|<AuthnProviderAlias>]]) est maintenant fournie par [[12-modules/mod_authn_core|mod_authn_core]].
- Les directives RewriteLog et RewriteLogLevel ont été supprimées. Leur fonctions sont maintenant assurées par la directive [[13-directives/loglevel|LogLevel]] qui permet de définir un niveau de journalisation approprié pour le module [[12-modules/mod_rewrite|mod_rewrite]]. Voir aussi la section [[12-modules/mod_rewrite|journalisation de mod_rewrite]].
- Le symbole `<set>` de [[12-modules/mod_include|mod_include]] n'effectue plus le décodage d'entité sur la valeur définie.

## Modules tiers

Tous les modules tiers doivent être recompilés pour la version 2.4 avant d'être chargés.

De nombreux modules tiers conçus pour la version 2.2 fonctionneront sans changement avec le serveur HTTP Apache version 2.4. Certains nécessiteront cependant des modifications ; se reporter à la vue d'ensemble [[11-guides/09-developpement/api-changes-in-apache-http-server-2-4-since-2-2|Mise à jour de l'API]].

## Problèmes de mise à jour courants

- Erreurs au démarrage :

  - `Invalid command 'User', perhaps misspelled or defined by a module not included in the server configuration` - chargez le module [[12-modules/mod_unixd|mod_unixd]]
  - `Invalid command 'Require', perhaps misspelled or defined by a module not included in the server configuration`, ou `Invalid command 'Order', perhaps misspelled or defined by a module not included in the server configuration` - chargez le module [[12-modules/mod_access_compat|mod_access_compat]], ou mettez à jour vers la version 2.4 les directives d'autorisation.
  - `Ignoring deprecated use of DefaultType in line NN of /path/to/httpd.conf` - supprimez la directive [[13-directives/defaulttype|DefaultType]] et remplacez-la par les directives de configuration appropriées.
  - `Invalid command 'AddOutputFilterByType', perhaps misspelled or defined by a module not included in the server configuration` - la directive [[13-directives/addoutputfilterbytype|AddOutputFilterByType]] qui était jusqu'alors implémentée par le module core, l'est maintenant par le module mod\_filter, qui doit donc être chargé.
- Erreurs de traitement des requêtes :

  - `configuration error: couldn't check user: /path` - chargez le module [[12-modules/mod_authn_core|mod_authn_core]].
  - Les fichiers `.htaccess` ne sont pas traités - Vérifiez la présence d'une directive [[13-directives/allowoverride|AllowOverride]] appropriée ; sa valeur par défaut est maintenant `None`.

## Voir aussi

- [[11-guides/01-generalites/vue-d-ensemble-des-nouvelles-fonctionnalites-de-la-version-2-4-du-serv|Vue d'ensemble des nouvelles fonctionnalités du serveur HTTP Apache 2.4]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
