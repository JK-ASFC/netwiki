---
title: "Vue d'ensemble des nouvelles fonctionnalités de la version 2.0 du serveur HTTP Apache"
description: "Apache HTTP Server — Vue d'ensemble des nouvelles fonctionnalités de la version 2.0 du serveur HTTP Apache. Ce document décrit les changements majeurs apportés entre les versions 1.3 et 2.0 du serveur HTTP Apache."
tags: [apache, guide]
icon: book-open
---

Ce document décrit les changements majeurs apportés entre les versions 1.3 et 2.0 du serveur HTTP Apache.

## Améliorations du Système de Base

**Threading Unix**

Sur les systèmes Unix qui supportent les threads POSIX, Apache httpd peut à présent tourner en mode hybride multi-processus et multi-threadé, ce qui augmente l'extensibilité et la performance du serveur pour la plupart des configurations.

**Nouveau Système de Compilation**

Le processus de compilation a été refait de A à Z; il utilise à présent `autoconf` et `libtool`, ce qui rend la compilation d'Apache httpd plus familière aux utilisateurs d'autre logiciels de mème type.

**Support Multiprotocole**

Le serveur HTTP Apache dispose désormais de l'infrastructure nécessaire pour supporter d'autres protocoles. Le module [[12-modules/mod_echo|mod_echo]] illustre ces possibilités.

**Support amélioré des Plate-formes non-Unix**

Le serveur HTTP Apache 2.0 se montre plus rapide et plus stable sur les plate-formes non Unix, telles BeOS, OS/2, NetWare et Windows. L'apparition des [[11-guides/01-generalites/modules-multi-processus-mpms|Modules Multi-Processus]] (MPMs), ainsi que de la bibliothèque "Apache Portable Runtime" (APR) permet à Apache de tirer parti des API natives de ces plate-formes, sans s'appuyer sur leurs couches POSIX souvent boguées et peu optimisées.

**Nouvelle API d'Apache httpd**

L'Interface de Programmation (API) des modules a beaucoup changé avec le passage à la version 2.0. Les problèmes d'ordre et de priorité des modules, rencontrés avec la version 1.3, devraient maintenant être résolus. Apache 2.0 gère ces problèmes de façon automatique. L'ordre des modules est géré au moyen de "crochets" (hooks), ce qui rend la gestion flexible. De nouveaux appels ont été également créés afin de permettre l'implémentation d'autres fonctions dans les modules, sans devoir corriger le noyau du serveur HTTP Apache.

**Support IPv6**

Sur les systèmes où la bibliothèque Apache Portable Runtime supporte IPv6, Apache peut par défaut écouter sur des interfaces de connexions IPv6. Les directives [[13-directives/listen|Listen]], [[13-directives/namevirtualhost|NameVirtualHost]] et [[13-directives/virtualhost|<VirtualHost>]] supportent également les adresses IPv6 (comme par exemple, dans "`Listen[2001:db8::1]:8080`").

**Filtering**

Il est maintenant possible d'écrire des modules pour Apache httpd pour filtrer les flux de données entrant ou sortant du serveur. A titre d'exemple, il est possible de filtrer des directives Server Side Include de la sortie standard d'un script CGI, au moyen du filtre `INCLUDES` fourni par le module [[12-modules/mod_include|mod_include]]. Le module [[12-modules/mod_ext_filter|mod_ext_filter]] permet quant à lui l'utilisation comme filtres de programmes externes à Apache, de la même manière qu'on peut utiliser des programmes CGI comme Handlers.

**Réponses d'Erreurs Multilangues**

Les messages d'erreur envoyés au navigateur existent à présent en plusieurs langues avec des documents SSI. Ces messages peuvent être personnalisés par l'administrateur afin de s'intégrer avec le site web.

**Simplification de la Configuration**

Beaucoup de directives, auparavant peu claires, ont été simplifiées. Les directives `Port` et `BindAddress`, souvent sources d'incompréhension, ont disparus. Désormais seule la directive [[13-directives/listen|Listen]] sert de liaison pour les adresses IP; la directive [[13-directives/servername|ServerName]] ne précise le nom du serveur et son port que pour les redirections et la gestion des hôtes virtuels.

**Support natif de l'Unicode sous Windows NT**

Apache httpd 2.0 sur Windows NT utilise à présent l'utf-8 pour tous les noms de fichiers. Ces noms de fichiers sont directement traduits vers l'encodage Unicode du système de fichiers, ce qui permet le support multilangue pour toutes les installations sur la famille NT de Windows, y compris Windows 2000 et Windows XP.*Ce support n'est pas fonctionnel pour Windows 95, 98 ni ME, qui utilisent les pages de code locales pour les accès au système de fichiers, comme auparavant.*

**Mise à jour de la Bibliothèque d'Expressions Rationnelles**

