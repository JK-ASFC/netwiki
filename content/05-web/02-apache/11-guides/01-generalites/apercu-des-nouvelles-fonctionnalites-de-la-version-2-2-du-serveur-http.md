---
title: "Aperçu des nouvelles fonctionnalités de la version 2.2 du serveur HTTP Apache"
description: "Apache HTTP Server — Aperçu des nouvelles fonctionnalités de la version 2.2 du serveur HTTP Apache. Ce document décrit quelques uns des changements principaux entre les versions 2.0 et 2.2 du serveur HTTP Apache. Pour les nouvelles fonctionnalités ajoutées depuis la version 1.3, se référer au document 2.0 new features."
tags: [apache, guide]
icon: book-open
---

Ce document décrit quelques uns des changements principaux entre les versions 2.0 et 2.2 du serveur HTTP Apache. Pour les nouvelles fonctionnalités ajoutées depuis la version 1.3, se référer au document [[11-guides/01-generalites/vue-d-ensemble-des-nouvelles-fonctionnalites-de-la-version-2-0-du-serv|2.0 new features]].

## Améliorations du système de base

**Authn/Authz**

Les modules d'authentification et d'autorisation intégrés ont été refondus. Le nouveau module mod\_authn\_alias (supprimé dans la version 2.3/2.4) permet de simplifier considérablement certaines configurations d'authentification. Voir modification des noms de modules, et les changements pour le développeur pour plus d'informations sur les conséquences de ces changements pour les utilisateurs et les développeurs de modules.

**Mise en cache**

[[12-modules/mod_cache|mod_cache]], [[12-modules/mod_cache_disk|mod_cache_disk]], et mod\_mem\_cache (supprimés dans la version 2.3/2.4) ont subi de nombreuses modifications, et l'on considère qu'ils ont maintenant atteint un degré de qualité suffisant pour leur mise en production. Le programme [[10-commandes/htcacheclean|htcacheclean]] a été ajouté afin de rendre plus propre la configuration du module [[12-modules/mod_cache_disk|mod_cache_disk]].

**Configuration**

L'agencement de la configuration par défaut a été simplifié et modularisé. Les portions de configuration qui peuvent être utilisées pour activer des fonctionnalités courantes sont maintenant intégrées à Apache, et peuvent être facilement ajoutées à la configuration principale du serveur.

**Arrêt en douceur**

Les modules MPM [[12-modules/prefork|prefork]], [[12-modules/worker|worker]] et [[12-modules/event|event]] permettent maintenant l'arrêt en douceur de [[10-commandes/httpd|httpd]] au moyen du signal [[11-guides/01-generalites/arret-et-redemarrage-du-serveur-http-apache|graceful-stop]]. La directive [[13-directives/gracefulshutdowntimeout|GracefulShutdownTimeout]] a été ajoutée dans le but de spécifier un délai optionnel, après lequel [[10-commandes/httpd|httpd]] s'arrêtera quel que soit le statut des requêtes en cours.

**Mise en oeuvre du proxy**

Le nouveau module [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] fournit des services de répartition de charge (load balancing) pour le module [[12-modules/mod_proxy|mod_proxy]]. Le nouveau module [[12-modules/mod_proxy_ajp|mod_proxy_ajp]] ajoute le support pour le `Protocole JServ de Apache version 1.3` qu'utilise [Apache Tomcat](http://tomcat.apache.org/).

**Mise à jour de la bibliothèque des expressions rationnelles**

