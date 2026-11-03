---
title: "Apache httpd et les variables d'environnement"
description: "Apache HTTP Server — Apache httpd et les variables d'environnement. Deux types de variables d'environnement affectent le serveur HTTP Apache. Le premier type correspond aux variables d'environnement contrôlées par le système d'exploitation sous-jacent et définies avant le démarrage du serveur. Leurs valeurs"
tags: [apache, guide]
icon: book-open
---

Deux types de variables d'environnement affectent le serveur HTTP Apache.

Le premier type correspond aux variables d'environnement contrôlées par le système d'exploitation sous-jacent et définies avant le démarrage du serveur. Leurs valeurs peuvent être utilisées directement dans les fichiers de configuration, et peuvent éventuellement être transmises aux scripts CGI et SSI à l'aide de la directive PassEnv.

Le second type correspond aux variables nommées appelées aussi *variables d'environnement* dans lesquelles le serveur HTTP Apache stocke des informations via un mécanisme spécial. Ces informations peuvent servir à contrôler diverses opérations comme l'enregistrement des traces ou le contrôle d'accès. On utilise aussi ces variables dans le mécanisme de communication avec les programmes externes comme les scripts CGI. Ce document présente différentes méthodes pour manipuler et utiliser ces variables.

Bien que ces variables soient référencées comme *variables d'environnement*, il ne faut pas les confondre avec les variables d'environnement contrôlées par le système d'exploitation sous-jacent. En fait, ces variables sont stockées et manipulées dans une structure interne à Apache httpd. Elles ne deviennent de véritables variables d'environnement du système d'exploitation que lorsqu'elles sont mises à la disposition de scripts CGI et de scripts inclus côté serveur (SSI). Si vous souhaitez manipuler l'environnement du système d'exploitation sous lequel le serveur s'exécute, vous devez utiliser les mécanismes standards de manipulation de l'environnement fournis par l'interpréteur de commandes (shell) de votre système d'exploitation.

## Définition des variables d'environnement

- [[12-modules/mod_cache|mod_cache]]
- [[12-modules/mod_env|mod_env]]
- [[12-modules/mod_rewrite|mod_rewrite]]
- [[12-modules/mod_setenvif|mod_setenvif]]
- [[12-modules/mod_unique_id|mod_unique_id]]
- [[13-directives/browsermatch|BrowserMatch]]
- [[13-directives/browsermatchnocase|BrowserMatchNoCase]]
- [[13-directives/passenv|PassEnv]]
- [[13-directives/rewriterule|RewriteRule]]
- [[13-directives/setenv|SetEnv]]
- [[13-directives/setenvif|SetEnvIf]]
- [[13-directives/setenvifnocase|SetEnvIfNoCase]]
- [[13-directives/unsetenv|UnsetEnv]]

### Manipulations de base de l'environnement

La méthode la plus élémentaire pour définir une variable d'environnement au niveau d'Apache httpd consiste à utiliser la directive inconditionnelle [[13-directives/setenv|SetEnv]]. Les variables peuvent aussi être transmises depuis l'environnement du shell à partir duquel le serveur a été démarré en utilisant la directive [[13-directives/passenv|PassEnv]].

### Définitions conditionnelles en fonction des requêtes

Pour plus de souplesse, les directives fournies par le module [[12-modules/mod_setenvif|mod_setenvif]] permettent de définir les variables d'environnement en tenant compte des caractéristiques de chaque requête. Par exemple, une variable pourrait n'être définie que lorsqu'un navigateur spécifique (User-Agent) a généré la requête, ou seulement quand un en-tête Referer particulier est présent. La directive [[13-directives/rewriterule|RewriteRule]] du module [[12-modules/mod_rewrite|mod_rewrite]] qui utilise l'option `[E=...]` pour définir les variables d'environnement apporte encore plus de souplesse.

### Identifiants uniques

Finalement, le module [[12-modules/mod_unique_id|mod_unique_id]] définit la variable d'environnement `UNIQUE_ID` pour chaque requête à une valeur qui est garantie unique parmi « toutes » les requêtes sous des conditions très spécifiques.

### Variables CGI standards

