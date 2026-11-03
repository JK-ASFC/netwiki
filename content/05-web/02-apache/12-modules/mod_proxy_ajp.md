---
title: "mod_proxy_ajp"
description: "Module Apache mod_proxy_ajp — Module de support AJP pour mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_ajp]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module de support AJP pour mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_ajp_module` |
| **Fichier source** | `mod_proxy_ajp.c` |
| **Compatibilité** | Disponible à partir de la version 2.1 du serveur HTTP Apache |

## Sommaire

Ce module nécessite le chargement de [[12-modules/mod_proxy|mod_proxy]]. Il fournit le support du `Protocole Apache JServ version 1.3` (nommé dans la suite de ce document *AJP13*).

Pour être en mesure d'exploiter le protocole `AJP13`, il est donc nécessaire de charger les modules [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_ajp|mod_proxy_ajp]].

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avant d'avoir [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux non seulement pour votre réseau, mais aussi pour l'Internet au sens large.

## Utilisation

Ce module permet de mandater en inverse un serveur d'application d'arrière-plan (comme Apache Tomcat) qui utilise le protocole AJP13. Son utilisation est similaire à celle d'un mandataire inverse HTTP, mais s'appuie sur le prefixe `ajp://` :

**Mandataire inverse simple**

```apache
ProxyPass "/app" "ajp://backend.example.com:8009/app"
```

Les options telles que l'option `secret` de Tomcat (requise par défaut depuis Tomcat 8.5.51 et 9.0.31) peut tout simplement être ajoutée en tant que paramètre séparé à la fin des directives [[13-directives/proxypass|ProxyPass]] ou [[13-directives/balancermember|BalancerMember]]. Ce paramètre est disponible à partir de la version 2.4.42 du serveur HTTP Apache :

**Mandataire inverse simple avec l'option `secret`**

```apache
ProxyPass "/app" "ajp://backend.example.com:8009/app" secret=YOUR_AJP_SECRET
```

On peut aussi configurer un répartiteur de charge :

**Mandataire inverse avec répartiteur de charge**

```apache
<Proxy "balancer://cluster">
    BalancerMember "ajp://app1.example.com:8009" loadfactor=1
    BalancerMember "ajp://app2.example.com:8009" loadfactor=2
    ProxySet lbmethod=bytraffic
</Proxy>
ProxyPass "/app" "balancer://cluster/app"
```

Notez qu'en général, la directive [[13-directives/proxypassreverse|ProxyPassReverse]] n'est pas nécessaire. La requête AJP inclut l'en-tête host original fourni au mandataire, et le serveur d'application est sensé générer des en-têtes auto-référençants relatifs à cet hôte ; aucune réécriture n'est donc nécessaire.

