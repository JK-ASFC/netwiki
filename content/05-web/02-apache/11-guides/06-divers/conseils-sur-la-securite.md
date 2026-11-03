---
title: "Conseils sur la sécurité"
description: "Apache HTTP Server — Conseils sur la sécurité. Ce document propose quelques conseils et astuces concernant les problèmes de sécurité liés à l'installation d'un serveur web. Certaines suggestions seront à caractère général, tandis que d'autres seront spécifiques à Apache."
tags: [apache, guide]
icon: book-open
---

Ce document propose quelques conseils et astuces concernant les problèmes de sécurité liés à l'installation d'un serveur web. Certaines suggestions seront à caractère général, tandis que d'autres seront spécifiques à Apache.

## Maintenez votre serveur à jour

Le serveur HTTP Apache a une bonne réputation en matière de sécurité et possède une communauté de développeurs très sensibilisés aux problèmes de sécurité. Mais il est inévitable de trouver certains problèmes -- petits ou grands -- une fois le logiciel mis à disposition. C'est pour cette raison qu'il est crucial de se tenir informé des mises à jour. Si vous avez obtenu votre version du serveur HTTP directement depuis Apache, nous vous conseillons grandement de vous abonner à la [Liste de diffusion des annonces du serveur HTTP](http://httpd.apache.org/lists.html#http-announce) qui vous informera de la parution des nouvelles versions et des mises à jour de sécurité. La plupart des distributeurs tiers d'Apache fournissent des services similaires.

Gardez cependant à l'esprit que lorsqu'un serveur web est compromis, le code du serveur HTTP n'est la plupart du temps pas en cause. Les problèmes proviennent plutôt de code ajouté, de scripts CGI, ou du système d'exploitation sous-jacent. Vous devez donc vous tenir informé des problèmes et mises à jour concernant tous les logiciels présents sur votre système.

## Attaques de type "Déni de service" (Denial of Service - DoS)

Tous les services réseau peuvent faire l'objet d'attaques de type "Déni de service" qui tentent de les empêcher de répondre aux clients en saturant leurs ressources. Il est impossible de se prémunir totalement contre ce type d'attaques, mais vous pouvez accomplir certaines actions afin de minimiser les problèmes qu'elles créent.

Souvent, l'outil anti-DoS le plus efficace sera constitué par le pare-feu ou certaines configurations du système d'exploitation. Par exemple, la plupart des pare-feu peuvent être configurés de façon à limiter le nombre de connexions simultanées depuis une adresse IP ou un réseau, ce qui permet de prévenir toute une gamme d'attaques simples. Bien sûr, ceci n'est d'aucun secours contre les attaques de type "Déni de service" distribuées (DDoS).

Certains réglages de la configuration d'Apache peuvent aussi minimiser les problèmes :

- La directive [[13-directives/requestreadtimeout|RequestReadTimeout]] permet de limiter le temps que met le client pour terminer la négociation TLS et envoyer sa requête. En particulier, la phase `handshake` met hors délai les clients qui se figent lors de la négociation TLS.
- La valeur de la directive [[13-directives/timeout|TimeOut]] doit être diminuée sur les sites sujets aux attaques DoS. Une valeur de quelques secondes devrait convenir. Cependant, comme [[13-directives/timeout|TimeOut]] est actuellement concerné par de nombreuses opérations différentes, lui attribuer une valeur trop faible peut provoquer des problèmes avec les scripts CGI qui présentent un long temps de réponse.
- La valeur de la directive [[13-directives/keepalivetimeout|KeepAliveTimeout]] doit aussi être diminuée sur les sites sujets aux attaques DoS. Certains sites désactivent même complètement le "maintien en vie" (keepalives) à l'aide de la directive [[13-directives/keepalive|KeepAlive]], ce qui bien sûr présente des inconvénients en matière de performances.
- Les valeurs des différentes directives fournies par d'autres modules et en rapport avec des délais doivent aussi être vérifiées.
- Les directives [[13-directives/limitrequestbody|LimitRequestBody]], [[13-directives/limitrequestfields|LimitRequestFields]], [[13-directives/limitrequestfieldsize|LimitRequestFieldSize]], [[13-directives/limitrequestline|LimitRequestLine]], et [[13-directives/limitxmlrequestbody|LimitXMLRequestBody]] doivent être configurées avec prudence afin de limiter la consommation de ressources induite par les demandes des clients.
- Sur les systèmes d'exploitation qui le supportent, assurez-vous que la directive [[13-directives/acceptfilter|AcceptFilter]] est activée afin de déléguer une partie du traitement des requêtes au système d'exploitation. Elle est activée par défaut dans le démon httpd d'Apache, mais peut nécessiter une reconfiguration de votre noyau.
- Optimisez la directive [[13-directives/maxrequestworkers|MaxRequestWorkers]] de façon à définir le nombre maximum de connexions simultanées au dessus duquel les ressources s'épuisent. Voir aussi la [[11-guides/06-divers/optimisation-des-performances-d-apache|documentation sur l'optimisation des performances]].
- L'utilisation d'un [[11-guides/01-generalites/modules-multi-processus-mpms|module mpm]] threadé vous permet de traiter d'avantage de connexions simultanées, ce qui minimise l'effet des attaques DoS. Dans le futur, le module mpm [[12-modules/event|event]] utilisera un traitement asynchrone afin de ne pas dédier un thread à chaque connexion.
- Il existe de nombreux modules tiers qui peuvent restreindre les comportements de certains clients et ainsi minimiser les problèmes de DoS.

