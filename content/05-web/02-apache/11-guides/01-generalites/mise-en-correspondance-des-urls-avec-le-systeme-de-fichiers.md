---
title: "Mise en correspondance des URLs avec le système de fichiers"
description: "Apache HTTP Server — Mise en correspondance des URLs avec le système de fichiers. Ce document explique comment le serveur HTTP Apache utilise l'URL contenue dans une requête pour déterminer le noeud du système de fichier à partir duquel le fichier devra être servi."
tags: [apache, guide]
icon: book-open
---

Ce document explique comment le serveur HTTP Apache utilise l'URL contenue dans une requête pour déterminer le noeud du système de fichier à partir duquel le fichier devra être servi.

## Modules et directives concernés

- [[12-modules/mod_actions|mod_actions]]
- [[12-modules/mod_alias|mod_alias]]
- [[12-modules/mod_autoindex|mod_autoindex]]
- [[12-modules/mod_dir|mod_dir]]
- [[12-modules/mod_imagemap|mod_imagemap]]
- [[12-modules/mod_negotiation|mod_negotiation]]
- [[12-modules/mod_proxy|mod_proxy]]
- [[12-modules/mod_rewrite|mod_rewrite]]
- [[12-modules/mod_speling|mod_speling]]
- [[12-modules/mod_userdir|mod_userdir]]
- [[12-modules/mod_vhost_alias|mod_vhost_alias]]
- [[13-directives/alias|Alias]]
- [[13-directives/aliasmatch|AliasMatch]]
- [[13-directives/checkspelling|CheckSpelling]]
- [[13-directives/directoryindex|DirectoryIndex]]
- [[13-directives/documentroot|DocumentRoot]]
- [[13-directives/errordocument|ErrorDocument]]
- [[13-directives/options|Options]]
- [[13-directives/proxypass|ProxyPass]]
- [[13-directives/proxypassreverse|ProxyPassReverse]]
- [[13-directives/proxypassreversecookiedomain|ProxyPassReverseCookieDomain]]
- [[13-directives/proxypassreversecookiepath|ProxyPassReverseCookiePath]]
- [[13-directives/redirect|Redirect]]
- [[13-directives/redirectmatch|RedirectMatch]]
- [[13-directives/rewritecond|RewriteCond]]
- [[13-directives/rewriterule|RewriteRule]]
- [[13-directives/scriptalias|ScriptAlias]]
- [[13-directives/scriptaliasmatch|ScriptAliasMatch]]
- [[13-directives/userdir|UserDir]]

## Racine des documents (DocumentRoot)

La méthode par défaut de httpd pour déterminer quel fichier servir pour une requête donnée, consiste à extraire le chemin de la requête, puis à l'ajouter à la fin de la valeur de la directive [[13-directives/documentroot|DocumentRoot]] définie dans vos fichiers de configuration. Ainsi, les fichiers et répertoires situés en dessous de [[13-directives/documentroot|DocumentRoot]] constituent l'arborescence de base des documents qui seront visibles depuis le web.

Par exemple, si la directive [[13-directives/documentroot|DocumentRoot]] contient `/var/www/html`, une requête pour `http://www.example.com/fish/guppies.html` retournera le fichier `/var/www/html/fish/guppies.html` au client.

Si la requête concerne un répertoire (autrement dit un chemin se terminant par un slash `/`), le nom du fichier qui sera recherché et servi depuis ce répertoire est défini via la directive [[13-directives/directoryindex|DirectoryIndex]]. Par exemple, supposons que `DocumentRoot` ait été définie comme précédemment, et que vous ayez défini `DirectoryIndex` comme suit :

```
DirectoryIndex index.html index.php
```

Si httpd reçoit alors une requête pour `http://www.example.com/fish/`, il tentera de servir le fichier `/var/www/html/fish/index.html`. Si ce fichier n'existe pas, il tentera de servir le fichier `/var/www/html/fish/index.php`.

Si aucun de ces fichiers existe, httpd tentera de générer et d'afficher un index du répertoire, à condition que [[12-modules/mod_autoindex|mod_autoindex]] ait été chargé et configuré pour le permettre.

