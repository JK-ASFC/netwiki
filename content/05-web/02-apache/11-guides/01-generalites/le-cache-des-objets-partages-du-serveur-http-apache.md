---
title: "Le cache des objets partagés du serveur HTTP Apache"
description: "Apache HTTP Server — Le cache des objets partagés du serveur HTTP Apache. Le cache des objets partagés est un concept de partage de données de base entre tous les processus d'un serveur, sans se préoccuper du modèle de threads et de processus. On l'utilise lorsque les avantages apportés par le partage de données"
tags: [apache, guide]
icon: book-open
---

Le cache des objets partagés est un concept de partage de données de base entre tous les processus d'un serveur, sans se préoccuper du [[11-guides/01-generalites/modules-multi-processus-mpms|modèle de threads et de processus]]. On l'utilise lorsque les avantages apportés par le partage de données entre processus contrebalance la perte de performances consécutive à la communication interprocessus.

## Fournisseurs du cache d'objets partagés

Le cache d'objets partagés en tant que tel est une abstraction. Il est implémenté par cinq modules différents. Pour pouvoir utiliser le cache, un ou plusieurs de ces modules doivent être présents et configurés.

Le seul élément de configuration consiste à définir le fournisseur de cache à utiliser. Ceci est de la responsabilité des modules qui utilisent le cache, et pour cela, ils activent la sélection via des directives telles que [[13-directives/cachesocache|CacheSocache]], [[13-directives/authncachesocache|AuthnCacheSOCache]], [[13-directives/sslsessioncache|SSLSessionCache]], et [[13-directives/sslstaplingcache|SSLStaplingCache]].

Les fournisseurs actuellement disponibles sont :

**"dbm" ([[12-modules/mod_socache_dbm|mod_socache_dbm]])**

Celui-ci utilise un fichier de hashage DBM. Le choix de la DBM sous-jacente peut être configurable si la version d'APR installée supporte de multiples implémentations de DBM.

**"dc" ([[12-modules/mod_socache_dc|mod_socache_dc]])**

Celui-ci utilise les bibliothèques de mise en cache de sessions distribuées [distcache](http://distcache.sourceforge.net/).

**"memcache" ([[12-modules/mod_socache_memcache|mod_socache_memcache]])**

Celui-ci utilise le système à hautes performances de mise en cache d'objets de mémoire distribuée [memcached](http://memcached.org/).

**"redis" ([[12-modules/mod_socache_redis|mod_socache_redis]])**

Celui-ci utilise le système de mise en cache d'objets de mémoire distribuée à hautes performances [Redis](http://redis.io/).

**"shmcb" ([[12-modules/mod_socache_shmcb|mod_socache_shmcb]])**

Celui-ci utilise un tampon cyclique à hautes performances au sein d'un segment de mémoire partagée.

L'API fournit les fonctions suivantes :

**const char \*create(ap\_socache\_instance\_t \*\*instance, const char \*arg, apr\_pool\_t \*tmp, apr\_pool\_t \*p);**

Cette fonction permet de créer un cache de session basé sur la chaîne de configuration spécifiée. Le pointeur d'instance renvoyé dans le paramètre instance sera passé comme premier argument des invocations subséquentes.

**apr\_status\_t init(ap\_socache\_instance\_t \*instance, const char \*cname, const struct ap\_socache\_hints \*hints, server\_rec \*s, apr\_pool\_t \*pool)**

Cette fonction permet d'initialiser le cache. L'argument cname doit avoir une longueur maximale de 16 caractères et permet d'identifier de manière unique l'utilisateur du cache au sein du serveur ; il est recommandé d'utiliser le nom du module, par exemple "mod\_ssl-sess". Comme cette chaîne peut être utilisée au sein d'un système de fichiers, il est conseillé de n'utiliser que des caractères alphanumériques \[a-z0-9\_-\]. Si l'argument hints n'est pas égal à NULL, il fournit un ensemble d'indications au fournisseur. La valeur retournée est le code d'erreur APR.

**void destroy(ap\_socache\_instance\_t \*instance, server\_rec \*s)**

Cette fonction permet de détruire l'instance de cache spécifiée.

**apr\_status\_t store(ap\_socache\_instance\_t \*instance, server\_rec \*s, const unsigned char \*id, unsigned int idlen, apr\_time\_t expiry, unsigned char \*data, unsigned int datalen, apr\_pool\_t \*pool)**

Cette fonction permet de stocker un objet dans une instance de cache.

**apr\_status\_t retrieve(ap\_socache\_instance\_t \*instance, server\_rec \*s, const unsigned char \*id, unsigned int idlen, unsigned char \*data, unsigned int \*datalen, apr\_pool\_t \*pool)**

Cette fonction permet d'extraire un objet du cache.

**apr\_status\_t remove(ap\_socache\_instance\_t \*instance, server\_rec \*s, const unsigned char \*id, unsigned int idlen, apr\_pool\_t \*pool)**

Supprime un objet du cache.

**void status(ap\_socache\_instance\_t \*instance, request\_rec \*r, int flags)**

Renvoie le statut d'une instance de cache à destination de mod\_status.

**apr\_status\_t iterate(ap\_socache\_instance\_t \*instance, server\_rec \*s, void \*userctx, ap\_socache\_iterator\_t \*iterator, apr\_pool\_t \*pool)**

Envoie tous les objets gardés en cache à une fonction pour traitement itératif.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