## Permissions sur les répertoires de la racine du serveur

Typiquement, Apache est démarré par l'utilisateur root, puis il devient la propriété de l'utilisateur défini par la directive [[13-directives/user|User]] afin de répondre aux demandes. Comme pour toutes les commandes exécutées par root, vous devez vous assurer qu'elle n'est pas modifiable par les utilisateurs autres que root. Les fichiers eux-mêmes, mais aussi les répertoires ainsi que leurs parents ne doivent être modifiables que par root. Par exemple, si vous avez choisi de placer la racine du serveur dans `/usr/local/apache`, il est conseillé de créer le répertoire en tant que root, avec des commandes du style :

```
mkdir /usr/local/apache
cd /usr/local/apache
mkdir bin conf logs
chown 0 . bin conf logs
chgrp 0 . bin conf logs
chmod 755 . bin conf logs
```

Nous supposerons que `/`, `/usr` et `/usr/local` ne sont modifiables que par root. Quand vous installez l'exécutable [[10-commandes/httpd|httpd]], vous devez vous assurer qu'il possède des protections similaires :

```
cp httpd /usr/local/apache/bin
chown 0 /usr/local/apache/bin/httpd
chgrp 0 /usr/local/apache/bin/httpd
chmod 511 /usr/local/apache/bin/httpd
```

Vous pouvez créer un sous-répertoire htdocs modifiable par d'autres utilisateurs -- car root ne crée ni exécute aucun fichier dans ce sous-répertoire.

Si vous permettez à des utilisateurs non root de modifier des fichiers que root écrit ou exécute, vous exposez votre système à une compromission de l'utilisateur root. Par exemple, quelqu'un pourrait remplacer le binaire [[10-commandes/httpd|httpd]] de façon à ce que la prochaine fois que vous le redémarrerez, il exécutera un code arbitraire. Si le répertoire des journaux a les droits en écriture (pour un utilisateur non root), quelqu'un pourrait remplacer un fichier journal par un lien symbolique vers un autre fichier système, et root pourrait alors écraser ce fichier avec des données arbitraires. Si les fichiers journaux eux-mêmes ont des droits en écriture (pour un utilisateur non root), quelqu'un pourrait modifier les journaux eux-mêmes avec des données fausses.

## Inclusions côté serveur

Les inclusions côté serveur (Server Side Includes - SSI) exposent l'administrateur du serveur à de nombreux risques potentiels en matière de sécurité.

Le premier risque est l'augmentation de la charge du serveur. Tous les fichiers où SSI est activé doivent être analysés par Apache, qu'ils contiennent des directives SSI ou non. L'augmentation de la charge induite est minime, mais peut devenir significative dans le contexte d'un serveur partagé.

Les fichiers SSI présentent les mêmes risques que les scripts CGI en général. Les fichiers où SSI est activé peuvent exécuter tout script CGI ou autre programme à l'aide de la commande `"exec cmd"` avec les permissions des utilisateur et groupe sous lesquels Apache s'exécute, comme défini dans `httpd.conf`.

Des méthodes existent pour améliorer la sécurité des fichiers SSI, tout en tirant parti des bénéfices qu'ils apportent.

Pour limiter les dommages qu'un fichier SSI agressif pourrait causer, l'administrateur du serveur peut activer[[11-guides/01-generalites/support-suexec|suexec]] comme décrit dans la section Les CGI en général.

L'activation des SSI pour des fichiers possédant des extensions `.html` ou `.htm` peut s'avérer dangereux. Ceci est particulièrement vrai dans un environnement de serveur partagé ou étant le siège d'un traffic élevé. Les fichiers où SSI est activé doivent posséder une extension spécifique, telle que la conventionnelle `.shtml`. Ceci permet de limiter la charge du serveur à un niveau minimum et de simplifier la gestion des risques.

