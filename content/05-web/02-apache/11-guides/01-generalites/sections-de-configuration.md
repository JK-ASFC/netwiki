---
title: "Sections de configuration"
description: "Apache HTTP Server — Sections de configuration. Les directives des fichiers de configuration peuvent s'appliquer au serveur dans son ensemble, ou seulement à des répertoires, fichiers, hôtes, ou URLs particuliers. Ce document décrit comment utiliser les conteneurs de sections de configur"
tags: [apache, guide]
icon: book-open
---

Les directives des [[11-guides/01-generalites/fichiers-de-configuration|fichiers de configuration]] peuvent s'appliquer au serveur dans son ensemble, ou seulement à des répertoires, fichiers, hôtes, ou URLs particuliers. Ce document décrit comment utiliser les conteneurs de sections de configuration ou les fichiers `.htaccess` pour modifier la portée des directives de configuration.

## Types de conteneurs de sections de configuration

- [[12-modules/core|core]]
- [[12-modules/mod_version|mod_version]]
- [[12-modules/mod_proxy|mod_proxy]]
- [[13-directives/directory|<Directory>]]
- [[13-directives/directorymatch|<DirectoryMatch>]]
- [[13-directives/files|<Files>]]
- [[13-directives/filesmatch|<FilesMatch>]]
- [[13-directives/if|<If>]]
- [[13-directives/ifdefine|<IfDefine>]]
- [[13-directives/ifmodule|<IfModule>]]
- [[13-directives/ifversion|<IfVersion>]]
- [[13-directives/location|<Location>]]
- [[13-directives/locationmatch|<LocationMatch>]]
- [[13-directives/mdomainset|<MDomainSet>]]
- [[13-directives/proxy|<Proxy>]]
- [[13-directives/proxymatch|<ProxyMatch>]]
- [[13-directives/virtualhost|<VirtualHost>]]

Il existe deux grands types de conteneurs. La plupart des conteneurs sont évalués pour chaque requête. Les directives qu'ils contiennent s'appliquent seulement aux requêtes qui sont concernées par le conteneur. En revanche, les conteneurs [[13-directives/ifdefine|<IfDefine>]], [[13-directives/ifmodule|<IfModule>]] et [[13-directives/ifversion|<IfVersion>]] sont évalués seulement au démarrage et au redémarrage du serveur. Si leurs conditions sont vérifiées au démarrage, les directives qu'ils contiennent s'appliqueront à toutes les requêtes. Si leurs conditions ne sont pas vérifiées, les directives qu'ils contiennent seront ignorées.

Le conteneur [[13-directives/ifdefine|<IfDefine>]] contient des directives qui ne seront appliquées que si un paramètre approprié a été défini dans la ligne de commande de [[10-commandes/httpd|httpd]]. Par exemple, avec la configuration suivante, toutes les requêtes seront redirigées vers un autre site si le serveur est démarré en utilisant la ligne de commande : `httpd -DClosedForNow` :

```apache
<IfDefine ClosedForNow>
    Redirect "/" "http://otherserver.example.com/"
</IfDefine>
```

Le conteneur [[13-directives/ifmodule|<IfModule>]] est similaire ; les directives qu'il contient ne s'appliqueront que si un module particulier est disponible au niveau du serveur. Le module doit être soit compilé statiquement dans le serveur, soit dynamiquement et dans ce cas, la ligne [[13-directives/loadmodule|LoadModule]] correspondante doit apparaître plus haut dans le fichier de configuration. Ce conteneur ne doit être utilisé que dans le cas où votre fichier de configuration doit être valable indépendamment de la présence ou de l'absence de certains modules. Il ne doit pas contenir de directives que vous souhaitez voir s'appliquer systématiquement, car vous pouvez perdre ainsi de précieux messages d'erreur à propos de modules manquants.

Dans l'exemple suivant, la directive [[13-directives/mimemagicfile|MimeMagicFile]] ne s'appliquera que si le module [[12-modules/mod_mime_magic|mod_mime_magic]] est disponible.

```apache
<IfModule mod_mime_magic.c>
    MimeMagicFile "conf/magic"
</IfModule>
```