Apache httpd 2.0 contient la [bibliothèque d'expressions rationnelles compatible Perl](http://www.pcre.org/)(Perl Compatible Regular Expression Library - PCRE). Toutes les expressions rationnelles sont dont gérées avec la syntaxe de Perl 5, plus puissante.

## Amélioration des Modules

**[[12-modules/mod_ssl|mod_ssl]]**

Apparu dans Apache httpd 2.0, ce module est une interface aux protocoles de chiffrement SSL/TLS fournis par OpenSSL.

**[[12-modules/mod_dav|mod_dav]]**

Apparu dans Apache httpd 2.0, ce module implémente les spécifications HTTP de gestion distribuée de versions et de rédaction (Distributed Authoring and Versioning - DAV), destinées à la mise en ligne et à la maintenance des contenus Web.

**[[12-modules/mod_deflate|mod_deflate]]**

Module apparu dans Apache httpd 2.0, mod\_deflate permet aux navigateurs qui le supportent de demander la compression des contenus envoyés par le serveur. Cela a l'avantage de réduite l'occupation de la bande passante.

**`mod_auth_ldap`**

Apparu dans Apache httpd 2.0.41, ce module permet aux administrateurs d'utiliser un arbre LDAP pour gérer la base d'utilisateurs pour les Authentifications Basiques HTTP. Un module voisin, [[12-modules/mod_ldap|mod_ldap]], permet de globaliser les connexions à l'arbre LDAP et de garder en mémoire cache ces accès.

**[[12-modules/mod_auth_digest|mod_auth_digest]]**

Améliore les fonctions de cache sur une session entre les différents processus, en utilisant de la mémoire partagée.

**[[12-modules/mod_charset_lite|mod_charset_lite]]**

Apparu dans Apache httpd 2.0, ce module expérimental permet la conversion et l'enregistrement entre jeux de caractères.

**[[12-modules/mod_file_cache|mod_file_cache]]**

Apparu dans Apache httpd 2.0, ce module implémente les fonctionnalités du module `mod_mmap_static` présent du serveur HTTP Apache 1.3, et offre des fonctions plus avancées pour la gestion du cache.

**[[12-modules/mod_headers|mod_headers]]**

Ce module gagne beaucoup de flexibilité avec Apache httpd 2.0 : on peut désormais l'utiliser pour modifier les en-têtes des requêtes utilisés par [[12-modules/mod_proxy|mod_proxy]], et pour positionner les en-têtes des réponses de manière conditionnelle.

**[[12-modules/mod_proxy|mod_proxy]]**

Le module proxy a été réécrit de A à Z. Il tire maintenant avantage de la nouvelle infrastructure de filtrage, et implémente un mandataire plus fiable, et conforme aux normes HTTP/1.1. De nouvelles sections de configuration ajoutées à [[13-directives/proxy|<Proxy>]] donnent un contrôle plus lisible et un traitement plus rapide des requêtes mandatées ; les configurations surchargées `<Directory "proxy:...">` ne sont pas supportées. Le module a aussi été fragmenté en plusieurs modules qui gèrent chacun leur protocole : `proxy_connect`, `proxy_ftp` et `proxy_http`.

**[[12-modules/mod_negotiation|mod_negotiation]]**

Une nouvelle directive, [[13-directives/forcelanguagepriority|ForceLanguagePriority]] a été ajoutée, elle permet de garantir que le client reçoit un seul document dans tous les cas, au lieu de réponses NOT ACCEPTABLE ou MULTIPLE CHOICES. Les algorithmes gérant la négociation et les vues multiples (MultiViews) ont été nettoyés et donnent des réponses plus logiques. Un nouveau format de carte de types (map type) qui peut gérer le contenu de documents a aussi été ajouté.

**[[12-modules/mod_autoindex|mod_autoindex]]**

Les listes auto-générées par Autoindex sont à présent configurables, et peuvent utiliser des tables HTML pour une mise en forme plus propre. L'ordre d'affichage des fichiers est également finement paramètrable, comme pour le tri par version, et le filtrage par caractères jokers du listage du répertoire.

**[[12-modules/mod_include|mod_include]]**

De nouvelles directives permettent de modifier la valeur par défaut des drapeaux *start* et *end* des éléments SSI. Ces directives permettent à la configuration d'affichage de dates et heures d'être effectuée dans le fichier de configuration principal, plutôt que dans le document SSI. Les réponses données par des recherches par expressions rationnelles (qui gèrent à présent les regex Perl) sont recupérées au moyen des variables `$0` à `$9`.

**`mod_auth_dbm`**

Plusieurs bases de données DBM sont supportées, et sélectionnables via la directive `AuthDBMType`.

## Voir aussi

- [[11-guides/01-generalites/mise-a-jour-de-la-version-2-2-vers-la-version-2-4|Migrer à 2.0 depuis la version 1.3]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