httpd supporte aussi les [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|Hôtes virtuels]], ce qui lui permet de traiter des requêtes pour plusieurs hôtes. Dans ce cas, un [[13-directives/documentroot|DocumentRoot]] différent peut être défini pour chaque hôte virtuel; les directives fournies par le module [[12-modules/mod_vhost_alias|mod_vhost_alias]] peuvent aussi être utilisées afin de déterminer dynamiquement le noeud approprié du système de fichiers à partir duquel servir un contenu en fonction de l'adresse IP ou du nom d'hôte.

La directive [[13-directives/documentroot|DocumentRoot]] est définie dans le fichier de configuration de votre serveur principal (`httpd.conf`), mais peut aussi être redéfinie pour chaque [[11-guides/03-serveurs-virtuels/00-documentation-sur-les-serveurs-virtuels-apache|Hôte virtuel]] supplémentaire que vous avez créé.

## Fichiers situés en dehors de l'arborescence DocumentRoot

Il existe de nombreuses circonstances pour lesquelles il est nécessaire d'autoriser l'accès web à des portions du système de fichiers qui ne se trouvent pas dans l'arborescence [[13-directives/documentroot|DocumentRoot]]. httpd propose de nombreuses solutions pour réaliser cela. Sur les systèmes Unix, les liens symboliques permettent de rattacher d'autres portions du système de fichiers au [[13-directives/documentroot|DocumentRoot]]. Pour des raisons de sécurité, httpd ne suivra les liens symboliques que si les [[13-directives/options|Options]] pour le répertoire concerné contiennent `FollowSymLinks` ou `SymLinksIfOwnerMatch`.

Une autre méthode consiste à utiliser la directive [[13-directives/alias|Alias]] pour rattacher toute portion du système de fichiers à l'arborescence du site web. Par exemple, avec

```apache
Alias "/docs" "/var/web"
```

l'URL `http://www.example.com/docs/dir/file.html` correspondra au fichier `/var/web/dir/file.html`. La directive [[13-directives/scriptalias|ScriptAlias]] fonctionne de la même manière, excepté que tout contenu localisé dans le chemin cible sera traité comme un script CGI.

Pour les situations qui nécessitent plus de flexibilité, vous disposez des directives [[13-directives/aliasmatch|AliasMatch]] et [[13-directives/scriptaliasmatch|ScriptAliasMatch]] qui permettent des substitutions et comparaisons puissantes basées sur les expressions rationnelles. Par exemple,

```apache
ScriptAliasMatch "^/~([a-zA-Z0-9]+)/cgi-bin/(.+)" "/home/$1/cgi-bin/$2"
```

fera correspondre une requête du style `http://example.com/~user/cgi-bin/script.cgi` au chemin `/home/user/cgi-bin/script.cgi`, et traitera le fichier résultant comme un script CGI.

## Répertoires des utilisateurs

Sur les systèmes Unix, on peut traditionnellement faire référence au répertoire personnel d'un *utilisateur* particulier à l'aide de l'expression `~user/`. Le module [[12-modules/mod_userdir|mod_userdir]] étend cette idée au web en autorisant l'accès aux fichiers situés dans les répertoires home des utilisateurs à l'aide d'URLs comme dans ce qui suit :

```
http://www.example.com/~user/file.html
```

Pour des raisons de sécurité, il est déconseillé de permettre un accès direct à un répertoire home d'utilisateur depuis le web. A cet effet, la directive [[13-directives/userdir|UserDir]] spécifie un répertoire où sont situés les fichiers accessibles depuis le web dans le répertoire home de l'utilisateur. Avec la configuration par défaut `Userdir public_html`, l'URL ci-dessus correspondra à un fichier dont le chemin sera du style `/home/user/public_html/file.html` où `/home/user/` est le répertoire home de l'utilisateur tel qu'il est défini dans `/etc/passwd`.

La directive `Userdir` met à votre disposition de nombreuses formes différentes pour les systèmes où `/etc/passwd` ne spécifie pas la localisation du répertoire home.

Certains jugent le symbole "~" (dont le code sur le web est souvent `%7e`) inapproprié et préfèrent utiliser une chaîne de caractères différente pour représenter les répertoires utilisateurs. mod\_userdir ne supporte pas cette fonctionnalité. Cependant, si les répertoires home des utilisateurs sont structurés de manière rationnelle, il est possible d'utiliser la directive [[13-directives/aliasmatch|AliasMatch]] pour obtenir l'effet désiré. Par exemple, pour faire correspondre `http://www.example.com/upages/user/file.html` à `/home/user/public_html/file.html`, utilisez la directive `AliasMatch` suivante :