Le conteneur [[13-directives/ifversion|<IfVersion>]] est similaire aux conteneurs [[13-directives/ifdefine|<IfDefine>]] et [[13-directives/ifmodule|<IfModule>]] ; les directives qu'il contient ne s'appliqueront que si une version particulière du serveur s'exécute. Ce conteneur a été conçu pour une utilisation dans les suites de tests et les grands réseaux qui doivent prendre en compte différentes versions et configurations de httpd.

```apache
<IfVersion >= 2.4>
    # les directives situées ici ne s'appliquent que si la version
    # est supérieure ou égale à 2.4.0.
</IfVersion>
```

[[13-directives/ifdefine|<IfDefine>]], [[13-directives/ifmodule|<IfModule>]] et [[13-directives/ifversion|<IfVersion>]] peuvent inverser leur test conditionnel en le faisant précéder d'un « ! ». De plus, ces sections peuvent être imbriquées afin de définir des restrictions plus complexes.

## Système de fichiers, arborescence du site web et expressions booléennes

Les conteneurs de sections de configuration les plus couramment utilisés sont ceux qui modifient la configuration de points particuliers du système de fichiers ou de l'arborescence du site web. Tout d'abord, il est important de comprendre la différence entre les deux. Le système de fichiers est une vue de vos disques tels qu'ils sont perçus par votre système d'exploitation. Par exemple, avec une installation par défaut, Apache httpd est situé dans `/usr/local/apache2` pour le système de fichiers UNIX, ou `"c:/Program Files/Apache Group/Apache2"` pour le système de fichiers Windows (notez que des slashes directs doivent toujours être utilisés comme séparateur de chemin dans les fichiers de configuration d'Apache httpd, même sous Windows). Quant à l'arborescence du site web, il s'agit d'une vue de votre site telle que présentée par le serveur web et perçue par le client. Ainsi le chemin `/dir/` dans l'arborescence du site web correspond au chemin `/usr/local/apache2/htdocs/dir/` dans le système de fichiers pour une installation d'Apache httpd par défaut sous UNIX. En outre, l'arborescence du site web n'a pas besoin de correspondre en permanence au système de fichiers, car les pages web peuvent être générées dynamiquement à partir de bases de données ou d'autres emplacements.

### Conteneurs de système de fichiers

Les conteneurs [[13-directives/directory|<Directory>]] et [[13-directives/files|<Files>]], ainsi que leurs équivalents acceptant les expressions rationnelles, appliquent des directives à certaines parties du système de fichiers. Les directives contenues dans une section [[13-directives/directory|<Directory>]] s'appliquent au répertoire précisé, ainsi qu'à tous ses sous-répertoires et aux fichiers que ces derniers contiennent. Le même effet peut être obtenu en utilisant les [[11-guides/02-guides-pratiques/tutoriel-du-serveur-http-apache-fichiers-htaccess|fichiers .htaccess]]. Par exemple, avec la configuration suivante, l'indexation sera activée pour le répertoire `/var/web/dir1` et tous ses sous-répertoires.

```apache
<Directory "/var/web/dir1">
    Options +Indexes
</Directory>
```

Les directives contenues dans une section [[13-directives/files|<Files>]] s'appliquent à tout fichier avec le nom spécifié, quel que soit le répertoire dans lequel il se trouve. Ainsi par exemple, les directives de configuration suivantes, si elles sont placées dans la section principale du fichier de configuration, vont interdire l'accès à tout fichier nommé `private.html` quel que soit l'endroit où il se trouve.

```apache
<Files "private.html">
    Require all denied
</Files>
```

Pour faire référence à des fichiers qui se trouvent en des points particuliers du système de fichiers, les sections [[13-directives/files|<Files>]] et [[13-directives/directory|<Directory>]] peuvent être combinées. Par exemple, la configuration suivante va interdire l'accès à `/var/web/dir1/private.html`, `/var/web/dir1/subdir2/private.html`, `/var/web/dir1/subdir3/private.html`, ainsi que toute instance de `private.html` qui se trouve dans l'arborescence `/var/web/dir1/`.

```apache
<Directory "/var/web/dir1">
    <Files "private.html">
        Require all denied
    </Files>
</Directory>
```

### Conteneurs de l'arborescence du site web

le conteneur [[13-directives/location|<Location>]] et son équivalent acceptant les expressions rationnelles modifient quant à eux la configuration de parties de l'arborescence du site web. Par exemple, la configuration suivante interdit l'accès à toute URL dont la partie chemin commence par /private. En particulier, l'interdiction s'appliquera aux requêtes pour : `http://yoursite.example.com/private`, `http://yoursite.example.com/private123`, et `http://yoursite.example.com/private/dir/file.html` ainsi qu'à toute requête commençant par la chaîne de caractères `/private`.

```apache
<LocationMatch "^/private">
    Require all denied
</LocationMatch>
```

Le conteneur [[13-directives/location|<Location>]] n'a pas besoin de faire référence à un élément du système de fichiers. À ce titre, l'exemple suivant montre comment faire correspondre une URL particulière à un gestionnaire interne fourni par le module [[12-modules/mod_status|mod_status]]. Il n'est pas nécessaire de trouver un fichier nommé `server-status` dans le système de fichiers.

```apache
# Un URL vers un gestionnaire interne :
<Location "/server-status">
    SetHandler server-status
</Location>

# Un chemin d’URL vers un dorsal de mandataire inverse :
<Location "/app">
    ProxyPass "http://backend.example.com/"
    ProxyPassReverse "http://backend.example.com/"
</Location>

# Interdire l’accès à un chemin d’URL sans tenir compte de ce qui le traite :
<Location "/private">
    Require all denied
</Location>
```

Étant donné que la section [[13-directives/location|<Location>]] opère sur des URLs, et non sur des chemins du système de fichiers, il s'agit du conteneur approprié pour la configuration du mandataire et les points de terminaison fournis par les modules.

### Espace web imbriqué

Pour contrôler deux URLs imbriquées, on doit tenir compte de l'ordre dans lequel certaines sections ou directives sont évaluées. Pour [[13-directives/location|<Location>]], on doit avoir :

```apache
<Location "/foo">
</Location>
<Location "/foo/bar">
</Location>
```

Les directives [[13-directives/alias|<Alias>]], quant à elles, sont évaluées vice-versa :

```apache
Alias "/foo/bar" "/srv/www/uncommon/bar"
Alias "/foo" "/srv/www/common/foo"
```

Ceci est aussi vrai pour les directives [[13-directives/proxypass|ProxyPass]] :

```apache
ProxyPass "/special-area" "http://special.example.com" smax=5 max=10
ProxyPass "/" "balancer://mycluster/" stickysession=JSESSIONID|jsessionid nofailover=On
```

### Caractères de remplacement et expressions rationnelles

Les conteneurs [[13-directives/directory|<Directory>]], [[13-directives/files|<Files>]] et [[13-directives/location|<Location>]] peuvent utiliser des caractères de remplacement de style shell comme dans la fonction `fnmatch` de la bibliothèque C standard. Le caractère « \* » correspond à toute séquence de caractères, « ? » à un caractère seul, et « \[*seq*\] » à tout caractère contenu dans *seq*. Le caractère « / » ne peut pas faire l'objet d'un remplacement ; il doit être spécifié explicitement.

Si une définition des critères de correspondance encore plus souple est nécessaire, chaque conteneur possède son équivalent acceptant les expressions rationnelles : [[13-directives/directorymatch|<DirectoryMatch>]], [[13-directives/filesmatch|<FilesMatch>]] et [[13-directives/locationmatch|<LocationMatch>]] acceptent les expressions rationnelles compatibles Perl pour définir les critères de correspondance. Mais voyez plus loin la section à propos de la combinaison des sections de configuration pour comprendre comment l'utilisation de conteneurs avec des expressions rationnelles va modifier la manière dont les directives sont appliquées.

Un conteneur qui modifie la configuration de tous les répertoires utilisateurs à l'aide de caractères de remplacement mais sans utiliser les expressions rationnelles pourrait ressembler à ceci :

```apache
<Directory "/home/*/public_html">
    Options Indexes
</Directory>
```

Avec les conteneurs utilisant les expressions rationnelles, on peut interdire l'accès à de nombreux types de fichiers d'images simultanément :

```apache
+<FilesMatch "\.(?i:gif|jpe?g|png)$">
    Require all denied
</FilesMatch>
```

Les expressions rationnelles contenant des **groupes nommés et des références arrières** sont ajoutées à l'environnement avec leur nom en majuscules. Cela permet de référencer des éléments de chemins de fichiers et d'URLs depuis une [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expression]] et au sein de modules comme [[12-modules/mod_rewrite|mod_rewrite]].