Une autre solution consiste à interdire l'exécution de scripts et programmes à partir de pages SSI. Pour ce faire, remplacez `Includes` par `IncludesNOEXEC` dans la directive [[13-directives/options|Options]]. Notez que les utilisateurs pourront encore utiliser `<--#include virtual="..." -->` pour exécuter des scripts CGI si ces scripts sont situés dans des répertoires spécifiés par une directive [[13-directives/scriptalias|ScriptAlias]].

## Les CGI en général

Tout d'abord, vous devez toujours garder à l'esprit que vous devez faire confiance aux développeurs de scripts ou programmes CGI ainsi qu'à vos compétences pour déceler les trous de sécurité potentiels dans les CGI, que ceux-ci soient délibérés ou accidentels. Les scripts CGI peuvent essentiellement exécuter des commandes arbitraires sur votre système avec les droits de l'utilisateur du serveur web, et peuvent par conséquent être extrèmement dangereux s'ils ne sont pas vérifiés avec soin.

Tous les scripts CGI s'exécutent sous le même utilisateur, il peuvent donc entrer en conflit (accidentellement ou délibérément) avec d'autres scripts. Par exemple, l'utilisateur A hait l'utilisateur B, il écrit donc un script qui efface la base de données CGI de l'utilisateur B. Vous pouvez utiliser le programme [[11-guides/01-generalites/support-suexec|suEXEC]] pour faire en sorte que les scripts s'exécutent sous des utilisateurs différents. Ce programme est inclus dans la distribution d'Apache depuis la version 1.2 et est appelé à partir de certaines portions de code du serveur Apache. Une autre méthode plus connue est l'utilisation de [CGIWrap](http://cgiwrap.sourceforge.net/).

## CGI sans alias de script

Vous ne devez permettre aux utilisateurs d'exécuter des scripts CGI depuis n'importe quel répertoire que dans l'éventualité où :

- Vous faites confiance à vos utilisateurs pour ne pas écrire de scripts qui vont délibérément ou accidentellement exposer votre système à une attaque.
- Vous estimez que le niveau de sécurité dans les autres parties de votre site est si faible qu'un trou de sécurité de plus ou de moins n'est pas très important.
- Votre système ne comporte aucun utilisateur, et personne ne visite jamais votre site.

## CGI avec alias de script

Le confinement des CGI dans des répertoires spécifiques permet à l'administrateur de contrôler ce que l'on met dans ces répertoires. Ceci est bien entendu mieux sécurisé que les CGI sans alias de script, mais seulement à condition que les utilisateurs avec les droits en écriture sur les répertoires soient dignes de confiance, et que l'administrateur ait la volonté de tester chaque programme ou script CGI à la recherche d'éventuels trous de sécurité.

La plupart des sites choisissent cette approche au détriment des CGI sans alias de script.

## Autres sources de contenu dynamique

Les options de scripting intégrées qui s'exécutent en tant que partie du serveur lui-même, comme `mod_php`, `mod_perl`, `mod_tcl`, et `mod_python`, s'exécutent sous le même utilisateur que le serveur (voir la directive [[13-directives/user|User]]), et par conséquent, les scripts que ces moteurs exécutent peuvent accéder aux mêmes ressources que le serveur. Certains moteurs de scripting peuvent proposer des restrictions, mais pour plus de sûreté, il vaut mieux partir du principe que ce n'est pas le cas.

## Sécurité des contenus dynamiques

Quand vous utilisez des cadriciels à contenu dynamique — que ce soit à travers `mod_php`, `mod_perl`, `mod_python` ou tout autre générateur de contenu intégré ou externe — les responsabilités en matière de sécurité s’étendent au-delà de httpd lui-même. Chaque cadriciel possède ses propres modèle de sécurité, options de configuration et guides de durcissement. Consultez la documentation de la technologie que vous utilisez pour générer du contenu dynamique et maintenez cette dernière à jour.

Les principes généraux s’appliquent à tout cadriciel :

- Accordez des privilèges minimaux à vos scripts et applications.
- Vérifiez et nettoyez toute entrée de l’utilisateur.
- Maintenez à jour votre cadriciel de contenu et ses dépendances.
- Vérifiez la configuration de la sécurité de votre cadriciel — les valeurs par défaut ne sont pas toujours appropriées en matière de sécurité.

Au niveau de httpd, un pare-feu d’application web tel que [ModSecurity](https://modsecurity.org/) peut fournir une couche supplémentaire de défense en inspectant et filtrant le trafic HTTP avant qu’il n’atteigne votre application.

## Protection de la configuration du système

Pour contrôler étroitement votre serveur, vous pouvez interdire l'utilisation des fichiers `.htaccess` qui permettent de passer outre les fonctionnalités de sécurité que vous avez configurées. Voici un moyen pour y parvenir :

Ajoutez dans le fichier de configuration du serveur

```apache
<Directory "/">
    AllowOverride None
</Directory>
```

Ceci interdit l'utilisation des fichiers `.htaccess` dans tous les répertoires, sauf ceux pour lesquels c'est explicitement autorisé.

Notez que c'est la configuration par défaut depuis Apache 2.3.9.

## Protection par défaut des fichiers du serveur

Le concept d'accès par défaut est un aspect d'Apache qui est parfois mal compris. C'est à dire que, à moins que vous ne changiez explicitement ce comportement, si le serveur trouve son chemin vers un fichier en suivant les règles normales de correspondance URL - fichier, il peut le retourner aux clients.

Considérons l'exemple suivant :

```
# cd /; ln -s / public_html
puis accès à http://localhost/~root/
```

Ceci permettrait aux clients de parcourir l'ensemble du système de fichiers. Pour l'éviter, ajoutez le bloc suivant à la configuration de votre serveur :

```apache
<Directory "/">
    Require all denied
</Directory>
```

ceci va interdire l'accès par défaut à tous les fichiers du système de fichiers. Vous devrez ensuite ajouter les blocs [[13-directives/directory|<Directory>]] appropriés correspondant aux répertoires auxquels vous voulez autorisez l'accès. Par exemple,

```apache
<Directory "/usr/users/*/public_html">
    Require all granted
</Directory>
<Directory "/usr/local/httpd">
    Require all granted
</Directory>
```

Portez une attention particulière aux interactions entre les directives [[13-directives/location|<Location>]] et [[13-directives/directory|<Directory>]] ; par exemple, si une directive `<Directory "/">` interdit un accès, une directive `<Location "/">` pourra passer outre.

De même, soyez méfiant en jouant avec la directive [[13-directives/userdir|UserDir]] ; la positionner à `"./"` aurait le même effet, pour root, que le premier exemple plus haut. Nous vous conseillons fortement d'inclure la ligne suivante dans le fichier de configuration de votre serveur :

```apache
UserDir disabled root
```

## Surveillez vos journaux

Pour vous tenir informé de ce qui se passe réellement dans votre serveur, consultez régulièrement vos [[11-guides/01-generalites/fichiers-journaux|fichiers journaux]]. Les fichiers journaux ne consignent que des évènements qui se sont déjà produits, mais ils vous informeront sur la nature des attaques qui sont lancées et vous permettront de vérifier si la configuration de votre sécurité est efficace.

Quelques exemples :

```bash
grep -c "\.\.\/" access_log
grep "client denied" error_log | tail -n 10
```

Le premier exemple compte les requêtes qui contiennent des séquences de traversée de chemin — un signe connu de recherche de vulnérabilités. Le second liste les dix « client denied » les plus récents ; par exemple :

```
[Mon Apr 14 09:42:03.817295 2026] [authz_core:error] [pid 1234:tid 5678]
[client 192.168.1.100:54312] AH01630: client denied by server configuration:
/usr/local/apache2/htdocs/.env
```

Comme vous pouvez le voir, les fichiers journaux ne mentionnent que ce qu’il s’est déjà produit. Si le client avait pu accéder au fichier `.env`, vous auriez vu une réponse `200` dans votre fichier [[11-guides/01-generalites/fichiers-journaux|Access Log]] — ce qui aurait signifié que la configuration de votre serveur devait être plus restrictive. Assurez-vous d’interdire l’accès aux fichiers sensibles :

```apache
<FilesMatch "^\.(?!well-known)">
    Require all denied
</FilesMatch>
```

## Fusion des sections de configuration

La fusion des sections de configuration est complexe et dépend souvent des directives utilisées. Vous devez systématiquement tester vos modifications pour vérifier la manière dont les directives sont fusionnées.

Concernant les modules qui n'implémentent aucune logique de fusion, comme [[12-modules/mod_access_compat|mod_access_compat]], le comportement des sections suivantes est tributaire de la présence dans ces dernières de directives appartenant à ces modules. La configuration est héritée jusqu'à ce qu'une modification soit effectuée ; à ce moment, la configuration est *remplacée* et non fusionnée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