En plus de l'ensemble des variables d'environnement internes à la configuration d'Apache httpd et de celles transmises depuis le shell, les scripts CGI et les pages SSI se voient affectés un ensemble de variables d'environnement contenant des méta-informations à propos de la requête comme préconisé dans la spécification sur les CGIs ([RFC 3875](https://www.rfc-editor.org/rfc/rfc3875)).

### Quelques mises en garde

- Les directives de manipulation de l'environnement ne permettent pas de supplanter ou modifier les variables CGI standards.
- Lorsqu'on utilise [[10-commandes/suexec|suexec]] pour exécuter des scripts CGI, l'environnement est nettoyé et réduit à un ensemble de variables *sûres* avant l'exécution du script. La liste des variables *sûres* est définie à la compilation dans `suexec.c`.
- Pour des raisons de portabilité, les noms des variables d'environnement ne peuvent contenir que des lettres, des chiffres et le caractère « souligné ». En outre, le premier caractère ne doit pas être un chiffre. Les caractères qui ne satisfont pas à ces conditions seront remplacés par un caractère « souligné » quand ils seront transmis aux scripts CGI et aux pages SSI.
- Les contenus d'en-têtes HTTP transmis aux scripts de type CGI ou autre à l'aide de variables d'environnement constituent un cas particulier (voir plus loin). Leur nom est converti en majuscules et seuls les tirets sont remplacés par des caractères '\_' (« souligné ») ; si le format du nom de l'en-tête n'est pas valide, celui-ci est ignoré. Voir plus loin pour une solution de contournement du problème.
- La directive [[13-directives/setenv|SetEnv]] s'exécute assez tard au cours du traitement de la requête, ce qui signifie que des directives telles que [[13-directives/setenvif|SetEnvIf]] et [[13-directives/rewritecond|RewriteCond]] ne verront pas les variables qu'elle aura définies.
- Lorsque le serveur cherche un chemin via une sous-requête interne (par exemple la recherche d'un [[13-directives/directoryindex|DirectoryIndex]]), ou lorsqu'il génère un listing du contenu d'un répertoire à l'aide du module [[12-modules/mod_autoindex|mod_autoindex]], la sous-requête n'hérite pas des variables d'environnement spécifiques à la requête. En outre, à cause des phases de l'API auxquelles [[12-modules/mod_setenvif|mod_setenvif]] prend part, les directives [[13-directives/setenvif|SetEnvIf]] ne sont pas évaluées séparément dans la sous-requête.

## Utilisation des variables d'environnement

- [[12-modules/mod_authz_host|mod_authz_host]]
- [[12-modules/mod_cgi|mod_cgi]]
- [[12-modules/mod_ext_filter|mod_ext_filter]]
- [[12-modules/mod_headers|mod_headers]]
- [[12-modules/mod_include|mod_include]]
- [[12-modules/mod_log_config|mod_log_config]]
- [[12-modules/mod_rewrite|mod_rewrite]]
- [[13-directives/require|Require]]
- [[13-directives/customlog|CustomLog]]
- [[13-directives/allow|Allow]]
- [[13-directives/deny|Deny]]
- [[13-directives/extfilterdefine|ExtFilterDefine]]
- [[13-directives/header|Header]]
- [[13-directives/logformat|LogFormat]]
- [[13-directives/rewritecond|RewriteCond]]
- [[13-directives/rewriterule|RewriteRule]]

> [!NOTE]
> **Alternative moderne : les expressions**
>
> De nombreux exemples d’utilisation qui nécessitaient auparavant de définir et tester des variables d’environnement — par exemple les en-têtes conditionnels, le contrôle d’accès et la journalisation — peuvent maintenant être traités de manière plus directe en utilisant les expressions [[13-directives/if|<If>]] avec la fonction `reqenv`. Voir [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le serveur HTTP Apache]] pour la syntaxe des expressions et la liste complète des [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|variables]] disponibles.

### Scripts CGI

La communication d'informations aux scripts CGI constitue une des principales utilisations des variables d'environnement. Comme indiqué plus haut, l'environnement transmis aux scripts CGI comprend des méta-informations standards à propos de la requête, en plus des variables définies dans la configuration d'Apache httpd. Pour plus de détails, se référer au [[11-guides/02-guides-pratiques/didacticiel-du-serveur-http-apache-contenu-dynamique-base-sur-cgi|tutoriel CGI]].

### Pages SSI

Les documents inclus côté serveur (SSI) traités par le filtre `INCLUDES` du module [[12-modules/mod_include|mod_include]], peuvent afficher les variables d'environnement à l'aide de l'élément `echo`, et peuvent utiliser des variables d'environnement dans les éléments de contrôle de flux pour rendre certaines parties d'une page conditionnelles en fonction des caractéristiques de la requête. Apache httpd fournit aussi les variables d'environnement CGI standards aux pages SSI comme indiqué plus haut. Pour plus de détails, se référer au [[11-guides/02-guides-pratiques/tutoriel-apache-httpd-introduction-aux-inclusions-cote-serveur-server-|tutoriel SSI]].

### Contrôle d'accès

L'accès au serveur peut être contrôlé en fonction de variables d'environnement à l'aide des directives `Require env` et `Require not env`. En association avec la directive [[13-directives/setenvif|SetEnvIf]], cela confère une grande souplesse au contrôle d'accès au serveur en fonction des caractéristiques du client. Par exemple, vous pouvez utiliser ces directives pour interdire l'accès depuis un navigateur particulier (User-Agent). Pour des conditions plus complexes, [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Require expr]] fournit une alternative qui permet d’évaluer des variables d’environnement en utilisant la fonction `reqenv` en combinaison avec d’autres propriétés de requête.

### Enregistrement conditionnel des traces

Les variables d'environnement peuvent être enregistrées dans le fichier de log des accès à l'aide de l'option `%e` de la directive [[13-directives/logformat|LogFormat]]. En outre, la décision de tracer ou non les requêtes peut être prise en fonction de l'état de variables d'environnement en utilisant la forme conditionnelle de la directive [[13-directives/customlog|CustomLog]]. En association avec la directive [[13-directives/setenvif|SetEnvIf]], cela confère une grande souplesse au contrôle du traçage des requêtes. Par exemple, vous pouvez choisir de ne pas tracer les requêtes pour des noms de fichiers se terminant par `gif`, ou encore de ne tracer que les requêtes des clients n'appartenant pas à votre sous-réseau.

### En-têtes de réponse conditionnels

La directive [[13-directives/header|Header]] peut se baser sur la présence ou l'absence d'une variable d'environnement pour décider si un certain en-tête HTTP sera placé dans la réponse au client. Cela permet, par exemple, de n'envoyer un certain en-tête de réponse que si un en-tête correspondant est présent dans la requête du client.

### Activation de filtres externes

Les filtres externes configurés par le module [[12-modules/mod_ext_filter|mod_ext_filter]] à l'aide de la directive [[13-directives/extfilterdefine|ExtFilterDefine]] peuvent être activés de manière conditionnelle en fonction d'une variable d'environnement à l'aide des options `disableenv=` et `enableenv=`.

### Réécriture d'URL

La forme `%{ENV:variable}` de *TestString* dans la directive [[13-directives/rewritecond|RewriteCond]] permet au moteur de réécriture du module [[12-modules/mod_rewrite|mod_rewrite]] de prendre des décisions conditionnées par des variables d'environnement. Notez que les variables accessibles dans [[12-modules/mod_rewrite|mod_rewrite]] sans le préfixe `ENV:` ne sont pas de véritables variables d'environnement. Ce sont plutôt des variables spécifiques à [[12-modules/mod_rewrite|mod_rewrite]] qui ne sont pas accessibles pour les autres modules.

## Variables d'environnement de CGI

La spécification sur les CGIs ([RFC 3875](https://www.rfc-editor.org/rfc/rfc3875)) définit un certain nombre de méta-variables dont beaucoup sont affectées de leur valeur à partir des en-têtes HTTP. Apache httpd les met à disposition en tant que variables d’environnement pour les scripts CGI et d’autres mécanismes de traitement des requêtes. Elles ont été plus largement adoptées et constituent une méthode standard pour transmettre des informations entre le navigateur et le serveur, et entre les processus au sein du serveur. Nous en décrivons quelques unes ici. Pour une liste complète des variables de requête disponibles dans les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]] (parmi lesquelles `REQUEST_URI`, `REMOTE_ADDR`, `SERVER_NAME` et de nombreuses autres), voir le document de référence [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|variables dans les expressions]].

Consultez la spécification CGI pour plus de détails à propos des métavariables CGI standard.

### QUERY\_STRING

La variable `QUERY_STRING` est définie avec tout ce qui apparaît après un point d'interrogation à la fin de l'URL d'une requête. Elle permet de transmettre des informations au serveur et peut être divisée en paires clé/valeur. L'encodage de la chaîne doit être de type URL.

```
https://example.com/path/resource.php?key1=value1&key2=another%20value
```

Dans cet exemple, la variable `QUERY_STRING` est définie avec tout ce qui suit le point d'interrogation, et l'application réceptrice (une application CGI ou un script PHP, par exemple) est chargée d'en extraire les paires clé/valeur.

### PATH\_INFO

La variable `PATH_INFO` est définie avec toute valeur qui apparaît après une ressource correspondante à la fin de l'URL, `QUERY_STRING` non comprise. Tout paraît plus clair avec un exemple :

```
https://example.com/resource.php/additional/data?key1=value1
```

Dans cet exemple, `PATH_INFO` est définie avec la chaîne `/additional/data` et `QUERY_STRING` avec la chaîne `key1=value1`.

## Variables d'environnement à usage spécial

Des problèmes d'interopérabilité ont conduit à l'introduction de mécanismes permettant de modifier le comportement d'Apache httpd lorsqu'il dialogue avec certains clients. Afin de rendre ces mécanismes aussi souples que possible, ils sont invoqués en définissant des variables d'environnement, en général à l'aide de la directive [[13-directives/browsermatch|BrowserMatch]], bien que les directives [[13-directives/setenv|SetEnv]] et [[13-directives/passenv|PassEnv]] puissent aussi être utilisées, par exemple.

### downgrade-1.0

Cela force le traitement d'une requête comme une requête HTTP/1.0 même si elle a été rédigée dans un langage plus récent.

### force-gzip

Si le filtre `DEFLATE` est activé, cette variable d'environnement ignorera les réglages accept-encoding de votre navigateur et enverra une sortie compressée inconditionnellement.

### force-no-vary

Cette variable entraîne la suppression de tout champ `Vary` des en-têtes de la réponse avant que cette dernière soit renvoyée au client. Certains clients n'interprètent pas ce champ correctement, et la définition de cette variable permet de contourner ce problème, mais implique aussi la définition de **force-response-1.0**.

### force-response-1.0

Cette variable force une réponse en langage HTTP/1.0 aux clients qui envoient des requêtes dans le même langage. Elle fut implémentée à l'origine suite à des problèmes avec les mandataires d'AOL. Certains clients en langage HTTP/1.0 ne réagissent pas correctement face à une réponse en langage HTTP/1.1, et cette variable peut être utilisée pour assurer l'interopérabilité avec eux.

### gzip-only-text/html

Positionnée à « 1 », cette variable désactive le filtre en sortie `DEFLATE` fourni par le module [[12-modules/mod_deflate|mod_deflate]] pour les types de contenu autres que `text/html`. Si vous préférez utiliser des fichiers compressés statiquement, [[12-modules/mod_negotiation|mod_negotiation]] évalue aussi la variable (non seulement pour gzip, mais aussi pour tous les encodages autres que « identity »).

### no-gzip

Quand cette variable est définie, le filtre `DEFLATE` du module [[12-modules/mod_deflate|mod_deflate]] est désactivé, et [[12-modules/mod_negotiation|mod_negotiation]] refusera de délivrer des ressources encodées.

### no-cache

*Disponible dans les versions 2.2.12 et ultérieures d'Apache httpd*

Lorsque cette variable est définie, [[12-modules/mod_cache|mod_cache]] ne sauvegardera pas de réponse susceptible d'être mise en cache. Cette variable d'environnement n'a aucune incidence sur le fait qu'une réponse déjà enregistrée dans le cache soit utilisée ou non pour la requête courante.

### nokeepalive

Quand cette variable est définie, la directive [[13-directives/keepalive|KeepAlive]] est désactivée.

### prefer-language

Cette variable modifie le comportement du module [[12-modules/mod_negotiation|mod_negotiation]]. Si elle contient un symbole de langage (tel que `en`, `ja` ou `x-klingon`), [[12-modules/mod_negotiation|mod_negotiation]] essaie de délivrer une variante dans ce langage. S'il n'existe pas de telle variante, le processus normal de [[11-guides/01-generalites/negociation-de-contenu|négociation]] s'applique.

### redirect-carefully

Cette variable force le serveur à être plus prudent lors de l'envoi d'une redirection au client. Elle est en général utilisée quand un client présente un problème connu avec les redirections. Elle fut implémentée à l'origine suite a un problème rencontré avec le logiciel WebFolders de Microsoft qui ne gère pas correctement les redirections vers des ressources de type répertoire via des méthodes DAV.

### suppress-error-charset

Quand Apache httpd génère une redirection en réponse à une requête client, la réponse inclut un texte destiné à être affiché au cas où le client ne suivrait pas, ou ne pourrait pas suivre automatiquement la redirection. Habituellement, Apache httpd marque ce texte en accord avec le jeu de caractères qu'il utilise, à savoir ISO-8859-1.

Cependant, si la redirection fait référence à une page qui utilise un jeu de caractères différent, certaines versions de navigateurs obsolètes essaieront d'utiliser le jeu de caractères du texte de la redirection plutôt que celui de la page réelle. Cela peut entraîner, par exemple, un rendu incorrect du Grec.

Si cette variable d'environnement est définie, Apache httpd omettra le jeu de caractères pour le texte de la redirection, et les navigateurs obsolètes précités utiliseront correctement celui de la page de destination.

> [!WARNING]
> **Note concernant la sécurité**
>
> L'envoi de pages d'erreur sans spécifier un jeu de caractères peut conduire à des attaques de type « cross-site-scripting" pour les navigateurs qui ne respectent pas la spécification HTTP/1.1 (MSIE) et tentent de déduire le jeu de caractères à partir du contenu. De tels navigateurs peuvent être facilement trompés et utiliser le jeu de caractères UTF-7 ; les contenus des données en entrée de type UTF-7 (comme les URI de requête) ne seront alors plus protégés par les mécanismes d'échappement usuels conçus pour prévenir les attaques de type « cross-site-scripting".

### force-proxy-request-1.0, proxy-nokeepalive, proxy-sendchunked, proxy-sendcl, proxy-chain-auth, proxy-interim-response, proxy-initial-not-pooled

Ces directives modifient le comportement protocolaire du module [[12-modules/mod_proxy|mod_proxy]]. Voir la documentation sur [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_http|mod_proxy_http]] pour plus de détails.

### ap\_trust\_cgilike\_cl

*Disponible à partir de la version 2.4.59 du serveur HTTP Apache*

Cette variable permet à un script qui s'exécute dans un module de type CGI de fournir son propre en-tête de réponse HTTP Content-Length. Elle ne doit être définie que dans les sections de configuration qui contiennent des scripts de confiance.

## Variables REDIRECT\_

Lorsqu'une redirection interne se produit — provoquée par une directive [[13-directives/errordocument|ErrorDocument]], par [[12-modules/mod_rewrite|mod_rewrite]], par une directive [[13-directives/fallbackresource|FallbackResource]] ou par tout autre mécanisme de redirection interne — les variables d'environnement de la requête originelle sont transmises à la cible de la redirection avec le préfixe `REDIRECT_`.

Deux variables supplémentaires sont toujours définies :

**`REDIRECT_URL`**

Le chemin URL de la requête originelle avant la redirection interne. Cette variable n'est pas définie par un quelconque module spécifique, mais par le cœur du serveur.

**`REDIRECT_STATUS`**

Le code d'état HTTP qui a déclenché la redirection. Pour les documents d'erreur, il s'agit du code d'état d'erreur (par exemple 404). Pour les redirections internes de [[12-modules/mod_rewrite|mod_rewrite]] ou de la directive [[13-directives/fallbackresource|FallbackResource]], il s'agit en général du code d'état 200.

Par exemple, si la valeur de `REQUEST_URI` était `/original/chemin` et qu'une redirection interne envoyait la requête à `/handler.php`, la cible de la redirection verrait `REDIRECT_URL=/original/path` et `REQUEST_URI=/handler.php`.

Ces variables sont disponibles pour les scripts CGI, les pages SSI et dans les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]]. Pour plus d'informations à propos des variables REDIRECT\_ dans le contexte des documents d'erreur, voir [[11-guides/01-generalites/messages-d-erreur-personnalises|Réponses aux erreurs personnalisées]].