```apache
<DirectoryMatch "^/var/www/combined/(?<SITENAME>[^/]+)">
    Require ldap-group "cn=%{env:MATCH_SITENAME},ou=combined,o=Example"
</DirectoryMatch>
```

### Expressions booléennes

La directive [[13-directives/if|<If>]] permet de modifier la configuration en fonction d'une condition qui peut être définie sous la forme d'une expression booléenne. Dans l'exemple suivant, l'accès est interdit si l'en-tête HTTP Referer ne commence pas par « http://www.example.com/ ».

```apache
<If "!(%{HTTP_REFERER} -strmatch 'http://www.example.com/*')">
    Require all denied
</If>
```

### Que faut-il utiliser et quand ?

Choisir entre des conteneurs de système de fichiers et des conteneurs d'arborescence du site web est vraiment très simple. Pour appliquer des directives à des objets qui résident dans le système de fichiers, utilisez toujours un conteneur [[13-directives/directory|<Directory>]] ou [[13-directives/files|<Files>]]. Pour appliquer des directives à des objets qui ne résident pas dans le système de fichiers (comme une page web générée par une base de données), utilisez un conteneur [[13-directives/location|<Location>]].

Il ne faut jamais utiliser un conteneur [[13-directives/location|<Location>]] pour restreindre l'accès à des objets du système de fichiers, car plusieurs emplacements de l'arborescence du site web (URLs) peuvent correspondre au même emplacement du système de fichier, ce qui peut permettre de contourner vos restrictions. Par exemple, imaginez la configuration suivante :

