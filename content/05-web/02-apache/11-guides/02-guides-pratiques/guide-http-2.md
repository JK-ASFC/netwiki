---
title: "Guide HTTP/2"
description: "Apache HTTP Server — Guide HTTP/2. Ce document est le guide de l'utilisateur de l'implémentation de HTTP/2 dans Apache httpd. Cette fonctionnalité en est au stade de production, et les interfaces et directives devraient donc être dorénavant relativement stables."
tags: [apache, guide]
icon: book-open
---

Ce document est le guide de l'utilisateur de l'implémentation de HTTP/2 dans Apache httpd. Cette fonctionnalité en est au stade *de production*, et les interfaces et directives devraient donc être dorénavant relativement stables.

## Le protocole HTTP/2

HTTP/2 est une évolution du protocole de la couche application le plus utilisé au monde, HTTP. Cette évolution permet en particulier une utilisation plus efficace des ressources réseau. Il ne modifie pas les aspects fondamentaux de HTTP (sa sémantique). Entre autres, il y a toujours des requêtes, des réponses et des en-têtes. Par conséquent, si vous connaissez HTTP/1, vous connaissez déjà 95% deHTTP/2.

Le protocole est définii dans la [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113) (qui rend obsolète la [RFC 7540](https://www.rfc-editor.org/rfc/rfc7540) originale). Pour une approche plus abordable, voir le document [http2 explained](https://daniel.haxx.se/http2/) par Daniel Stenberg, l’auteur de [curl](https://curl.haxx.se). Il couvre les but et conception de HTTP/2 sans nécessiter d’analyse de la notation RFC préalable.

En bref, il y a quelques nouveaux termes et pièges à éviter que vous devez garder à l’esprit lors de la lecture de ce document :

- À l’opposé de HTTP 1.1 qui est un protocole en texte pur, HTTP/2 est un **protocol binaire**. Le premier a été pensé pour être lisible par un humain (par exemple pour surveiller le trafic réseau), alors que ce n’est pas le cas pour le second. Vous trouverez plus d’information dans cette [question](https://http2.github.io/faq/#why-is-http2-binary) de la FAQ officielle.
- **h2** correspond à HTTP/2 sur TLS (négociation de protocole via ALPN).
- **h2c** correspond à HTTP/2 sur TCP en texte clair (sans TLS). Notez que h2c a été supprimé de la spécification actuelle mais que httpd le prend encore en charge.
- Une **trame** (frame) est la plus petite unité de communication au sein d’une connexion HTTP/2 ; elle comporte un en-tête et une séquence d’octets de longueur variable structurée en fonction du type de trame. Vous trouverez plus d’informations dans la documentation officielle de la [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113).
- Un **flux** (stream) est une circulation bidirectionnelle de trames au sein d’une connexion HTTP/2. Le concept correspondant dans HTTP 1.1 est un échange de messages requête/réponse. Vous trouverez plus d’informations dans la documentation officielle de la [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113).
- HTTP/2 peut gérer **plusieurs flux** de données sur la même connexion TCP, évitant le classique blocage en tête de file des requêtes HTTP 1.1 lentes, ainsi que la nécessité de réinitier des connexions TCP pour chaque requête/réponse (KeepAlive contournait le problème dans HTTP 1.1, mais ne le résolvait pas entièrement).

## HTTP/2 dans Apache httpd

Le protocole HTTP/2 est implémenté dans Apache httpd via un module propre, pertinemment nommé [[12-modules/mod_http2|mod_http2]]. Ce module implémente toutes les fonctionnalités décrites par la RFC 9113 et supporte les connexions en texte pur (http:), ou sécurisées (https:). La variante texte pur se nomme '`h2c`', et la variante sécurisée '`h2`'. `h2c` peut être en mode *direct* ou `Upgrade:` via une requête initiale en HTTP/1.

Server Push était une nouvelle fonctionnalité offerte aux développeurs web par HTTP/2, mais elle est maintenant obsolète. Voir la section EarlyHints pour l’alternative recommandée.

## Compilation de httpd avec le support de HTTP/2

[[12-modules/mod_http2|mod_http2]] se base sur la bibliothèque de [nghttp2](https://nghttp2.org) pour son implémentation. Pour pouvoir compiler [[12-modules/mod_http2|mod_http2]], `libnghttp2` version 1.2.1. ou supérieure doit être installée dans votre système.

Pour déclencher la compilation de `mod_http2`, vous devez ajouter l'argument '`--enable-http2`' au script `./configure` que vous exécutez à la racine de l'arborescence des sources de httpd. Si `libnghttp2` est installée dans un répertoire non connu du chemin de vos bibliothèques, vous devez indiquer ce répertoire au script `./configure` via l'argument '`--with-nghttp2=<path>`'.

Alors que cette méthode de compilation conviendra à la plupart, certains préféreront lier statiquement `nghttp2` à ce module. Pour ce faire, utilisez l'argument `--enable-nghttp2-staticlib-deps`. Cette méthode est pratiquement la même que celle utilisée pour lier statiquement openssl à [[12-modules/mod_ssl|mod_ssl]].

En parlant de SSL, vous devez savoir que la plupart des navigateurs ne communiqueront en HTTP/2 que sur des URLs sécurisées de type `https:` ; votre serveur doit donc supporter SSL. Mais de plus, votre bibliothèque SSL devra supporter l'extension `ALPN`. Enfin, si la bibliothèque que vous utilisez est OpenSSL, sa version devra être 1.0.2. ou supérieure.

## Configuration de base

Maintenant que vous disposez d'un binaire `httpd` compilé avec le module [[12-modules/mod_http2|mod_http2]], l'activation de ce dernier nécessite un minimum de configuration supplémentaire. En premier lieu, comme pour tout module de httpd, vous devez le charger :

```apache
LoadModule http2_module modules/mod_http2.so
```

La seconde directive que vous devez ajouter à votre fichier de configuration est

```apache
Protocols h2 http/1.1
```

Ceci permet de définir h2, la variante sécurisée, comme le protocole préféré pour les connexions à votre serveur. Si vous souhaitez que toutes les variantes soient disponibles, utilisez la directive suivante :

```apache
Protocols h2 h2c http/1.1
```

Selon l'endroit où vous placez cette directive, elle affectera toute les connexions, ou seulement celles vers un serveur virtuel spécifique. Vous pouvez aussi l'imbriquer comme dans l'exemple suivant :

```apache
Protocols http/1.1
<VirtualHost ...>
ServerName test.example.org
Protocols h2 http/1.1
</VirtualHost>
```

Seules les connexions en HTTP/1 seront alors permises, sauf pour les connexions SSL vers `test.example.org` qui propose aussi HTTP/2.

> [!NOTE]
> **Utilisez une chaîne d'algorithmes de chiffrement forte**
>
> La directive [[13-directives/sslciphersuite|SSLCipherSuite]] doit être définie avec une chaîne d'algorithmes de chiffrement TLS forte. Même si la version actuelle de [[12-modules/mod_http2|mod_http2]] n'impose pas d'algorithmes de chiffrement particuliers, la plupart des clients le font. Faire pointer un navigateur vers un serveur où `h2` est activé avec une chaîne d'algorithmes de chiffrement inappropriée entraînera un rejet et une retrogradation vers HTTP 1.1. C'est une erreur que l'on fait couramment lorsqu'on configure httpd pour HTTP/2 pour la première fois ; donc gardez la à l'esprit si vous voulez éviter de longues sessions de débogage ! Si vous voulez être sûr de définir une chaîne d'algorithmes de chiffrement appropriée, évitez ceux qui sont listés dans la liste des algorithmes de chiffrement TLS HTTP/2 à proscrire ([RFC 7540](https://www.rfc-editor.org/rfc/rfc7540)).

L'ordre des protocoles indiqués est aussi important. Par défaut, le premier sera le protocole préféré. Lorsqu'un client offre plusieurs choix, c'est le plus à gauche qui sera sélectionné. Dans

```apache
Protocols http/1.1 h2
```

le protocole préféré sera HTTP/1 et il sera toujours sélectionné sauf si un client ne supporte *que* h2. Comme nous souhaitons communiquer en HTTP/2 avec les clients qui le supportent, la meilleure définition de la directive est

```apache
Protocols h2 h2c http/1.1
```

Toujours à propos de l'ordre des protocoles, le client a lui aussi ses propres préférences en la matière. À ce titre, si vous le souhaitez, vous pouvez configurer votre serveur pour qu'il sélectionne non plus son protocole préféré, mais au contraire le protocole préféré du client :

```apache
ProtocolsHonorOrder Off
```

Avec cette directive, l'ordre des protocoles que *vous* avez défini devient caduque et seul l'ordre défini par le client sera pris en compte.

Une dernière chose : les protocoles que vous définissez ne sont pas vérifiés quant à leurs validité ou orthographe. Vous pouvez très bien définir des protocoles qui n'existent pas, et il n'est donc pas nécessaire de filtrer le contenu de la directive [[13-directives/protocols|Protocols]] avec des vérifications de type [[13-directives/ifmodule|<IfModule>]].

Pour des conseils plus avancés à propos de la configuration, voir la [[12-modules/mod_http2|Documentation de mod_http2]], et en particulier la section à propos de la [[12-modules/mod_http2|consommation supplémentaire de ressources]], ainsi que la section expliquant comment gérer les [[12-modules/mod_http2|serveurs multiples avec certificat commun]].

## Configuration du MPM

Tous les modules multiprocessus (MPM) fournis avec httpd supportent HTTP/2. Cependant, si vous utilisez le MPM [[12-modules/prefork|prefork]], vous allez faire face à de sévères restrictions.

Avec le MPM [[12-modules/prefork|prefork]], [[12-modules/mod_http2|mod_http2]] ne traitera qu'une requête à la fois par connexion alors que les clients tels que les navigateurs internet envoient de nombreuses requêtes au même moment. Si l'une d'entre elles est longue à traiter (ou implique une longue interrogation), les autres requêtes seront mises en attente.

Par défaut, [[12-modules/mod_http2|mod_http2]] ne passe pas outre cette limitation pour la simple et bonne raison que le MPM [[12-modules/prefork|prefork]] n'est aujourd'hui choisi que si vous exécutez des moteurs de traitement qui ne sont pas préparés pour le multithreading (par exemple qui se crashent lorsque plusieurs requêtes arrivent).

Si votre plateforme et votre installation de httpd le supportent, la meilleur solution consiste actuellement à utiliser le MPM [[12-modules/event|event]].

Si vous n'avez pas d'autre choix que d'utiliser le MPM [[12-modules/prefork|prefork]], mais souhaitez tout de même traiter plusieurs requêtes simultanément, vous pouvez jouer avec la directive [[13-directives/h2minworkers|H2MinWorkers]], sans garantie que cela fonctionne.

## Clients

Tous les navigateurs modernes prennent en charge HTTP/2 sur des connexions TLS ([source](https://caniuse.com/http2)). La prise en charge est devenue universelle sur les navigateurs principaux à peu près en 2015.

D'autres clients et serveurs sont listés dans le [wiki des implémentations](https://github.com/http2/http2-spec/wiki/Implementations) ; entre autres des implémentations pour c, c++, common lisp, dart, erlang, haskell, java, nodejs, php, python, perl, ruby, rust, scala et swift.

De nombreuses implémentations clientes autres que les navigateurs supportent HTTP/2 en texte pur, h2c. L'une des plus efficaces d'entre elles est [curl](https://curl.haxx.se).

## Outils efficaces pour déboguer HTTP/2

Le premier d'entre eux est bien entendu [curl](https://curl.haxx.se). Assurez-vous au préalable que votre version supporte HTTP/2 en vérifiant ses `Fonctionnalités` :

```bash
$ curl -V
curl 8.20.0 (x86_64-pc-linux-gnu) libcurl/8.20.0 OpenSSL/3.5.7 zlib/1.3.1 nghttp2/1.69.0
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps pop3 [...]
Features: IPv6 Largefile NTLM NTLM_WB SSL libz TLS-SRP HTTP2
```

> [!NOTE]
> **Notes à propos de macOS Homebrew**
>
> `curl` de Homebrew inclut par défaut la prise en charge de HTTP/2. Installez le avec la commande `brew install curl` et suivez les instructions affichées pour le mettre en tête du PATH de votre système.

Pour une inspection en profondeur : [wireshark](https://wiki.wireshark.org/HTTP2).

Le paquet [nghttp2](https://nghttp2.org) inclut aussi des outils comme :

- [nghttp](https://nghttp2.org/documentation/nghttp.1.html) - permet de visualiser les trames HTTP/2 et ainsi de se faire une meilleure idée du protocole.
- [h2load](https://nghttp2.org/documentation/h2load-howto.html) - permet de tester votre serveur dans des conditions extremes.

Chrome fournit des journaux détaillés des connexions HTTP/2 via la page special net-internals page. Il y a aussi cette extension intéressante pour [Chrome](https://chromewebstore.google.com/detail/http-indicator/hgcomhbcacfkpffiphlmnlhpppcjgmbl) et [Firefox](https://addons.mozilla.org/en-us/firefox/addon/http2-indicator/) qui permet d'indiquer que votre navigateur utilise HTTP/2.

## Push serveur

> [!WARNING]
> **Notification d’obsolescence**
>
> Server Push est obsolète dans la [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113). Les navigateurs principaux (Chrome 106+, Edge 106+) ont supprimé sa prise en charge. Bien que [[12-modules/mod_http2|mod_http2]] implémente encore push, les nouveaux déploiements doivent utiliser 103 Early Hints à titre de méthode plus fiable pour informer les clients à propos des ressources nécessaires.

Le protocole HTTP/2 permet au serveur de proposer (PUSH) des réponses pour lesquelles le client n'a rien demandé. La communication autour de ces réponses est du style : "voici une requête que vous n'avez jamais envoyée, et la réponse vous parviendra bientôt tout de même ..."

Il y a cependant des conditions : le client peut désactiver cette fonctionnalité et le serveur ne pourra alors lui proposer des réponses que pour les requêtes qu'il a effectivement envoyées.

Cette fonctionnalité a pour but de permettre au serveur d'envoyer au client des ressources dont il va probablement avoir besoin : par exemple une ressource css ou javascript appartenant à une page html que le client a demandée, un jeu d'images référencé par un css, etc...

Cette anticipation a pour avantage de permettre au client d'économiser le temps qu'il lui aurait fallu pour envoyer une requête, quelques millisecondes à une demi-seconde en fonction de l'éloignement du serveur. Elle a cependant pour inconvénient d'imposer au client le téléchargement de ressources qu'il possède peut-être déjà dans son cache. Bien entendu, HTTP/2 permet d'annuler prématurément de telles requêtes, mais des ressources sont tout de même gaspillées.

En résumé : il n'existe pas encore de stratégie efficace pour faire le meilleur usage de cette fonctionnalité de HTTP/2 et tout le monde en est encore au stade de l'expérimentation. À ce titre, voici des conseils pour procéder vous-même à ces expérimentations :

[[12-modules/mod_http2|mod_http2]] inspecte l'en-tête de la réponse et recherche les en-têtes `Link` sous un certain format :

```apache
Link </xxx.css>;rel=preload, </xxx.js>; rel=preload
```

Si la connexion supporte PUSH, ces deux ressources seront envoyées au client. En tant que développeur web vous pouvez définir ces en-têtes soit directement au niveau de la réponse de votre application, soit en configurant votre serveur via

```apache
<Location /xxx.html>
Header add Link "</xxx.css>;rel=preload"
Header add Link "</xxx.js>;rel=preload"
</Location>
```

Si vous souhaitez utiliser des liens `preload` sans déclencher de PUSH, vous pouvez utiliser le paramètre `nopush` comme suit :

```apache
Link </xxx.css>;rel=preload;nopush
```

Vous pouvez aussi désactiver les PUSHes pour l'ensemble de votre serveur via la directive

```apache
H2Push Off
```

À savoir aussi :

Le module maintient un journal des ressources ayant fait l'objet d'un PUSH pour chaque connexion (en général des condensés hash des URLs), et n'effectuera pas deux fois un PUSH pour la même ressource. Cependant, lorsque la connexion est fermée, le journal de ses PUSHes est supprimé.

Certains développeurs planchent sur la manière de permettre au client d'informer le serveur des ressources qu'il possède déjà dans son cache afin d'éviter les PUSHes pour ces dernières, mais aucune norme n’a émergé avant que push ne devienne obsolète.

L'[en-tête Accept-Push-Policy](https://datatracker.ietf.org/doc/html/draft-ruellan-http-accept-push-policy-00) est un dispositif expérimental implémenté dans [[12-modules/mod_http2|mod_http2]] ; il permet au client de définir pour chaque requête quels genres de PUSHes il accepte. Ce dispositif a été abandonné et n’a jamais été adopté.

La fonctionnalité PUSH n'apportera pas toujours le gain de performances dans l'obtention de réponses aux requêtes. Vous trouverez plusieurs études sur ce sujet sur internet qui en expliquent les avantages et inconvénients et comment les particularités des clients et du réseau en influencent le fonctionnement. Par exemple, le seul fait que le serveur PUSHes une ressource n'implique pas forcément que le navigateur l'utilisera.

Ce qui influence le plus la réponse PUSHed, c'est la requête qui a été simulée. En effet, l'URL de la requête pour un PUSH est fournie par l'application, mais d'où viennent les en-têtes ? Par exemple, La requête PUSH requiert-elle un en-tête `accept-language` et si oui, quelle sera sa valeur ?

httpd va consulter la requête originale (celle qui a déclenché le PUSH) et copier les en-têtes suivants vers la requête PUSH : `user-agent`, `accept`, `accept-encoding`, `accept-language` et `cache-control`.

Tous les autres en-têtes sont ignorés. Les cookies eux non plus ne seront pas copiés. PUSHer des ressources qui requièrent la présence d'un cookie ne fonctionnera pas. Ceci peut être sujet à débat, mais tant que ce ne sera pas clairement discuté avec les navigateurs, restons prudents et évitons d'exposer les cookies là où ils ne sont pas censés être visibles.

## EarlyHints

A l'instar des ressources PUSHées, une autre méthode consiste à envoyer des en-têtes `Link` au client avant même que la réponse ne soit prête. Cette méthode utilise la fonctionnalité appelée "Suggestions précoces" (Early Hints) décrite dans la [RFC 8297](https://www.rfc-editor.org/rfc/rfc8297).

Pour utiliser cette fonctionnalité, vous devez l'activer explicitement sur le serveur via :

```apache
H2EarlyHints on
```

Elle n'est en effet pas activée par défaut car certains navigateurs anciens perdent pied avec de telles réponses.

Une fois cette fonctionnalité activée, vous pouvez utiliser la directive [[13-directives/h2pushresource|H2PushResource]] pour déclencher les suggestions précoces et les PUSHes de ressources :

```apache
<Location /xxx.html>
H2PushResource /xxx.css
H2PushResource /xxx.js
</Location>
```

Le serveur enverra alors au client une réponse `"103 Early Hints"` dès qu'il *commencera* à traiter la requête. Selon votre application web, cet envoi peut intervenir beaucoup plus tôt que le moment où les premiers en-têtes de réponse auront été déterminés.

Si [[13-directives/h2push|H2Push]] est activé, ceci déclenchera aussi le PUSH juste après la réponse 103. Mais si [[13-directives/h2push|H2Push]] n'est pas activé, la réponse 103 sera quand-même envoyée au client.

## Voir aussi

- [[12-modules/mod_http2|mod_http2]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