## Exemples

### Transmission du contenu d'en-têtes non valides aux scripts CGI

Avec la version 2.4, Apache httpd est plus strict avec la conversion des en-têtes HTTP en variables d'environnement dans [[12-modules/mod_cgi|mod_cgi]] et d'autres modules : dans les versions précédentes, tout caractère non valable dans les noms d'en-têtes était tout simplement remplacé par un caractère '\_', ce qui pouvait exposer à des attaques de type cross-site-scripting via injection d'en-têtes.

Si vous devez prendre en charge un client qui envoie des en-têtes non conformes et si ceux-ci ne peuvent pas être corrigés, il existe une solution de contournement simple mettant en jeu les modules [[12-modules/mod_setenvif|mod_setenvif]] et [[12-modules/mod_headers|mod_headers]], et permettant de prendre en compte ces en-têtes :

```apache
# L'exemple suivant montre comment prendre en compte un en-tête
# Accept_Encoding non conforme envoyé par un client.
#
SetEnvIfNoCase ^Accept.Encoding$ ^(.*)$ fix_accept_encoding=$1
RequestHeader set Accept-Encoding %{fix_accept_encoding}e env=fix_accept_encoding
```

### Modification du comportement protocolaire face à des clients réagissant de manière non conforme

Les versions antérieures recommandaient l'ajout de ces lignes dans httpd.conf pour tenir compte de problèmes connus avec certains clients. Comme les clients concernés sont maintenant très peu utilisés, cet ajout n'est pratiquement plus nécessaire.