```apache
<Location "/dir/">
    Require all denied
</Location>
```

Elle fonctionne correctement si la requête appelle `http://yoursite.example.com/dir/`. Mais que va-t-il se passer si votre système de fichiers est insensible à la casse ? Votre restriction va pouvoir être tout simplement contournée en envoyant une requête sur `http://yoursite.example.com/DIR/`. Le conteneur [[13-directives/directory|<Directory>]], quant à lui, s'appliquera à tout contenu servi à partir de cet emplacement, sans tenir compte de la manière dont il est appelé. Les liens du système de fichiers constituent une exception. Le même répertoire peut être placé dans plusieurs parties du système de fichiers en utilisant des liens symboliques. Le conteneur [[13-directives/directory|<Directory>]] va suivre le lien symbolique sans modifier le nom du chemin. Par conséquent, pour plus de sécurité, les liens symboliques doivent être désactivés à l'aide de la directive [[13-directives/options|Options]] appropriée.

Si vous pensez que vous n'êtes pas concerné par ce problème parce que vous utilisez un système de fichiers sensible à la casse, gardez à l'esprit qu'il y a de nombreuses autres manières pour faire correspondre plusieurs emplacements de l'arborescence du site web au même emplacement du système de fichiers. C'est pourquoi vous devez autant que possible toujours utiliser les conteneurs de système de fichiers. Il y a cependant une exception à cette règle. Placer des restrictions de configuration dans un conteneur `<Location "/">` est absolument sans rique car ce conteneur va s'appliquer à toutes les requêtes sans tenir compte de l'URL spécifique.

### Imbrication des sections

Certains types de sections peuvent être imbriqués : d'une part, on peut utiliser les sections [[13-directives/files|<Files>]] à l'intérieur des sections [[13-directives/directory|<Directory>]], d'autre part, on peut utiliser les directives [[13-directives/if|<If>]] à l'intérieur des sections [[13-directives/directory|<Directory>]], [[13-directives/location|<Location>]] et [[13-directives/files|<Files>]] (mais pas à l'intérieur d'une autre section [[13-directives/if|<If>]]). Les valeurs des expressions rationnelles correspondant aux sections citées se comportent de manière identique.

Les sections imbriquées sont fusionnées après les sections non-imbriquées de même type.

