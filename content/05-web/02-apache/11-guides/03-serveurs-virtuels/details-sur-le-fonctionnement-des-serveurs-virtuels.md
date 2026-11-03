---
title: "Détails sur le fonctionnement des serveurs virtuels"
description: "Apache HTTP Server — Détails sur le fonctionnement des serveurs virtuels. Ce document vise à expliquer dans le détail comment le serveur HTTP Apache procède lors du choix de l'utilisation d'un serveur virtuel en fonction d'une requête reçue. Il est recommandé de lire la documentationServeurs virtuels à base de no"
tags: [apache, guide]
icon: book-open
---

Ce document vise à expliquer dans le détail comment le serveur HTTP Apache procède lors du choix de l'utilisation d'un serveur virtuel en fonction d'une requête reçue.

Il est recommandé de lire la documentation[[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|Serveurs virtuels à base de nom et serveurs virtuels à base d'adresse IP]] pour déterminer quel type de serveur virtuel nous convient le mieux, puis de lire les documentations [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|serveurs virtuels à base de nom]] ou [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-ip|serveurs virtuels à base d'adresse IP]], et enfin d'étudier [[11-guides/03-serveurs-virtuels/exemples-d-utilisations-de-virtualhost|quelques exemples]].

Si vous voulez entrer dans les détails, vous pouvez revenir vers cette page.

## Fichier de configuration

Un *serveur principal (main\_server)* contient toutes les définitions qui apparaissent en dehors des sections `<VirtualHost>`.

Les serveurs virtuels, aussi appelés *vhosts* (pour virtual hosts), sont définis par les sections [[13-directives/virtualhost|<VirtualHost>]].

Chaque directive `VirtualHost` comporte une ou plusieurs adresses et des ports optionnels.

Il est possible d'utiliser des noms d'hôtes dans la définition d'un serveur virtuel, mais ils seront résolus en adresses IP au démarrage du serveur, et si une résolution de nom échoue, cette définition de serveur virtuel sera ignorée. Cette méthode est par conséquent déconseillée.

L'adresse peut être spécifiée sous la forme `*`, ce qui conviendra à la requête si aucun autre serveur virtuel ne possède l'adresse IP explicite correspondant à celle de la requête.

L'adresse qui apparaît dans la directive `VirtualHost` peut être associée à un port optionnel. Si aucun port n'est spécifié, il s'agit d'un port générique qui peut aussi être spécifié comme `*`. Le port générique correspond à toutes les valeurs de port.