```apache
#
# The following directives modify normal HTTP response behavior.
# The first directive disables keepalive for Netscape 2.x and browsers that
# spoof it. There are known problems with these browser implementations.
# The second directive is for Microsoft Internet Explorer 4.0b2
# which has a broken HTTP/1.1 implementation and does not properly
# support keepalive when it is used on 301 or 302 (redirect) responses.
#
BrowserMatch "Mozilla/2" nokeepalive
BrowserMatch "MSIE 4\.0b2;" nokeepalive downgrade-1.0 force-response-1.0

#
# The following directive disables HTTP/1.1 responses to browsers which
# are in violation of the HTTP/1.0 spec by not being able to grok a
# basic 1.1 response.
#
BrowserMatch "RealPlayer 4\.0" force-response-1.0
BrowserMatch "Java/1\.0" force-response-1.0
BrowserMatch "JDK/1\.0" force-response-1.0
```

### Ne pas tracer les requêtes pour des images dans le fichier de trace des accès

Dans cet exemple, les requêtes pour des images n'apparaissent pas dans le fichier de trace des accès. Il peut être facilement adapté pour empêcher le traçage de répertoires particuliers, ou de requêtes en provenance de certains hôtes.

```apache
SetEnvIf Request_URI \.gif image-request
SetEnvIf Request_URI \.jpg image-request
SetEnvIf Request_URI \.png image-request
CustomLog "logs/access_log" common env=!image-request
```

### Prévention du « Vol d'image »

Cet exemple montre comment empêcher les utilisateurs ne faisant pas partie de votre serveur d'utiliser des images de votre serveur comme images en ligne dans leurs pages. Cette configuration n'est pas recommandée, mais elle peut fonctionner dans des circonstances bien définies. Nous supposons que toutes vos images sont enregistrées dans un répertoire nommé `/web/images`.

```apache
SetEnvIf Referer "^http://www\.example\.com/" local_referal
# Autorise les navigateurs qui n'envoient aucune information de Referer
SetEnvIf Referer "^$" local_referal
<Directory "/web/images">
    Require env local_referal
</Directory>
```

Pour plus d'informations sur cette technique, voir le tutoriel sur ServerWatch "[Keeping Your Images from Adorning Other Sites](https://www.serverwatch.com/guides/keeping-your-images-from-adorning-other-sites/)".

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