## Serveurs virtuels

Le conteneur [[13-directives/virtualhost|<VirtualHost>]] contient des directives qui s'appliquent à des serveurs virtuels spécifiques. Cela s'avère utile pour servir les contenus de plusieurs serveurs virtuels à partir de la même machine, chacun d'entre eux possédant une configuration différente. Pour de plus amples informations, voir la [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|Documentation sur les serveurs virtuels]].

## Mandataire

Les conteneurs [[13-directives/proxy|<Proxy>]] et [[13-directives/proxymatch|<ProxyMatch>]] appliquent les directives de configuration qu'ils contiennent uniquement aux sites qui correspondent à l'URL spécifiée et auxquels on a accédé à l'aide du serveur mandataire du module [[12-modules/mod_proxy|mod_proxy]]. Par exemple, la configuration suivante n'autorisera qu'un sous-ensemble de clients à accéder au site `www.example.com` en passant par le serveur mandataire :

```apache
<Proxy "http://www.example.com/*">
    Require host yournetwork.example.com
</Proxy>
```

## Quelles sont les directives autorisées ?

Pour déterminer quelles sont les directives autorisées pour tel type de section de configuration, vérifiez le Contexte de la directive. Tout ce qui est autorisé dans les sections [[13-directives/directory|<Directory>]] l'est aussi d'un point de vue syntaxique dans les sections [[13-directives/directorymatch|<DirectoryMatch>]], [[13-directives/files|<Files>]], [[13-directives/filesmatch|<FilesMatch>]], [[13-directives/location|<Location>]], [[13-directives/locationmatch|<LocationMatch>]], [[13-directives/proxy|<Proxy>]] et [[13-directives/proxymatch|<ProxyMatch>]]. Il y a cependant quelques exceptions :

- La directive [[13-directives/allowoverride|AllowOverride]] ne fonctionne que dans les sections [[13-directives/directory|<Directory>]].
- Les [[13-directives/options|Options]] `FollowSymLinks` et `SymLinksIfOwnerMatch` ne fonctionnent que dans les sections [[13-directives/directory|<Directory>]] ou les fichiers `.htaccess`.
- La directive [[13-directives/options|Options]] ne peut pas être utilisée dans les sections [[13-directives/files|<Files>]] et [[13-directives/filesmatch|<FilesMatch>]].

## Comment les sections sont combinées entre elles

Les sections de configuration sont appliquées dans un ordre très particulier. Il est important de savoir comment cet ordre est défini car il peut avoir des effets importants sur la manière dont les directives de configuration sont interprétées.

L'ordre dans lequel les sections sont appliquées est :

1. Les sections [[13-directives/directory|<Directory>]] (à l'exception des expressions rationnelles) et les fichiers `.htaccess` sont appliquées simultanément (avec la possibilité pour `.htaccess`, s'il y est autorisé, de prévaloir sur [[13-directives/directory|<Directory>]])
2. Les sections [[13-directives/directorymatch|<DirectoryMatch>]] (et `<Directory "~">`)
3. Les sections [[13-directives/files|<Files>]] et [[13-directives/filesmatch|<FilesMatch>]] sont appliquées simultanément
4. Les sections [[13-directives/location|<Location>]] et [[13-directives/locationmatch|<LocationMatch>]] sont appliquées simultanément
5. Les sections [[13-directives/if|<If>]], même si elles sont incluses dans un des contextes précédents.

Quelques remarques importantes :