La situation la plus courante dans laquelle la directive [[13-directives/proxypassreverse|ProxyPassReverse]] est nécessaire se rencontre lorsque le chemin de l'URL au niveau du mandataire est différente de celle du serveur d'arrière-plan. Dans ce cas, un en-tête redirect peut être réécrit relativement à l'URL de l'hôte original (et non du serveur d'arrière-plan `ajp://` URL) ; par exemple :

**Réécriture d'un chemin mandaté**

```apache
ProxyPass "/apps/foo" "ajp://backend.example.com:8009/foo"
ProxyPassReverse "/apps/foo" "http://www.example.com/foo"
```

Il est cependant préférable en général de déployer l'application sur le serveur d'arrière-plan avec le même chemin que sur le mandataire.

## Variables d'environnement

Les variables d'environnement dont le nom possède le préfixe `AJP_` sont transmises au serveur original en tant qu'attributs de requête AJP (le préfixe `AJP_` étant supprimé du nom de la clé).

Notez que ces attributs de requête ne sont accessibles que sur demande directe à l’aide de la méthode `HttpServletRequest.getAttribute` — l’implémentation par Tomcat de la méthode [`getAttributeNames`](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/connector/Request.html#getAttributeNames--) ne les liste pas comme ceux qui sont gérés comme des attributs internes.

## Vue d'ensemble du protocole

Le protocole `AJP13` est orienté paquet. Le format binaire a été préféré, probablement pour des raisons de performances, au format texte pourtant plus lisible. Le serveur web communique avec le conteneur de servlets sur une connexion TCP. Pour diminuer la charge induite par le processus de création de socket, le serveur web va tenter d'utiliser des connexions TCP persistantes avec le conteneur de servlets, et de réutiliser les connexions pendant plusieurs cycles requêtes/réponse.

Lorsqu'une connexion a été assignée à une requête particulière, elle ne sera utilisée pour aucune autre jusqu'à ce que le cycle de traitement de la requête se soit terminé. En d'autres termes, il n'y a pas de multiplexage des requêtes sur une connexion. Ceci se traduit par un code beaucoup plus simple à chaque extrémité de la connexion, un nombre plus important de connexions étant cependant ouvertes en même temps.

Lorsque le serveur web a ouvert une connexion vers le conteneur de servlets, celle-ci peut se trouver dans l'un des états suivants :

- Idle
  Aucune requête n'est traitée sur cette connexion.
- Assigned
  La connexion fait l'objet d'un traitement de requête.

Lorsqu'une connexion est assignée au traitement d'une requête particulière, les informations de base de cette dernière (comme les en-têtes HTTP, etc...) sont envoyées sur la connexion sous une forme très condensée (par exemple les chaînes courantes sont codées sous forme d'entiers). Vous trouverez des détails sur ce format plus loin dans la structure des paquets de requête. Si la requête possède un corps `(content-length > 0)`, il est envoyé dans un paquet séparé immédiatement après.

A ce moment, le conteneur est probablement prêt à traiter la requête. Au cours de ce traitement, il peut renvoyer les messages suivants au serveur web :

- SEND\_HEADERS
  Renvoie un jeu d'en-têtes au navigateur.
- SEND\_BODY\_CHUNK
  Renvoie un tronçon de corps de requête au navigateur.
- GET\_BODY\_CHUNK
  Reçoit un autre tronçon de données de la requête si elle n'a pas encore été transmise intégralement. Ce type de transmission est nécessaire car les paquets possèdent une taille maximale fixe, et des quantités quelconques de données peuvent être contenues dans le corps de la requête (pour un chargement de fichier, par exemple). Notez que cela n'a rien à voir avec le transfert HTTP fractionné.
- END\_RESPONSE
  Termine le cycle du traitement de la requête.

Chaque message est associé à un paquet de données formaté différemment. Voir plus loin les structures des paquets de réponses pour plus de détails.

## Structure de base des paquets

Ce protocole hérite en partie de XDR, mais il diffère sur de nombreux points (pas d'alignement sur 4 bits, par exemple).

AJP13 utilise les octets selon leur ordre d'arrivée par le réseau pour tous les types de données.

Le protocole comporte quatre types de données : octets, booléens, entiers et chaînes de caractères.

**Octet**

Un seul octet.

**Booléen**

Un seul octet, `1 = vrai`, `0 = faux`. L'utilisation d'autres valeurs non nulles (dans le style C) peut fonctionner dans certains cas, mais pas dans certains autres..

**Entier**

Un nombre compris entre `0 et 2^16 (32768)`, stocké sur 2 octets en débutant par l'octet de poids forts.

**Chaîne**

Une chaîne de taille variable (longueur limitée à 2^16). Elle est codée comme suit : les deux premiers octets représentent la longueur de la chaîne, les octets suivants constituent la chaîne proprement dite (y compris le '\\0' final). Notez que la longueur encodée dans les deux premiers octets ne prend pas en compte le '\\0' final, de la même manière que `strlen`. Cela peut prêter à confusion du point de vue de Java qui est surchargé de déclarations d'autoincrémentation étranges destinées à traiter ces terminateurs. Je suppose que le but dans lequel cela a été conçu ainsi était de permettre au code C d'être plus efficace lors de la lecture de chaînes en provenance du conteneur de servlets -- avec le caractère \\0 final, le code C peut transmettre des références dans un seul tampon, sans avoir à effectuer de copie. En l'absence du caractère \\0 final, le code C doit effectuer une copie afin de pouvoir tenir compte de sa notion de chaîne.

### Taille du paquet

Selon la majorité du code, la taille maximale du paquet est de `8 * 1024 bytes (8K)`. La taille réelle du paquet est encodée dans l'en-tête.

### En-têtes de paquet

Les paquets envoyés par le serveur vers le conteneur commencent par `0x1234`. Les paquets envoyés par le conteneur vers le serveur commencent par `AB` (c'est à dire le code ASCII de A suivi du code ASCII de B). Ensuite, vient un entier (codé comme ci-dessus) représentant la longueur des données transmises. Bien que ceci puisse faire croire que la taille maximale des données est de 2^16, le code définit en fait ce maximum à 8K.

| *Format du paquet (Serveur-\>Conteneur)* |   |   |   |   |   |
| --- | --- | --- | --- | --- | --- |
| Octet | 0 | 1 | 2 | 3 | 4...(n+3) |
| Contenu | 0x12 | 0x34 | Taille des données (n) |   | Data |

| *Format du paquet (Conteneur-\>Serveur)* |   |   |   |   |   |
| --- | --- | --- | --- | --- | --- |
| Octet | 0 | 1 | 2 | 3 | 4...(n+3) |
| Contenu | A | B | Taille des données (n) |   | Data |

Pour la plupart des paquets, le premier octet de la charge utile encode le type de message, à l'exception des paquets contenant un corps de requête envoyés du serveur vers le conteneur -- ils comportent un en-tête standard (`0x1234` suivi de la taille du paquet), mais celui-ci n'est suivi d'aucun préfixe.

Le serveur web peut envoyer les messages suivants au conteneur de servlets :

|   |   |   |
| --- | --- | --- |
| Code | Type de paquet | Signification |
| 2 | Fait suivre la requête | Débute le cycle de traitement de la requête avec les données qui suivent. |
| 7 | Arrêt | Le serveur web demande au conteneur de s'arrêter. |
| 8 | Ping | Le serveur web demande au conteneur de prendre le contrôle (phase de connexion sécurisée). |
| 10 | CPing | Le serveur web demande au conteneur de répondre rapidement avec un CPong. |
| none | Données | Taille (2 octets) et les données correspondantes. |

À des fins de sécurité, le conteneur n'effectuera réellement son `Arrêt` que si la demande provient de la machine par laquelle il est hébergé.

Le premier paquet `Données` est envoyé immédiatement après le paquet `Faire suivre la requête` par le serveur web.

Le conteneur de servlets peut envoyer les types de messages suivants au serveur web :

|   |   |   |
| --- | --- | --- |
| Code | Type de paquet | Signification |
| 3 | Envoi d'un tronçon de corps | Envoi d'un tronçon de corps depuis le conteneur de servlets vers le serveur web (et probablement vers le navigateur). |
| 4 | Envoie les en-têtes | Envoi des en-têtes de réponse depuis le conteneur de servlets vers le serveur web (et probablement vers le navigateur). |
| 5 | Fin de la réponse | Marque la fin de la réponse (et par conséquent du cycle de traitement de la requête). |
| 6 | Réception du tronçon de corps suivant | Réception de la suite des données de la requête si elles n'ont pas encore été entièrement transmises. |
| 9 | Réponse CPong | La réponse à une requête CPing |

Chacun des messages ci-dessus possède une structure interne différente dont vous trouverez les détails ci-dessous.

## Structure des paquets de requête

Pour les messages de type *Faire suivre la requête* depuis le serveur vers le conteneur :

```
AJP13_FORWARD_REQUEST :=
    prefix_code      (byte) 0x02 = JK_AJP13_FORWARD_REQUEST
    method           (byte)
    protocol         (string)
    req_uri          (string)
    remote_addr      (string)
    remote_host      (string)
    server_name      (string)
    server_port      (integer)
    is_ssl           (boolean)
    num_headers      (integer)
    request_headers *(req_header_name req_header_value)
    attributes      *(attribut_name attribute_value)
    request_terminator (byte) OxFF
```

Les `request_headers` possèdent la structure suivante :

```
req_header_name :=
    sc_req_header_name | (string)  [voir ci-dessous pour la manière dont
    ceci est interprété]

sc_req_header_name := 0xA0xx (integer)

req_header_value := (string)
```

Les `attributes` sont optionnels et possèdent la structure suivante :

```
attribute_name := sc_a_name | (sc_a_req_attribute string)

attribute_value := (string)
```

Un des en-têtes les plus importants est `content-length`, car il indique si le conteneur doit ou non attendre un autre paquet immédiatement.

### Description détaillée de la requête que le serveur fait suivre vers le conteneur



### Préfixe de la requête

Pour toutes les requêtes, ce préfixe est 2. Voir ci-dessus pour les détails des autres codes de préfixes.

### Méthode

La méthode HTTP, encodée sous la forme d'un seul octet :

|   |   |
| --- | --- |
| Nom commande | Code |
| OPTIONS | 1 |
| GET | 2 |
| HEAD | 3 |
| POST | 4 |
| PUT | 5 |
| DELETE | 6 |
| TRACE | 7 |
| PROPFIND | 8 |
| PROPPATCH | 9 |
| MKCOL | 10 |
| COPY | 11 |
| MOVE | 12 |
| LOCK | 13 |
| UNLOCK | 14 |
| ACL | 15 |
| REPORT | 16 |
| VERSION-CONTROL | 17 |
| CHECKIN | 18 |
| CHECKOUT | 19 |
| UNCHECKOUT | 20 |
| SEARCH | 21 |
| MKWORKSPACE | 22 |
| UPDATE | 23 |
| LABEL | 24 |
| MERGE | 25 |
| BASELINE\_CONTROL | 26 |
| MKACTIVITY | 27 |

Les versions futures d'ajp13 pourront transmettre des méthodes supplémentaires, même si elles ne font pas partie de cette liste.

### protocol, req\_uri, remote\_addr, remote\_host, server\_name, server\_port, is\_ssl

Les significations de ces éléments sont triviales. Ils sont tous obligatoires et seront envoyés avec chaque requête.

### En-têtes

La structure de `request_headers` est la suivante : tout d'abord, le nombre d'en-têtes `num_headers` est encodé, suivi d'une liste de paires nom d'en-tête `req_header_name` / valeur `req_header_value`. Les noms d'en-têtes courants sont codés sous forme d'entiers afin de gagner de la place. Si le nom d'en-tête ne fait partie de la liste des en-têtes courants, il est encodé normalement (une chaîne de caractères préfixée par la taille). La liste des en-têtes courants `sc_req_header_name` avec leurs codes se présente comme suit (il sont tous sensibles à la casse) :

|   |   |   |
| --- | --- | --- |
| Nom | Valeur du code | Nom du code |
| accept | 0xA001 | SC\_REQ\_ACCEPT |
| accept-charset | 0xA002 | SC\_REQ\_ACCEPT\_CHARSET |
| accept-encoding | 0xA003 | SC\_REQ\_ACCEPT\_ENCODING |
| accept-language | 0xA004 | SC\_REQ\_ACCEPT\_LANGUAGE |
| authorization | 0xA005 | SC\_REQ\_AUTHORIZATION |
| connection | 0xA006 | SC\_REQ\_CONNECTION |
| content-type | 0xA007 | SC\_REQ\_CONTENT\_TYPE |
| content-length | 0xA008 | SC\_REQ\_CONTENT\_LENGTH |
| cookie | 0xA009 | SC\_REQ\_COOKIE |
| cookie2 | 0xA00A | SC\_REQ\_COOKIE2 |
| host | 0xA00B | SC\_REQ\_HOST |
| pragma | 0xA00C | SC\_REQ\_PRAGMA |
| referer | 0xA00D | SC\_REQ\_REFERER |
| user-agent | 0xA00E | SC\_REQ\_USER\_AGENT |

Le code Java qui lit ceci extrait l'entier représenté par les deux premiers octets, et si le premier octet est `'0xA0'`, il utilise l'entier représenté par le deuxième octet comme index d'un tableau de noms d'en-têtes. Si le premier octet n'est pas `0xA0`, l'entier représenté par les deux octets est considéré comme la longueur d'une chaîne qui est alors lue.

Ceci ne peut fonctionner que si aucun nom d'en-tête ne possède une taille supérieure à `0x9FFF (==0xA000 - 1)`, ce qui est vraisemblable, bien qu'un peu arbitraire.

> [!NOTE]
> **Note:**
>
> L'en-tête `content-length` est extrêmement important. S'il est présent et non nul, le conteneur considère que la requête possède un corps (une requête POST, par exemple), et lit immédiatement le paquet suivant dans le flux d'entrée pour extraire ce corps.

### Attributs

Les attributs préfixés par `?` (par exemple `?context`) sont tous optionnels. Chacun d'eux est représenté par un octet correspondant au type de l'attribut et par sa valeur (chaîne ou entier). Ils peuvent être envoyés dans un ordre quelconque (bien que le code C les envoie dans l'ordre ci-dessous). Un code de terminaison spécial est envoyé pour signaler la fin de la liste des attributs optionnels. La liste des codes est la suivante :

|   |   |   |   |
| --- | --- | --- | --- |
| Information | Valeur code | Type de valeur | Note |
| ?context | 0x01 | - | Non implémenté actuellement |
| ?servlet\_path | 0x02 | - | Non implémenté actuellement |
| ?remote\_user | 0x03 | String |   |
| ?auth\_type | 0x04 | String |   |
| ?query\_string | 0x05 | String |   |
| ?jvm\_route | 0x06 | String |   |
| ?ssl\_cert | 0x07 | String |   |
| ?ssl\_cipher | 0x08 | String |   |
| ?ssl\_session | 0x09 | String |   |
| ?req\_attribute | 0x0A | String | Nom (le nom de l'attribut vient ensuite) |
| ?ssl\_key\_size | 0x0B | Integer |   |
| ?secret | 0x0C | String | Supporté depuis la version 2.4.42 |
| are\_done | 0xFF | - | request\_terminator |

`context` et `servlet_path` ne sont pas définis actuellement par le code C, et la majorité du code Java ignore complètement ce qui est envoyé par l'intermédiaire de ces champs (il va même parfois s'interrompre si une chaîne est envoyée après un de ces codes). Je ne sais pas si c'est une bogue ou une fonctionnalité non implémentée, ou tout simplement du code obsolète, mais en tout cas, il n'est pris en charge par aucune des deux extrémités de la connexion.

`remote_user` et `auth_type` concernent probablement l'authentification au niveau HTTP, et contiennent le nom de l'utilisateur distant ainsi que le type d'authentification utilisée pour établir son identité (à savoir Basic, Digest).

`query_string`, `ssl_cert`, `ssl_cipher`, `ssl_session` et `ssl_key_size` contiennent les éléments HTTP et HTTPS correspondants.

`jvm_route` est utilisé dans le cadre des sessions persistantes, en associant une session utilisateur à une instance Tomcat particulière en présence de plusieurs répartiteurs de charge.

Le `mot de passe` est envoyé lorsque la directive [[13-directives/proxypass|ProxyPass]] ou [[13-directives/balancermember|BalancerMember]] utilise le paramètre `secret=secret_keyword`. Le serveur d'arrière-plan doit savoir utiliser les mots de passe et les valeurs doivent correspondre. `request.secret` ou `requiredSecret` sont documentés dans la configuration AJP d'Apache Tomcat.

Au delà de cette liste de base, tout autre attribut supplémentaire peut être envoyé via le code `req_attribute` `0x0A`. Une paire de chaînes représentant le nom et la valeur de l'attribut est envoyée immédiatement après chaque instance de ce code. Les variables d'environnement sont transmises par cette méthode.

Enfin, lorsque tous les attributs ont été transmis, le terminateur d'attributs, `0xFF`, est envoyé. Ce dernier indique à la fois la fin de la liste d'attributs et la fin du paquet de la requête

## Structure du paquet de la réponse

Pour les messages que le conteneur peut renvoyer au serveur.

```
AJP13_SEND_BODY_CHUNK :=
  prefix_code   3
  chunk_length  (integer)
  chunk        *(byte)
  chunk_terminator (byte) Ox00


AJP13_SEND_HEADERS :=
  prefix_code       4
  http_status_code  (integer)
  http_status_msg   (string)
  num_headers       (integer)
  response_headers *(res_header_name header_value)

res_header_name :=
    sc_res_header_name | (string)   [voir ci-dessous pour la manière
    dont ceci est interprété]

sc_res_header_name := 0xA0 (byte)

header_value := (string)

AJP13_END_RESPONSE :=
  prefix_code       5
  reuse             (boolean)


AJP13_GET_BODY_CHUNK :=
  prefix_code       6
  requested_length  (integer)
```

### Détails:



### Envoi d'un tronçon de corps

Le tronçon se compose essentiellement de données binaires et est renvoyé directement au navigateur.

### Envoi des en-têtes

Les code et message d'état correspondent aux code et message HTTP habituels (par exemple `200` et `OK`). Les noms d'en-têtes de réponses sont codés de la même façon que les noms d'en-têtes de requêtes. Voir ci-dessus le codage des en-têtes pour plus de détails à propos de la manière dont les codes se distinguent des chaînes.
Les codes des en-têtes courants sont ::

|   |   |
| --- | --- |
| Nom | Valeur code |
| Content-Type | 0xA001 |
| Content-Language | 0xA002 |
| Content-Length | 0xA003 |
| Date | 0xA004 |
| Last-Modified | 0xA005 |
| Location | 0xA006 |
| Set-Cookie | 0xA007 |
| Set-Cookie2 | 0xA008 |
| Servlet-Engine | 0xA009 |
| Status | 0xA00A |
| WWW-Authenticate | 0xA00B |

La valeur de l'en-tête est codée immédiatement après le code ou la chaîne du nom d'en-tête.

### Fin de la réponse

Signale la fin de ce cycle de traitement de requête. Si le drapeau `reuse` est à true `(toute valeur autre que 0 en langage C pur)`, cette connexion TCP peut être réutilisée pour traiter de nouvelles requêtes entrantes. Si `reuse` est à false (==0), la connexion sera fermée.

### Réception d'un tronçon de corps

Le conteneur réclame la suite des données de la requête (dans le cas où la taille du corps était trop importante pour pouvoir être contenue dans le premier paquet envoyé, où lorsque la requête est fractionnée). Le serveur va alors envoyer un paquet contenant une quantité de données correspondant au minimum de la `request_length`, la taille maximale de corps envoyée `(8186 (8 Koctets - 6))`, et le nombre réel d'octets restants à envoyer pour ce corps de requête.
S'il ne reste plus de données à transmettre pour ce corps de requête (c'est à dire si le conteneur de servlets tente de lire au delà de la fin du corps), le serveur va renvoyer un paquet *vide* dont la charge utile est de longueur 0 et se présentant sous la forme `(0x12,0x34,0x00,0x00)`.

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