```apache
AliasMatch "^/upages/([a-zA-Z0-9]+)(/(.*))?$"   "/home/$1/public_html/$3"
```

## Redirection d'URL

Les directives de configuration décrites dans les sections précédentes demandent à httpd d'extraire un contenu depuis un emplacement spécifique du système de fichiers et de la retourner au client. Il est cependant parfois souhaitable d'informer le client que le contenu demandé est localisé à une URL différente, et de demander au client d'élaborer une nouvelle requête avec la nouvelle URL. Ce processus se nomme *redirection* et est implémenté par la directive [[13-directives/redirect|Redirect]]. Par exemple, si le contenu du répertoire `/foo/` sous [[13-directives/documentroot|DocumentRoot]] est déplacé vers le nouveau répertoire `/bar/`, vous pouvez demander aux clients de le requérir à sa nouvelle localisation comme suit :

```apache
Redirect permanent "/foo/"   "http://www.example.com/bar/"
```

Ceci aura pour effet de rediriger tout chemin d'URL commençant par `/foo/` vers le même chemin d'URL sur le serveur `www.example.com` en remplaçant `/foo/` par `/bar/`. Vous pouvez rediriger les clients non seulement sur le serveur d'origine, mais aussi vers n'importe quel autre serveur.

httpd propose aussi la directive [[13-directives/redirectmatch|RedirectMatch]] pour traiter les problèmes de réécriture d'une plus grande complexité. Par exemple, afin de rediriger les requêtes pour la page d'accueil du site vers un site différent, mais laisser toutes les autres requêtes inchangées, utilisez la configuration suivante :

```apache
RedirectMatch permanent "^/$"    "http://www.example.com/startpage.html"
```

De même, pour rediriger temporairement toutes les pages d'un site vers une page particulière d'un autre site, utilisez ce qui suit :

```apache
RedirectMatch temp ".*"  "http://othersite.example.com/startpage.html"
```

## Mandataire inverse (Reverse Proxy)

httpd vous permet aussi de rapatrier des documents distants dans l'espace des URL du serveur local. Cette technique est appelée *mandataire inverse ou reverse proxying* car le serveur web agit comme un serveur mandataire en rapatriant les documents depuis un serveur distant puis les renvoyant au client. Ceci diffère d'un service de mandataire usuel (direct) car, pour le client, les documents semblent appartenir au serveur mandataire inverse.

Dans l'exemple suivant, quand les clients demandent des documents situés dans le répertoire `/foo/`, le serveur rapatrie ces documents depuis le répertoire `/bar/` sur `internal.example.com` et les renvoie au client comme s'ils appartenaient au serveur local.

```apache
ProxyPass "/foo/" "http://internal.example.com/bar/"
ProxyPassReverse "/foo/" "http://internal.example.com/bar/"
ProxyPassReverseCookieDomain internal.example.com public.example.com
ProxyPassReverseCookiePath "/foo/" "/bar/"
```

La directive [[13-directives/proxypass|ProxyPass]] configure le serveur pour rapatrier les documents appropriés, alors que la directive [[13-directives/proxypassreverse|ProxyPassReverse]] réécrit les redirections provenant de `internal.example.com` de telle manière qu'elles ciblent le répertoire approprié sur le serveur local. De manière similaire, les directives [[13-directives/proxypassreversecookiedomain|ProxyPassReverseCookieDomain]] et [[13-directives/proxypassreversecookiepath|ProxyPassReverseCookiePath]] réécrivent les cookies élaborés par le serveur d'arrière-plan.