La version 5.0 de la [Perl Compatible Regular Expression Library](http://www.pcre.org/) (PCRE) est maintenant disponible. [[10-commandes/httpd|httpd]] peut être configuré pour utiliser une PCRE choisie en passant l'option `--with-pcre` au script configure.

**Filtrage intelligent**

Le module [[12-modules/mod_filter|mod_filter]] permet la configuration dynamique de la chaîne de filtrage en sortie. Il permet d'insérer des filtres conditionnels basés sur toute requête, en-tête de réponse ou variable d'environnement, et fait table rase des problèmes de dépendances et d'ordonnancement rencontrés avec l'architecture 2.0.

**Support des gros fichiers**

[[10-commandes/httpd|httpd]] supporte maintenant les fichiers d'une taille supérieure à 2GB sur les systèmes 32 bits UNIX modernes. Le support des corps de requête d'une taille supérieure à 2GB a aussi été ajouté.

**Module MPM Event**

Le module MPM [[12-modules/event|event]] utilise un thread séparé pour gérer les requêtes "Keep alive" et accepter des connexions. Les requêtes "Keep alive" requéraient traditionnellement un processus httpd dédié pour leur gestion. Ce processus dédié ne pouvait plus être réutilisé jusqu'à ce que le délai "Keep Alive" soit écoulé.

**Support des bases de données SQL**

Le module [[12-modules/mod_dbd|mod_dbd]], associé à l'environnement `apr_dbd`, fournit le support SQL direct aux modules qui en ont besoin. Supporte la mise en commun des connexions dans les modules MPM threadés.

## Améliorations des modules

**Authn/Authz**

Les modules du répertoire aaa ont été renommés et fournissent un support amélioré pour la méthode d'authentification **digest**. Par exemple, `mod_auth` est maintenant scindé en deux modules : [[12-modules/mod_auth_basic|mod_auth_basic]] et [[12-modules/mod_authn_file|mod_authn_file]]; `mod_auth_dbm` s'appelle maintenant [[12-modules/mod_authn_dbm|mod_authn_dbm]]; `mod_access` a été renommé en [[12-modules/mod_authz_host|mod_authz_host]]. Est également apparu le nouveau module mod\_authn\_alias (supprimé dans la version 2.3/2.4) qui simplifie certaines configurations d'authentification.

**[[12-modules/mod_authnz_ldap|mod_authnz_ldap]]**

Ce module est un portage de la version 2.0 du module `mod_auth_ldap` vers la version 2.2 du framework `Authn/Authz`. Les nouvelles fonctionnalités comprennent l'utilisation des valeurs d'attributs LDAP et des filtres de recherche avancés dans la directive [[13-directives/require|Require]].

**[[12-modules/mod_authz_owner|mod_authz_owner]]**

Un nouveau module qui autorise l'accès à un fichier en fonction de son propriétaire dans le système de fichiers

**[[12-modules/mod_version|mod_version]]**

Un nouveau module qui permet d'activer des blocs de configuration en fonction de la version du serveur en cours d'exécution.

**[[12-modules/mod_info|mod_info]]**

Un nouvel argument `?config` a été ajouté, qui permettra d'afficher les directives de configuration telles qu'elles sont interprétées par Apache, y compris le nom de fichier et le numéro de ligne. Le module montre aussi l'ordre des points d'entrée de traitement d'une requête (request hooks) ainsi que des informations de construction supplémentaires, d'une manière similaire à `httpd -V`.

**[[12-modules/mod_ssl|mod_ssl]]**

Le support de la [RFC 2817](https://www.rfc-editor.org/rfc/rfc2817) a été ajouté, ce qui permet de passer d'une connexion en clair au chiffrement TLS.

**[[12-modules/mod_imagemap|mod_imagemap]]**

`mod_imap` a été renommé en [[12-modules/mod_imagemap|mod_imagemap]] afin d'éviter une confusion pour les utilisateurs.

## Améliorations des programmes

**[[10-commandes/httpd|httpd]]**

Une nouvelle option de ligne de commande `-M` a été ajoutée, qui fournit la liste de tous les modules chargés en fonction de la configuration réelle. À la différence de l'option `-l`, cette liste inclut les Objets Dynamiques Partagés (DSOs) chargés par l'intermédiaire du module [[12-modules/mod_so|mod_so]].

**[[10-commandes/httxt2dbm|httxt2dbm]]**

Un nouveau programme servant à générer des fichiers dbm à partir d'une source au format texte, à utiliser avec la directive [[13-directives/rewritemap|RewriteMap]] et le type de mise en correspondance `dbm`.

## Changements pour le développeur de module

**APR 1.0 API**

Apache 2.2 utilise l'API APR 1.0. Toutes les fonctions et symboles obsolètes ont été supprimés du code de `APR` et `APR-Util`. Pour plus de détails, consultez le [site web d'APR](http://apr.apache.org/).

**Authn/Authz**

Les modules d'authentification et d'autorisation intégrés ont été renommés de la manière suivante:

- `mod_auth_*` -\> Modules qui implémentent un mécanisme d'authentification HTTP
- `mod_authn_*` -\> Modules qui fournissent un dispositif d'authentification en arrière-plan
- `mod_authz_*` -\> Modules qui implémentent l'autorisation (ou l'accès)
- `mod_authnz_*` -\> Modules qui implémentent à la fois l'authentification & l'autorisation

L'organisation des méthodes d'authentification a également été revue, ce qui va simplifier grandement l'ajout de nouvelles méthodes d'authentification.

**Journalisation des erreurs de connexion**

Une nouvelle fonction a été ajoutée, `ap_log_cerror`, afin de pouvoir enregistrer les erreurs qui surviennent au cours de la connexion du client. Une fois enregistré, le message inclut l'adresse IP du client.

**Ajout d'une portion de code pour la vérification de la configuration**

Un nouvel élément de traitement a été ajouté, `test_config`, afin d'aider les modules qui ne veulent exécuter un code spécial que si l'utilisateur passe le paramètre `-t` à [[10-commandes/httpd|httpd]].

**Définition de la taille de la pile pour les modules MPM en processus légers**

Une nouvelle directive a été ajoutée, [[13-directives/threadstacksize|ThreadStackSize]] afin de définir la taille de la pile pour tous les modules MPM en processus légers (modules threadés). Ceci s'avère nécessaire pour certains modules tiers sur des plateformes dont la taille de la pile des threads par défaut est trop petite.

**Gestion de protocole pour les filtres en sortie**

Par le passé, chaque filtre devait s'assurer que les en-têtes de réponse corrects étaient générés dans la mesure où il les affectait. Les filtres peuvent maintenant déléguer la gestion courante du protocole au module [[12-modules/mod_filter|mod_filter]], à l'aide des appels `ap_register_output_filter_protocol` ou `ap_filter_protocol`.

**Ajout d'un élément de traitement pour le processus père (monitor hook)**

Ce nouvel élément de traitement permet aux modules de lancer des jobs réguliers/planifiés au niveau du processus père (root).

**Modifications de l'API de traitement des expressions rationnelles**

Le fichier d'en-tête `pcreposix.h` n'est plus disponible ; il a été remplacé par le nouveau fichier d'en-tête `ap_regex.h`. L'implémentation POSIX.2 `regex.h` exposée dans l'ancien fichier d'en-tête est maintenant disponible dans l'espace de nommage `ap_` depuis `ap_regex.h`. Les appels à `regcomp`, `regexec`, etc... peuvent être remplacés par des appels à `ap_regcomp`, `ap_regexec`.

**Cadre d'application DBD (API pour base de données SQL)**

Avec Apache 1.x et 2.0, les modules nécessitant un processus SQL d'arrière-plan devaient s'en charger eux-mêmes. En dehors du fait de réinventer la roue, ceci peut s'avérer très inefficace, par exemple lorsque plusieurs modules maintiennent chacun leurs propres connexions.

Apache 2.1 et supérieur fournissent l'API `ap_dbd` qui permet la gestion des connexions à la base de données (y compris les stratégies optimisées pour les modules MPM threadés et non threadés), tandis que APR 1.2 et supérieur fournissent l'API `apr_dbd` qui permet l'interaction avec la base de données.

Les nouveaux modules DEVRAIENT désormais utiliser ces APIs pour toutes les opérations liées aux bases de données SQL. De même, les applications existantes DEVRAIENT être mises à jour lorsque c'est possible, que ce soit de manière transparente ou sous forme d'une option recommandée à leurs utilisateurs.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