- Mises à part les sections [[13-directives/directory|<Directory>]], dans chaque groupe, les sections sont traitées selon l'ordre dans lequel elles apparaissent dans les fichiers de configuration. Par exemple, une requête pour */foo/bar* correspondra à `<Location "/foo/bar">` et `<Location "/foo">` (dans ce cas le groupe 4) : les deux sections seront évaluées mais selon l'ordre dans lequel elles apparaissent dans le fichier de configuration.
- Les sections [[13-directives/directory|<Directory>]] (groupe 1 ci-dessus) sont traitées dans l'ordre du répertoire le plus court vers le plus long (sans tenir compte de leur ordre d’apparition dans le fichier de configuration). Par exemple, `<Directory "/var/web/dir">` sera traitée avant `<Directory "/var/web/dir/subdir">`.
- Si plusieurs sections [[13-directives/directory|<Directory>]] s'appliquent au même répertoire, elles sont traitées selon l'ordre dans lequel elles apparaissent dans le fichier de configuration. La même règle s’applique lorsque plusieurs sections [[13-directives/directorymatch|<DirectoryMatch>]], [[13-directives/files|<Files>]], [[13-directives/filesmatch|<FilesMatch>]], [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]] ciblent à la même ressource.
- Les sections de configuration incluses à laide de la directive [[13-directives/include|Include]] sont traitées comme si elles se trouvaient réellement dans le fichier qui les inclut à la position de la directive [[13-directives/include|Include]].
- Les sections situées à l'intérieur de sections [[13-directives/virtualhost|<VirtualHost>]] sont appliquées *après* les sections correspondantes situées en dehors de la définition du serveur virtuel, ce qui permet au serveur virtuel de prévaloir sur la configuration du serveur global. Notez qu’à la différence des autres types de section, un seul `<serveur virtuel>` est sélectionné pour une requête — les directives de plusieurs serveurs virtuels correspondants ne sont jamais fusionnées. Voir [[11-guides/03-serveurs-virtuels/details-sur-le-fonctionnement-des-serveurs-virtuels|Correspondance des serveurs virtuels]] pour des détails à propos de la manière dont les serveurs virtuels sont sélectionnés.
- Quand la requête est servie par le module [[12-modules/mod_proxy|mod_proxy]], le conteneur [[13-directives/proxy|<Proxy>]] prend la place du conteneur [[13-directives/directory|<Directory>]] dans l'ordre de traitement.
- Il faut être très prudent lorsqu'on mélange des directives de configuration similaires à l'intérieur et à l'extérieur d'une section [[13-directives/if|<If>]] car leur ordre d'apparition a de l'importance. A cet effet, l'utilisation explicite de la directive [[13-directives/else|<Else>]] peut vous y aider.
- Lorsqu'une section [[13-directives/if|<If>]] est utilisée dans un fichier `.htaccess`, les directives incluses dans un "directory" parent seront fusionnées *après* les directives non-incluses dans un "directory" enfant.
- > [!WARNING]
  > **Avertissement : une directive \<Limit\> au sein d’une section \<Location\> peut accorder un accès silencieusement**
  >
  > Utiliser la directive [[13-directives/limit|<Limit>]] au sein d’une section [[13-directives/location|<Location>]] pour restreindre la liste des méthodes HTTP autorisées peut donner des résultats inattendus. Pour les méthodes non spécifiées par la directive [[13-directives/limit|<Limit>]], la section [[13-directives/location|<Location>]] hôte est traitée comme n’imposant aucune condition d’autorisation, ce qui a effectivement pour effet d’accorder l’accès et outrepasse toute éventuelle restriction d’une section [[13-directives/directory|<Directory>]] qui, autrement, aurait dû s’appliquer. C’est pourquoi il est préférable d’utiliser la directive [[13-directives/limitexcept|<LimitExcept>]] ou de définir les autorisations sans restriction sur les méthodes.

> [!NOTE]
> **Note technique**
>
> Une séquence `<Location>`/`<LocationMatch>` est réellement traitée juste avant la phase de traduction du nom (où `Aliases` et `DocumentRoots` sont utilisés pour faire correspondre les URLs aux noms de fichiers). Les effets de cette séquence disparaissent totalement lorsque la traduction est terminée.

### Interactions entre modules et sections de configuration

Une question se pose souvent après avoir lu comment les sections de configuration sont fusionnées : comment et quand les directives de modules particuliers comme [[12-modules/mod_rewrite|mod_rewrite]] sont-elles interprétées ? La réponse n'est pas triviale et nécessite un approfondissement. Chaque module httpd gère sa propre configuration, et chacune de ses directives dans httpd.conf définit un élément de configuration dans un contexte particulier. httpd n'exécute pas une commande au moment où elle est lue.