Il est important de noter cependant, que les liens situés dans les documents ne seront pas réécrits. Ainsi, tout lien absolu sur `internal.example.com` fera décrocher le client du serveur mandataire et effectuer sa requête directement sur `internal.example.com`. Vous pouvez modifier ces liens (et d'utres contenus) situés dans la page au moment où elle est envoyée au client en utilisant le module [[12-modules/mod_substitute|mod_substitute]].

```apache
Substitute "s/internal\.example\.com/www.example.com/i"
```

Le module [[12-modules/mod_proxy_html|mod_proxy_html]] rend possible une réécriture plus élaborée des liens en HTML et XHTML. Il permet de créer des listes d'URLs et de leurs réécritures, de façon à pouvoir gérer des scénarios de réécriture complexes.

## Moteur de réécriture

Le moteur de réécriture [[12-modules/mod_rewrite|mod_rewrite]] peut s'avérer utile lorsqu'une substitution plus puissante est nécessaire. Les directives fournies par ce module peuvent utiliser des caractéristiques de la requête comme le type de navigateur ou l'adresse IP source afin de décider depuis où servir le contenu. En outre, mod\_rewrite peut utiliser des fichiers ou programmes de bases de données externes pour déterminer comment traiter une requête. Le moteur de réécriture peut effectuer les trois types de mise en correspondance discutés plus haut : redirections internes (aliases), redirections externes, et services mandataires. De nombreux exemples pratiques utilisant mod\_rewrite sont discutés dans la [[11-guides/05-reecriture-mod-rewrite/00-guide-pour-le-module-apache-mod-rewrite|documentation détaillée de mod_rewrite]].

## Fichier non trouvé (File Not Found)

Inévitablement, apparaîtront des URLs qui ne correspondront à aucun fichier du système de fichiers. Ceci peut arriver pour de nombreuses raisons. Il peut s'agir du déplacement de documents d'une localisation vers une autre. Dans ce cas, le mieux est d'utiliser la redirection d'URL pour informer les clients de la nouvelle localisation de la ressource. De cette façon, vous êtes sur que les anciens signets et liens continueront de fonctionner, même si la ressource est déplacée.

Une autre cause fréquente d'erreurs "File Not Found" est l'erreur de frappe accidentelle dans les URLs, soit directement dans le navigateur, soit dans les liens HTML. httpd propose le module [[12-modules/mod_speling|mod_speling]] (sic) pour tenter de résoudre ce problème. Lorsque ce module est activé, il intercepte les erreurs "File Not Found" et recherche une ressource possédant un nom de fichier similaire. Si un tel fichier est trouvé, mod\_speling va envoyer une redirection HTTP au client pour lui communiquer l'URL correcte. Si plusieurs fichiers proches sont trouvés, une liste des alternatives possibles sera présentée au client.

mod\_speling possède une fonctionnalité particulièrement utile : il compare les noms de fichiers sans tenir compte de la casse. Ceci peut aider les systèmes où les utilisateurs ne connaissent pas la sensibilité des URLs à la casse et bien sûr les systèmes de fichiers unix. Mais l'utilisation de mod\_speling pour toute autre chose que la correction occasionnelle d'URLs peut augmenter la charge du serveur, car chaque requête "incorrecte" entraîne une redirection d'URL et une nouvelle requête de la part du client.

[[12-modules/mod_dir|mod_dir]] fournit la directive [[13-directives/fallbackresource|FallbackResource]] qui permet d'associer des URIs virtuels à une ressource réelle qui peut ainsi les servir. Cette directive remplace avantageusement [[12-modules/mod_rewrite|mod_rewrite]] lors de l'implémentation d'un "contrôleur frontal".

Si toutes les tentatives pour localiser le contenu échouent, httpd retourne une page d'erreur avec le code de statut HTTP 404 (file not found). L'apparence de cette page est contrôlée à l'aide de la directive [[13-directives/errordocument|ErrorDocument]] et peut être personnalisée de manière très flexible comme discuté dans le document [[11-guides/01-generalites/messages-d-erreur-personnalises|Réponses personnalisées aux erreurs]].

## Autres modules de mise en correspondance des URLs

Les autres modules disponibles pour la mise en correspondance des URLs sont :

- [[12-modules/mod_actions|mod_actions]] - Met une URL en correspondance avec un script CGI en fonction de la méthode de la requête, ou du type MIME de la ressource.
- [[12-modules/mod_dir|mod_dir]] - Permet une mise en correspondance basique d'un slash terminal dans un fichier index comme `index.html`.
- [[12-modules/mod_imagemap|mod_imagemap]] - Met en correspondance une requête avec une URL en fonction de la zone d'une image intégrée à un document HTML dans laquelle un utilisateur clique.
- [[12-modules/mod_negotiation|mod_negotiation]] - Sélectionne le document approprié en fonction de préférences du client telles que la langue ou la compression du contenu.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
