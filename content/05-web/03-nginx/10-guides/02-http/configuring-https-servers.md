---
title: "Configurer des serveurs HTTPS"
description: "Nginx — Configurer des serveurs HTTPS. Pour configurer un serveur HTTPS, il faut activer le paramètre ssl sur les sockets d'écoute du bloc server et indiquer l'emplacement des fichiers du certificat du serveur et de la clé privée :"
tags: [nginx, guide]
icon: book-open
---

Pour configurer un serveur HTTPS, il faut activer le paramètre `ssl` sur les [[12-directives/listen-http-core|sockets d'écoute]] du bloc [[12-directives/server-http-core|server]] et indiquer l'emplacement des fichiers du [[12-directives/ssl-certificate-http-ssl|certificat du serveur]] et de la [[12-directives/ssl-certificate-key-http-ssl|clé privée]] :

```
server {
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.crt;
    ssl_certificate_key www.example.com.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ...
}
```

Le certificat du serveur est public : il est envoyé à chaque client qui se connecte. La clé privée est secrète et doit être stockée dans un fichier à accès restreint, lisible toutefois par le processus maître de nginx. La clé privée peut aussi être stockée dans le même fichier que le certificat :

```c
ssl_certificate     www.example.com.cert;
ssl_certificate_key www.example.com.cert;
```

les droits d'accès du fichier doivent alors aussi être restreints. Même si le certificat et la clé sont dans un seul fichier, seul le certificat est envoyé au client.

Les directives [[12-directives/ssl-protocols-http-ssl|ssl_protocols]] et [[12-directives/ssl-ciphers-http-ssl|ssl_ciphers]] permettent de n'autoriser que les versions et suites de chiffrement robustes de SSL/TLS. Par défaut, nginx utilise « `ssl_protocols TLSv1.2 TLSv1.3` » et « `ssl_ciphers HIGH:!aNULL:!MD5` » ; il n'est donc généralement pas nécessaire de les configurer. Les valeurs par défaut de ces directives ont changé plusieurs fois.

## Optimisation d'un serveur HTTPS

Les opérations SSL consomment des ressources processeur supplémentaires. Sur les systèmes multiprocesseurs, il faut lancer plusieurs [[12-directives/worker-processes|processus de travail]], au moins autant que de cœurs disponibles. L'opération la plus coûteuse est la négociation SSL. Deux moyens permettent de réduire le nombre de négociations par client : activer les connexions [[12-directives/keepalive-timeout-http-core|persistantes]] pour envoyer plusieurs requêtes sur une même connexion, et réutiliser les paramètres de session SSL pour éviter les négociations des connexions parallèles et suivantes. Les sessions sont stockées dans un cache de sessions SSL partagé entre les processus de travail et configuré par la directive [[12-directives/ssl-session-cache-http-ssl|ssl_session_cache]]. Un mégaoctet de cache contient environ 4000 sessions. La durée de vie par défaut est de 5 minutes ; elle peut être augmentée avec la directive [[12-directives/ssl-session-timeout-http-ssl|ssl_session_timeout]]. Voici un exemple de configuration optimisée pour un système multicœur avec un cache de sessions partagé de 10 mégaoctets :

```
worker_processes auto;

http {
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    server {
        listen              443 ssl;
        server_name         www.example.com;
        keepalive_timeout   70;

        ssl_certificate     www.example.com.crt;
        ssl_certificate_key www.example.com.key;
        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        ...
```

## Chaînes de certificats SSL

Certains navigateurs peuvent signaler un problème avec un certificat signé par une autorité connue, alors que d'autres l'acceptent sans souci. Cela arrive lorsque l'autorité a signé le certificat du serveur avec un certificat intermédiaire absent de la base des autorités de confiance fournie avec le navigateur. L'autorité fournit alors un ensemble de certificats chaînés à concaténer au certificat signé du serveur. Le certificat du serveur doit précéder les certificats chaînés dans le fichier combiné :

```
$ cat www.example.com.crt bundle.crt > www.example.com.chained.crt
```

Le fichier obtenu doit être indiqué dans la directive [[12-directives/ssl-certificate-http-ssl|ssl_certificate]] :

```
server {
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.chained.crt;
    ssl_certificate_key www.example.com.key;
    ...
}
```

Si le certificat du serveur et la chaîne ont été concaténés dans le mauvais ordre, nginx ne démarre pas et affiche le message d'erreur :

```
SSL_CTX_use_PrivateKey_file(" ... /www.example.com.key") failed
   (SSL: error:05800074:x509 certificate routines::key values mismatch)
```

car nginx a tenté d'utiliser la clé privée avec le premier certificat de la chaîne au lieu du certificat du serveur.

Les navigateurs conservent généralement les certificats intermédiaires reçus et signés par des autorités de confiance : un navigateur très utilisé peut donc déjà posséder les certificats intermédiaires nécessaires et ne pas signaler de problème avec un certificat envoyé sans sa chaîne. Pour vérifier que le serveur envoie bien la chaîne complète, on peut utiliser l'outil en ligne de commande `openssl`, par exemple :

```
$ openssl s_client -connect www.godaddy.com:443
...
Certificate chain
 0 s:/C=US/ST=Arizona/L=Scottsdale/1.3.6.1.4.1.311.60.2.1.3=US
     /1.3.6.1.4.1.311.60.2.1.2=AZ/O=GoDaddy.com, Inc
     /OU=MIS Department/CN=www.GoDaddy.com
     /serialNumber=0796928-7/2.5.4.15=V1.0, Clause 5.(b)
   i:/C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc.
     /OU=http://certificates.godaddy.com/repository
     /CN=Go Daddy Secure Certification Authority
     /serialNumber=07969287
 1 s:/C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc.
     /OU=http://certificates.godaddy.com/repository
     /CN=Go Daddy Secure Certification Authority
     /serialNumber=07969287
   i:/C=US/O=The Go Daddy Group, Inc.
     /OU=Go Daddy Class 2 Certification Authority
 2 s:/C=US/O=The Go Daddy Group, Inc.
     /OU=Go Daddy Class 2 Certification Authority
   i:/L=ValiCert Validation Network/O=ValiCert, Inc.
     /OU=ValiCert Class 2 Policy Validation Authority
     /CN=http://www.valicert.com//emailAddress=info@valicert.com
...
```

Dans cet exemple, le sujet (« *s* ») du certificat #0 du serveur `www.GoDaddy.com` est signé par un émetteur (« *i* ») qui est lui-même le sujet du certificat #1, signé par un émetteur qui est le sujet du certificat #2, signé par l'émetteur connu *ValiCert, Inc.*, dont le certificat figure dans la base intégrée des navigateurs.

Si la chaîne de certificats n'a pas été ajoutée, seul le certificat #0 du serveur apparaît.

## Un seul serveur HTTP/HTTPS

On peut configurer un seul serveur qui traite à la fois les requêtes HTTP et HTTPS :

```
server {
    listen              80;
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.crt;
    ssl_certificate_key www.example.com.key;
    ...
}
```

> [!NOTE]
> Avant la version 0.7.14, SSL ne pouvait pas être activé séparément sur chaque socket d'écoute comme ci-dessus : il ne pouvait l'être que pour tout le serveur avec la directive [[12-directives/ssl-http-ssl|ssl]], ce qui empêchait de créer un seul serveur HTTP/HTTPS. Le paramètre `ssl` de la directive [[12-directives/listen-http-core|listen]] a été ajouté pour résoudre ce problème. L'utilisation de la directive [[12-directives/ssl-http-ssl|ssl]] est donc déconseillée dans les versions récentes ; elle a été supprimée en version 1.25.1.

## Serveurs HTTPS par nom

Un problème fréquent survient lorsqu'on configure plusieurs serveurs HTTPS écoutant sur une même adresse IP :

```
server {
    listen          443 ssl;
    server_name     www.example.com;
    ssl_certificate www.example.com.crt;
    ...
}

server {
    listen          443 ssl;
    server_name     www.example.org;
    ssl_certificate www.example.org.crt;
    ...
}
```

Avec cette configuration, le navigateur reçoit le certificat du serveur par défaut, c'est-à-dire `www.example.com`, quel que soit le nom de serveur demandé. Cela tient au fonctionnement du protocole SSL : la connexion SSL est établie avant que le navigateur n'envoie la requête HTTP, et nginx ne connaît pas encore le nom du serveur demandé. Il ne peut donc proposer que le certificat du serveur par défaut.

La méthode la plus ancienne et la plus robuste consiste à attribuer une adresse IP distincte à chaque serveur HTTPS :

```
server {
    listen          192.168.1.1:443 ssl;
    server_name     www.example.com;
    ssl_certificate www.example.com.crt;
    ...
}

server {
    listen          192.168.1.2:443 ssl;
    server_name     www.example.org;
    ssl_certificate www.example.org.crt;
    ...
}
```

### Un certificat SSL à plusieurs noms

D'autres méthodes permettent de partager une même adresse IP entre plusieurs serveurs HTTPS, mais elles ont toutes des inconvénients. L'une consiste à utiliser un certificat contenant plusieurs noms dans son champ SubjectAltName, par exemple `www.example.com` et `www.example.org`. La longueur du champ SubjectAltName est toutefois limitée.

Une autre consiste à utiliser un certificat générique, par exemple `*.example.org`. Un certificat générique protège tous les sous-domaines du domaine indiqué, mais sur un seul niveau : il correspond à `www.example.org`, mais pas à `example.org` ni à `www.sub.example.org`. Ces deux méthodes peuvent être combinées : un certificat peut contenir des noms exacts et génériques dans son champ SubjectAltName, par exemple `example.org` et `*.example.org`.

Il vaut mieux placer le fichier d'un certificat à plusieurs noms et celui de sa clé privée au niveau *http* de la configuration, pour que tous les serveurs en héritent avec une seule copie en mémoire :

```
ssl_certificate     common.crt;
ssl_certificate_key common.key;

server {
    listen          443 ssl;
    server_name     www.example.com;
    ...
}

server {
    listen          443 ssl;
    server_name     www.example.org;
    ...
}
```

### Indication du nom de serveur (SNI)

Une solution plus générale pour faire fonctionner plusieurs serveurs HTTPS sur une même adresse IP est l'[extension TLS Server Name Indication](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066) : elle permet au navigateur de transmettre le nom du serveur demandé pendant la négociation SSL, et le serveur sait alors quel certificat utiliser. SNI est actuellement [pris en charge](http://en.wikipedia.org/wiki/Server_Name_Indication#Support) par la plupart des navigateurs modernes et son implémentation est obligatoire en TLSv1.3, mais certains clients anciens ou particuliers peuvent ne pas l'utiliser.

> [!NOTE]
> Seuls des noms de domaine peuvent être transmis par SNI, mais certains navigateurs peuvent transmettre par erreur l'adresse IP du serveur comme nom si la requête contient une adresse IP littérale. Il ne faut pas compter dessus.

Pour utiliser SNI dans nginx, il doit être pris en charge à la fois par la bibliothèque OpenSSL avec laquelle l'exécutable nginx a été compilé et par celle à laquelle il est lié dynamiquement à l'exécution. OpenSSL prend en charge SNI depuis la version 0.9.8f s'il a été compilé avec l'option « --enable-tlsext » ; depuis OpenSSL 0.9.8j, cette option est activée par défaut. Si nginx a été compilé avec la prise en charge de SNI, il l'indique lorsqu'on le lance avec l'option « -V » :

```
$ nginx -V
...
TLS SNI support enabled
...
```

En revanche, si nginx compilé avec SNI est lié dynamiquement à une bibliothèque OpenSSL sans prise en charge de SNI, il affiche l'avertissement :

```
nginx was built with SNI support, however, now it is linked
dynamically to an OpenSSL library which has no tlsext support,
therefore SNI is not available
```

### Certificats SSL des clients

La [[12-directives/ssl-verify-client-http-ssl|vérification des certificats SSL des clients]] doit être configurée avec soin dans les serveurs HTTPS par nom. Si un client ne demande pas de nom de serveur via SNI, toute la configuration SSL du serveur par défaut sert à établir la connexion. La configuration de serveur qui traite la requête HTTP peut alors changer ensuite ; voir [[10-guides/02-http/server-names|Choix du serveur virtuel]]. Un client disposant d'un certificat reconnu par le serveur par défaut peut ainsi demander des ressources à d'autres serveurs écoutant sur la même adresse, y compris des serveurs qui vérifient les certificats clients auprès d'une autre autorité.

Si ce n'est pas souhaité, les connexions sans SNI doivent être limitées avec [[12-directives/ssl-reject-handshake-http-ssl|ssl_reject_handshake]] dans le serveur par défaut. Cela impose la vérification contre une [réutilisation de connexion](https://datatracker.ietf.org/doc/html/rfc9113#name-connection-reuse) inappropriée :

```
server {
    listen               443 ssl default_server;
    ssl_reject_handshake on;
    return               421;
}
```

## Compatibilité

- L'état de la prise en charge de SNI est affiché par l'option « -V » depuis les versions 0.8.21 et 0.7.62.
- Le paramètre `ssl` de la directive [[12-directives/listen-http-core|listen]] est pris en charge depuis la version 0.7.14. Avant la version 0.8.21, il ne pouvait être indiqué qu'avec le paramètre `default`.
- SNI est pris en charge depuis la version 0.5.23.
- Le cache de sessions SSL partagé est pris en charge depuis la version 0.5.6.

- Version 1.27.3 et suivantes : les protocoles SSL par défaut sont TLSv1.2 et TLSv1.3 (si la bibliothèque OpenSSL les prend en charge). Avec OpenSSL 1.0.0 ou plus ancien, ce sont TLSv1 et TLSv1.1.
- Version 1.23.4 et suivantes : les protocoles SSL par défaut sont TLSv1, TLSv1.1, TLSv1.2 et TLSv1.3 (si la bibliothèque OpenSSL les prend en charge).
- Version 1.9.1 et suivantes : les protocoles SSL par défaut sont TLSv1, TLSv1.1 et TLSv1.2 (si la bibliothèque OpenSSL les prend en charge).
- Versions 0.7.65, 0.8.19 et suivantes : les protocoles SSL par défaut sont SSLv3, TLSv1, TLSv1.1 et TLSv1.2 (si la bibliothèque OpenSSL les prend en charge).
- Versions 0.7.64, 0.8.18 et antérieures : les protocoles SSL par défaut sont SSLv2, SSLv3 et TLSv1.

- Version 1.0.5 et suivantes : les suites de chiffrement SSL par défaut sont « `HIGH:!aNULL:!MD5` ».
- Versions 0.7.65, 0.8.20 et suivantes : les suites de chiffrement SSL par défaut sont « `HIGH:!ADH:!MD5` ».
- Version 0.8.19 : les suites de chiffrement SSL par défaut sont « `ALL:!ADH:RC4+RSA:+HIGH:+MEDIUM` ».
- Versions 0.7.64, 0.8.18 et antérieures : les suites de chiffrement SSL par défaut sont
  « `ALL:!ADH:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