A l'exécution, le noyau de httpd parcourt les sections de configuration dans l'ordre décrit ci-dessus afin de déterminer lesquelles s'appliquent à la requête actuelle. Lorsqu'une première section s'applique, elle est considérée comme la configuration actuelle pour cette requête. Si une section suivante s'applique aussi, chaque module qui possède des directives dans chacune de ces sections a la possibilité de fusionner sa configuration entre ces deux sections. Il en résulte une troisième configuration et le processus de fusion se poursuit jusqu'à ce que toutes les sections de configuration aient été évaluées.

Après l'étape précédente, le traitement proprement dit de la requête HTTP peut commencer : chaque module peut effectuer toute tâche qui lui incombe, et pour déterminer de quelle manière il doit agir, il peut s'appuyer sur le noyau de httpd pour retrouver sa configuration globale issue de la fusion précédente.

Un exemple permet de mieux visualiser l'ensemble du processus. La configuration suivante utilise la directive [[13-directives/header|Header]] du module [[12-modules/mod_headers|mod_headers]] pour définir un en-tête HTTP spécifique. Quelle valeur httpd va-t-il affecter à l'en-tête `CustomHeaderName` pour une requête vers `/example/index.html` ?

```apache
<Directory "/">
    Header set CustomHeaderName one
    <FilesMatch ".*">
        Header set CustomHeaderName three
    </FilesMatch>
</Directory>

<Directory "/example">
    Header set CustomHeaderName two
</Directory>
```

- `<Directory>` "/" s'applique, et une configuration initiale est créée qui définit l'en-tête `CustomHeaderName` avec la valeur `one`.
- `<Directory>` "/example" s'applique, et comme [[12-modules/mod_headers|mod_headers]] spécifie dans son code que la valeur d'un en-tête doit être écrasée si ce dernier est défini à nouveau, une nouvelle configuration est créée qui définit l'en-tête `CustomHeaderName` avec la valeur `two`.
- `<FilesMatch>` ".\*" s'applique, une nouvelle opportunité de fusion survient, et l'en-tête `CustomHeaderName` est défini à la valeur `three`.
- Finalement, au cours des étapes suivantes du traitement de la requête HTTP, [[12-modules/mod_headers|mod_headers]] sera sollicité, et il se basera sur la configuration qui a défini l'en-tête `CustomHeaderName` à la valeur `three`. [[12-modules/mod_headers|mod_headers]] utilise normalement cette configuration pour accomplir sa tâche, à savoir définir des en-têtes HTTP. Cela ne veut cependant pas dire qu'un module ne peut pas effectuer des actions plus complexes comme désactiver des directives car elle ne sont pas nécessaires ou obsolètes, etc.

Ceci est aussi vrai pour les fichiers .htaccess car ils possèdent la même priorité que les sections `<Directory>` dans l'ordre de fusion. Il faut bien comprendre que les sections de configuration comme `<Directory>` et `<FilesMatch>` ne sont pas comparables avec les directives spécifiques de modules comme [[13-directives/header|Header]] ou [[13-directives/rewriterule|RewriteRule]] car elles agissent à des niveaux différents.

### Quelques exemples utiles

Voici un exemple imaginaire qui montre l'ordre de combinaison des sections. En supposant qu'elles s'appliquent toutes à la requête, les directives de cet exemple seront appliquées dans l'ordre suivant : A \> B \> C \> D \> E.

```apache
<Location "/">
    E
</Location>

<Files "f.html">
    D
</Files>

<VirtualHost *>
   <Directory "/a/b">
        B
   </Directory>
</VirtualHost>

<DirectoryMatch "^.*b$">
    C
</DirectoryMatch>

<Directory "/a/b">
    A
</Directory>
```

Pour un exemple plus concret, considérez ce qui suit. Sans tenir compte d'une quelconque restriction d'accès placée dans les sections [[13-directives/directory|<Directory>]], la section [[13-directives/location|<Location>]] sera évaluée en dernier et permettra un accès au serveur sans aucune restriction. En d'autres termes, l'ordre de la combinaison des sections est important ; soyez donc prudent !

```apache
<Location "/">
    Require all granted
</Location>

# Grrrr !  Cette section <Directory> n'aura aucun effet
<Directory "/">
    <RequireAll>
        Require all granted
        Require not host badguy.example.com
    </RequireAll>
</Directory>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