(Il ne faut pas confondre les numéros de port sur lesquels Apache est en écoute avec les numéros de port spécifiés dans la directive `VirtualHost` ; ces derniers ne servent qu'à définir le `serveur virtuel` qui sera sélectionné pour traiter la requête. Pour définir les ports sur lesquels Apache est en écoute, utilisez la directive [[13-directives/listen|Listen]]).

L'ensemble des adresses (y compris les résultats multiples `A` issus des requêtes DNS) est appelé *jeu d'adresses* du serveur virtuel.

Apache fait automatiquement sa sélection à partir de l'en-tête HTTP `Host` fourni par le client, lorsque la correspondance la plus exacte du point de vue adresse IP/port a lieu pour plusieurs serveurs virtuels.

La directive [[13-directives/servername|ServerName]] peut apparaître en quelque endroit de la définition d'un serveur. Cependant, chaque occurrence écrase la précédente (pour ce serveur). Si aucune directive `ServerName` n'est spécifiée, le serveur tente de déterminer le nom du serveur à partir de l'adresse IP.

Le premier serveur virtuel à base de nom apparaissant dans le fichier de configuration pour une paire IP:port donnée est significatif car c'est lui qui sera utilisé pour toutes les requêtes reçues sur cette adresse IP/port et pour laquelle aucun autre serveur virtuel ne possède un ServerName ou un ServerAlias correspondant. Il sera aussi utilisé pour toutes les connexions SSL si le serveur ne supporte pas l'Indication du nom du serveur.

Tous les noms spécifiés au sein d'une section `VirtualHost` sont traités comme un `ServerAlias` (sans caractères génériques), mais ne sont écrasés par aucune directive `ServerAlias`.

Pour chaque serveur virtuel, diverses valeurs sont initialisées par défaut. En particulier :

1. Dans le cas où un serveur virtuel ne contient pas de directives [[13-directives/serveradmin|ServerAdmin]], [[13-directives/timeout|Timeout]], [[13-directives/keepalivetimeout|KeepAliveTimeout]], [[13-directives/keepalive|KeepAlive]], [[13-directives/maxkeepaliverequests|MaxKeepAliveRequests]], [[13-directives/receivebuffersize|ReceiveBufferSize]], ou [[13-directives/sendbuffersize|SendBufferSize]], alors la valeur de chacun de ces paramètres est héritée de celle du serveur principal. (C'est à dire, héritée de la valeur finale après lecture de la configuration du serveur principal.)
2. Les permissions par défaut sur les répertoires de chaque serveur virtuel sont assemblées avec celles du serveur principal. Elles concernent également toutes les informations de configuration par répertoire pour tous les modules.
3. Les configurations par serveur pour chaque module sont assemblées à partir de celles du serveur principal.

L'essentiel des valeurs de configuration des serveurs virtuels provient de valeurs par défaut issues du serveur principal. Mais la position dans le fichier de configuration des directives du serveur principal n'a pas d'importance -- l'ensemble de la configuration du serveur principal est lu avant que ces valeurs par défaut soient appliquées aux serveur virtuels. Ainsi, même si la définition d'une valeur apparaît après celle d'un serveur virtuel, cette valeur peut affecter la definition du serveur virtuel.

Dans le cas où le serveur principal n'a pas de `ServerName` à ce stade, le nom de la machine sur laquelle tourne le programme [[10-commandes/httpd|httpd]] est utilisé à sa place. Nous appellerons *jeu d'adresses du serveur principal* les adresses IP renvoyées par une résolution DNS sur le `ServerName` du serveur principal.

Pour tous les champs `ServerName` non définis, dans le cas d'une configuration en serveur virtuel par nom, la valeur adoptée par défaut est la première adresse donnée dans la section `VirtualHost` qui définit le serveur virtuel.

Si un serveur virtuel contient la valeur magique `_default_`, il fonctionne sur le même `ServerName` que le serveur principal.

## Choix du serveur virtuel

Le serveur détermine le serveur virtuel à utiliser pour une requête en deux phases : une recherche basée sur l’IP lorsque la connexion est établie, puis une recherche optionnelle à base de nom à la réception de la requête.

### Phase 1 : recherche sur l’adresse IP et le port

Lorsqu’une connexion est établie, le serveur recherche l’adresse IP et le port de destination dans sa liste d’adresses/ports des `serveurs virtuels`. Cette recherche respecte un ordre de priorité strict :

| Priorité | Type de correspondance | Exemple |
| --- | --- | --- |
| 1 | Adresse IP et port exacts | `<VirtualHost 10.0.0.1:80>` |
| 2 | Adresse IP exacte, port générique | `<VirtualHost 10.0.0.1:*>` |
| 3 | Adresse IP générique (`*`), port exact | `<VirtualHost *:80>` |
| 4 | Adresse IP et port génériques | `<VirtualHost *:*>` |
| 5 | Serveur principal | (aucun `serveur virtuel` ne correspond) |

> [!NOTE]
> **Important**
>
> Le serveur utilise la *première correspondance trouvée* en suivant cet ordre. Lorsqu’une correspondance est trouvée à un niveau de priorité donné, aucun niveau de priorité inférieur n’est considéré — même si un serveur virtuel de priorité inférieure possède un `ServerName` qui correspond au contenu de l’en-tête `Host` de la requête. La recherche à base de nom (Phase 2) n’intervient que lorsque deux serveurs virtuels de même niveau de priorité peuvent correspondre.

S'il existe des définitions `VirtualHost` pour l'adresse IP, l'étape suivante consiste à déterminer si nous avons à faire à un serveur virtuel à base de nom ou d'adresse IP.

### Serveur virtuel par IP

Si la Phase 1 ne trouve qu’un seul `serveur virtuel` correspondant, la requête est servie directement depuis ce dernier sans effectuer d’autre recherche.

### Phase 2 : recherche à base de nom

Si la phase 1 trouve plusieurs `serveurs virtuels` correspondants de même niveau de priorité, le serveur effectue une recherche à base de nom parmi ces serveurs virtuels en utilisant l’en-tête `Host:` de la requête (ou le nom d’hôte SNI pour les connexions SSL).

Si la connexion utilise SSL, si le serveur supporte l'Indication de nom de serveur, et si la négociation du client SSL inclut l'extension TLS dans le nom d'hôte requis, alors ce nom d'hôte sera utilisé par la suite, tout comme un en-tête `Host:` aurait été utilisé dans le cas d'une connexion non-SSL. Si ces conditions ne sont pas réunies, le premier serveur virtuel à base de nom dont l'adresse correspond sera utilisé pour les connexions SSL. Ceci est important car c'est le serveur virtuel qui détermine quel certificat le serveur va utiliser pour la connexion.

La recherche de serveurs virtuels correspondants s’effectue selon leur ordre d’apparition dans le fichier de configuration :

1. Les contenus des directives [[13-directives/servername|ServerName]] et [[13-directives/serveralias|ServerAlias]] de chaque serveur virtuel sont comparés au nom d’hôte de la requête. La première correspondance est retenue.
2. Si aucun `ServerName` ou `ServerAlias` ne correspond, c’est le *premier serveur virtuel de la liste* qui sera choisi. Il s’agit du *serveur virtuel à base de nom par défaut* pour cette combinaison adresse/port.

Un champ d’en-tête `Host:` peut contenir un numéro de port, mais httpd l’ignore toujours et effectue sa recherche de correspondance avec le port réel auquel le client a envoyé sa requête.

Si la requête ne possède pas d’en-tête `Host:` (comme les requêtes HTTP/1.0), le premier serveur virtuel qui correspond est choisi. Mais si une directive [[13-directives/serverpath|ServerPath]] est configurée pour un des serveurs virtuels correspondants et que l’URL de la requête correspond à ce chemin, la requête sera servie depuis ce serveur virtuel. Il s’agit d’un mécanisme patrimonial pour les clients HTTP/1.0 ; voir l’exemple avec [[11-guides/03-serveurs-virtuels/exemples-d-utilisations-de-virtualhost|ServerPath]] pour les détails.

### Connexions persistantes

La *recherche par adresse IP* (Phase 1) n'est effectuée qu'*une fois* pour une session TCP/IP particulière, alors que la recherche par nom (Phase 2) est effectuée pour *chaque* requête au cours d'une connexion persistante (KeepAlive). En d'autres termes, il est possible pour un client de faire des requêtes pour des pages sur différents serveurs virtuels par nom, au cours d'une unique connexion persistante.

### URI absolu

Au cas où l'URI de la requête est absolu, et que son nom de serveur et son port correspondent au serveur principal (ou l'un des serveurs virtuels configurés), *et* qu'ils correspondent à l'adresse et au port de la requête, alors l'URI est amputé de son préfixe protocole/nom de serveur/port et traité par le serveur correspondant (principal ou virtuel). Si cette correspondance n'existe pas, l'URI reste inchangé et la requête est considérée comme une requête d'un serveur mandataire (proxy).

### Observations

- La sélection d'un serveur virtuel en fonction de son nom est un processus qui intervient *après* que le serveur a cerné la liste de candidats qui correspondent du point de vue adresse IP.
- Si vous ne tenez pas compte de l'adresse IP à laquelle le client s'est connecté, indiquez un caractère "`*`" comme adresse pour tous les serveurs virtuels, et la sélection du serveur virtuel en fonction du nom s'appliquera alors à tous les serveurs virtuels définis.
- Les vérifications sur `ServerName` et `ServerAlias` ne sont jamais réalisées pour les serveurs virtuels par IP (celles pour lesquelles il n’y a qu’un seul serveur virtuel pour cette adresse IP/port).
- Seul l'ordre des serveurs virtuels par nom pour une adresse donnée a une importance. Le serveur virtuel par nom qui est présent en premier dans la configuration se voit attribué la priorité la plus haute pour les requêtes arrivant sur son jeu d'adresses IP.
- Le numéro de port contenu dans l'en-tête `Host:` n'est jamais utilisé pour les tests de correspondances. Apache ne prend en compte que le numéro de port sur lequel le client a envoyé la requête.
- Si deux serveurs virtuels partagent la même adresse, la sélection se fera implicitement sur le nom. Il s'agit d'une nouvelle fonctionnalité de la version 2.3.11.
- Le serveur principal ne sert les requêtes que lorsque l'adresse IP et le port demandés par le client ne correspondent à aucun serveur virtuel (y compris un serveur virtuel `*`). En d'autres termes, le serveur principal n'est utile que pour les combinaisons adresse/port non spécifiées (sauf quand un serveur virtuel `_default_` correspond au port).
- Il ne faut jamais employer de noms DNS dans des directives `VirtualHost`, car cela oblige le serveur a s'appuyer sur le DNS au moment du démarrage. De plus, vous vous exposez à des problèmes de sécurité si vous n'avez pas la maîtrise du DNS pour la totalité de vos domaines. Voir la documentation [[11-guides/01-generalites/problemes-lies-au-dns-avec-le-serveur-http-apache|disponible ici]], ainsi que les deux points précisés ci-après.
- Un nom de serveur `ServerName` devrait toujours être indiqué pour chaque serveur virtuel. Sans cela, une résolution DNS est nécessaire pour chaque serveur virtuel.

## Trucs et astuces

En plus des points évoqués sur la page des [[11-guides/01-generalites/problemes-lies-au-dns-avec-le-serveur-http-apache|problèmes liés au DNS]], voici quelques points intéressants :

- Toujours positionner les définitions relatives au serveur principal avant toute définition `VirtualHost`. (Ceci améliore grandement la lisibilité de la configuration -- la manière dont la configuration est interprétée après la lecture des fichiers ne met pas en évidence le fait que les définitions positionnées avant et surtout après les serveurs virtuels peuvent impacter le fonctionnement de tous les serveurs virtuels.)

## Voir aussi

- [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-ip|Support des serveurs virtuels à base d'adresse IP]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
