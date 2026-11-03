---
title: "Authentification et autorisation"
description: "Apache HTTP Server — Authentification et autorisation. L'authentification est un processus qui vous permet de vérifier qu'une personne est bien celle qu'elle prétend être. L'autorisation est un processus qui permet à une personne d'aller là où elle veut aller, ou d'obtenir les informations qu'e"
tags: [apache, guide]
icon: book-open
---

L'authentification est un processus qui vous permet de vérifier qu'une personne est bien celle qu'elle prétend être. L'autorisation est un processus qui permet à une personne d'aller là où elle veut aller, ou d'obtenir les informations qu'elle désire.

Pour le contrôle d'accès en général, voir le How-To [[11-guides/02-guides-pratiques/controle-d-acces|Contrôle d'accès]].

## Modules et directives concernés

Trois groupes de modules sont concernés par le processus d'authentification et d'autorisation. Vous devrez utiliser au moins un module de chaque groupe.

- Type d'authentification (voir la directive [[13-directives/authtype|AuthType]])

  - [[12-modules/mod_auth_basic|mod_auth_basic]]
  - [[12-modules/mod_auth_digest|mod_auth_digest]]
- Fournisseur d'authentification (voir les directives [[13-directives/authbasicprovider|AuthBasicProvider]] et [[13-directives/authdigestprovider|AuthDigestProvider]])

  - [[12-modules/mod_authn_anon|mod_authn_anon]]
  - [[12-modules/mod_authn_dbd|mod_authn_dbd]]
  - [[12-modules/mod_authn_dbm|mod_authn_dbm]]
  - [[12-modules/mod_authn_file|mod_authn_file]]
  - [[12-modules/mod_authnz_ldap|mod_authnz_ldap]]
  - [[12-modules/mod_authn_socache|mod_authn_socache]]
- Autorisation (voir la directive [[13-directives/require|Require]])

  - [[12-modules/mod_authnz_ldap|mod_authnz_ldap]]
  - [[12-modules/mod_authz_dbd|mod_authz_dbd]]
  - [[12-modules/mod_authz_dbm|mod_authz_dbm]]
  - [[12-modules/mod_authz_groupfile|mod_authz_groupfile]]
  - [[12-modules/mod_authz_host|mod_authz_host]]
  - [[12-modules/mod_authz_owner|mod_authz_owner]]
  - [[12-modules/mod_authz_user|mod_authz_user]]

On peut aussi ajouter [[12-modules/mod_authn_core|mod_authn_core]] et [[12-modules/mod_authz_core|mod_authz_core]]. Ces modules implémentent des directives générales qui opèrent au dessus de tous les modules d'authentification.

Le module [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] est un fournisseur d'authentification et d'autorisation. Le module [[12-modules/mod_authz_host|mod_authz_host]] fournit une autorisation et un contrôle d'accès basés sur le nom du serveur, l'adresse IP ou certaines caractéristiques de la requête, mais ne fait pas partie du système fournisseur d'authentification. Le module [[12-modules/mod_access_compat|mod_access_compat]] a été créé à des fins de compatibilité ascendante avec mod\_access.

Vous devriez aussi jeter un coup d'oeil au manuel de recettes de [[11-guides/02-guides-pratiques/controle-d-acces|Contrôle d'accès]], qui décrit les différentes méthodes de contrôle d'accès à votre serveur.

## Introduction

Si votre site web contient des informations sensibles ou destinées seulement à un groupe de personnes restreint, les techniques exposées dans cet article vont vous aider à vous assurer que les personnes qui ont accès à ces pages sont bien celles auxquelles vous avez donné l'autorisation d'accès.

Cet article décrit les méthodes "standards" de protection de parties de votre site web que la plupart d'entre vous sont appelés à utiliser.

> [!NOTE]
> **Note :**
>
> Si vos données ont un réel besoin de sécurisation, prévoyez l'utilisation de [[12-modules/mod_ssl|mod_ssl]] en plus de toute méthode d'authentification.

## Les prérequis

Les directives décrites dans cet article devront être insérées soit au niveau de la configuration de votre serveur principal (en général dans une section [[13-directives/directory|<Directory>]]), soit au niveau de la configuration des répertoires (fichiers `.htaccess`)

Si vous envisagez l'utilisation de fichiers `.htaccess`, la configuration de votre serveur devra permettre l'ajout de directives d'authentification dans ces fichiers. Pour ce faire, on utilise la directive [[13-directives/allowoverride|AllowOverride]], qui spécifie quelles directives pourront éventuellement contenir les fichiers de configuration de niveau répertoire.

Comme il est ici question d'authentification, vous aurez besoin d'une directive [[13-directives/allowoverride|AllowOverride]] du style :

```apache
AllowOverride AuthConfig
```

Si vous avez l'intention d'ajouter les directives directement dans le fichier de configuration principal, vous devrez bien entendu posséder les droits en écriture sur ce fichier.

Vous devrez aussi connaître un tant soit peu la structure des répertoires de votre serveur, ne serait-ce que pour savoir où se trouvent certains fichiers. Cela ne devrait pas présenter de grandes difficultés, et nous essaierons de clarifier tout ça lorsque le besoin s'en fera sentir.

Enfin, vous devrez vous assurer que les modules [[12-modules/mod_authn_core|mod_authn_core]] et [[12-modules/mod_authz_core|mod_authz_core]] ont été soit compilés avec le binaire httpd, soit chargés par le fichier de configuration httpd.conf. Ces deux modules fournissent des directives générales et des fonctionnalités qui sont critiques quant à la configuration et l'utilisation de l'authentification et de l'autorisation au sein du serveur web.

## Mise en oeuvre

Nous décrivons ici les bases de la protection par mot de passe d'un répertoire de votre serveur.

Vous devez en premier lieu créer un fichier de mots de passe. La méthode exacte selon laquelle vous allez créer ce fichier va varier en fonction du fournisseur d'authentification choisi. Mais nous entrerons dans les détails plus loin, et pour le moment, nous nous contenterons d'un fichier de mots de passe en mode texte.

Ce fichier doit être enregistré à un endroit non accessible depuis le web, de façon à ce que les clients ne puissent pas le télécharger. Par exemple, si vos documents sont servis à partir de `/usr/local/apache/htdocs`, vous pouvez enregistrer le fichier des mots de passe dans `/usr/local/apache/passwd`.

L'utilitaire [[10-commandes/htpasswd|htpasswd]] fourni avec Apache permet de créer ce fichier. Vous le trouverez dans le répertoire `bin` de votre installation d'Apache. Si vous avez installé Apache à partir d'un paquetage tiers, il sera probablement dans le chemin par défaut de vos exécutables.

Pour créer le fichier, tapez :

```
htpasswd -c /usr/local/apache/passwd/passwords rbowen
```

[[10-commandes/htpasswd|htpasswd]] vous demandera d'entrer le mot de passe, et de le retaper pour confirmation :

```
# htpasswd -c /usr/local/apache/passwd/passwords rbowen
New password: mot-de-passe
Re-type new password: mot-de-passe
Adding password for user rbowen
```

Si [[10-commandes/htpasswd|htpasswd]] n'est pas dans le chemin par défaut de vos exécutables, vous devrez bien entendu entrer le chemin complet du fichier. Dans le cas d'une installation par défaut, il se trouve à `/usr/local/apache2/bin/htpasswd`.

Ensuite, vous allez devoir configurer le serveur de façon à ce qu'il demande un mot de passe et lui préciser quels utilisateurs ont l'autorisation d'accès. Pour ce faire, vous pouvez soit éditer le fichier `httpd.conf`, soit utiliser un fichier `.htaccess`. Par exemple, si vous voulez protéger le répertoire `/usr/local/apache/htdocs/secret`, vous pouvez utiliser les directives suivantes, soit dans le fichier `/usr/local/apache/htdocs/secret/.htaccess`, soit dans le fichier `httpd.conf` à l'intérieur d'une section \<Directory "/usr/local/apache/htdocs/secret"\> :

```apache
AuthType Basic
AuthName "Restricted Files"
# (La ligne suivante est facultative)
AuthBasicProvider file
AuthUserFile "/usr/local/apache/passwd/passwords"
Require user rbowen
```

Examinons ces directives une à une. La directive [[13-directives/authtype|AuthType]] définit la méthode utilisée pour authentifier l'utilisateur. La méthode la plus courante est `Basic`, et elle est implémentée par [[12-modules/mod_auth_basic|mod_auth_basic]]. Il faut cependant garder à l'esprit que l'authentification Basic transmet le mot de passe depuis le client vers le serveur en clair. Cette méthode ne devra donc pas être utilisée pour la transmission de données hautement sensibles si elle n'est pas associée au module [[12-modules/mod_ssl|mod_ssl]]. Apache supporte une autre méthode d'authentification : `AuthType Digest`. Cette méthode est implémentée par le module [[12-modules/mod_auth_digest|mod_auth_digest]] et a été conçue pour améliorer la sécurité. Ce but n'a cependant pas été atteint et il est préférable de chiffrer la connexion avec [[12-modules/mod_ssl|mod_ssl]].

La directive [[13-directives/authname|AuthName]] définit l'*Identificateur* (Realm) à utiliser avec l'authentification. L'identificateur possède deux fonctions. Tout d'abord, le client présente en général cette information à l'utilisateur dans le cadre de la boîte de dialogue de mot de passe. Ensuite, le client l'utilise pour déterminer quel mot de passe envoyer pour une zone authentifiée donnée.

Ainsi par exemple, une fois un client authentifié dans la zone `"Fichiers réservés"`, il soumettra à nouveau automatiquement le même mot de passe pour toute zone du même serveur marquée de l'identificateur `"Fichiers réservés"`. De cette façon, vous pouvez éviter à un utilisateur d'avoir à saisir plusieurs fois le même mot de passe en faisant partager le même identificateur entre plusieurs zones réservées. Bien entendu et pour des raisons de sécurité, le client devra redemander le mot de passe chaque fois que le nom d'hôte du serveur sera modifié.

La directive [[13-directives/authbasicprovider|AuthBasicProvider]] est, dans ce cas, facultative, car `file` est la valeur par défaut pour cette directive. Par contre, cette directive sera obligatoire si vous utilisez une autre source d'authentification comme [[12-modules/mod_authn_dbm|mod_authn_dbm]] ou [[12-modules/mod_authn_dbd|mod_authn_dbd]].

La directive [[13-directives/authuserfile|AuthUserFile]] définit le chemin du fichier de mots de passe que nous venons de créer avec [[10-commandes/htpasswd|htpasswd]]. Si vous possédez un grand nombre d'utilisateurs, la durée de la recherche dans un fichier texte pour authentifier un utilisateur à chaque requête va augmenter rapidement, et pour pallier cet inconvénient, Apache peut aussi stocker les données relatives aux utilisateurs dans des bases de données rapides. Le module [[12-modules/mod_authn_dbm|mod_authn_dbm]] fournit la directive [[13-directives/authdbmuserfile|AuthDBMUserFile]]. Les programmes [[10-commandes/dbmmanage|dbmmanage]] et [[10-commandes/htdbm|htdbm]] permettent de créer et manipuler ces fichiers. Enfin, de nombreux modules tiers fournissent d'autres types d'authentification.

Enfin, la directive [[13-directives/require|Require]] implémente la partie autorisation du processus en définissant l'utilisateur autorisé à accéder à cette zone du serveur. Dans la section suivante, nous décrirons les différentes méthodes d'utilisation de la directive [[13-directives/require|Require]].

## Autorisation d'accès à plusieurs personnes

Les directives ci-dessus n'autorisent qu'une personne (quelqu'un possédant le nom d'utilisateur `rbowen`) à accéder au répertoire. Dans la plupart des cas, vous devrez autoriser l'accès à plusieurs personnes. C'est ici qu'intervient la directive [[13-directives/authgroupfile|AuthGroupFile]].

Si vous voulez autoriser l'accès à plusieurs personnes, vous devez créer un fichier de groupes qui associe des noms de groupes avec une liste d'utilisateurs de ce groupe. Le format de ce fichier est très simple, et vous pouvez le créer avec votre éditeur favori. Son contenu se présente comme suit :

```
Nom-de-groupe: rbowen dpitts sungo rshersey
```

Il s'agit simplement une liste des membres du groupe sous la forme d'une ligne séparée par des espaces.

Pour ajouter un utilisateur à votre fichier de mots de passe préexistant, entrez :

```
htpasswd /usr/local/apache/passwd/passwords dpitts
```

Vous obtiendrez le même effet qu'auparavant, mais le mot de passe sera ajouté au fichier, plutôt que d'en créer un nouveau (C'est le drapeau `-c` qui permet de créer un nouveau fichier de mots de passe)..

Maintenant, vous devez modifier votre fichier `.htaccess` comme suit :

```apache
AuthType Basic
AuthName "By Invitation Only"
# Ligne facultative :
AuthBasicProvider file
AuthUserFile "/usr/local/apache/passwd/passwords"
AuthGroupFile "/usr/local/apache/passwd/groups"
Require group GroupName
```

Maintenant, quiconque appartient au groupe `Nom-de-groupe`, et possède une entrée dans le fichier `password` pourra accéder au répertoire s'il tape le bon mot de passe.

Il existe une autre méthode moins contraignante pour autoriser l'accès à plusieurs personnes. Plutôt que de créer un fichier de groupes, il vous suffit d'ajouter la directive suivante :

```apache
Require valid-user
```

Le remplacement de la ligne `Require user rbowen` par la ligne `Require valid-user` autorisera l'accès à quiconque possédant une entrée dans le fichier password, et ayant tapé le bon mot de passe. Vous pouvez même simuler le comportement des groupes en associant un fichier de mots de passe différent pour chaque groupe. L'avantage de cette approche réside dans le fait qu'Apache ne doit consulter qu'un fichier au lieu de deux. Par contre, vous devez maintenir un nombre plus ou moins important de fichiers de mots de passe, et vous assurer de faire référence au bon fichier dans la directive [[13-directives/authuserfile|AuthUserFile]].

## Problèmes possibles

L'authentification Basic est spécifiée d'une telle manière que vos nom d'utilisateur et mot de passe doivent être vérifiés chaque fois que vous demandez un document au serveur, et ceci même si vous rechargez la même page, et pour chaque image contenue dans la page (si elles sont situées dans un répertoire protégé). Comme vous pouvez l'imaginer, ceci ralentit un peu le fonctionnement. La mesure dans laquelle le fonctionnement est ralenti est proportionnelle à la taille du fichier des mots de passe, car ce dernier doit être ouvert et la liste des utilisateurs parcourue jusqu'à ce que votre nom soit trouvé, et ceci chaque fois qu'une page est chargée.

En conséquence, ce ralentissement impose une limite pratique au nombre d'utilisateurs que vous pouvez enregistrer dans un fichier de mots de passe. Cette limite va varier en fonction des performances de votre serveur, mais vous commencerez à remarquer un ralentissement lorsque vous atteindrez quelques centaines d'utilisateurs, et serez alors appelés à utiliser une méthode d'authentification différente.

## Autre méthode de stockage des mots de passe

Suite au problème évoqué précédemment et induit par le stockage des mots de passe dans un fichier texte, vous pouvez être appelé à stocker vos mots de passe d'une autre manière, par exemple dans une base de données.

Pour y parvenir, on peut utiliser les modules [[12-modules/mod_authn_dbm|mod_authn_dbm]] ou [[12-modules/mod_authn_dbd|mod_authn_dbd]]. Vous pouvez choisir comme format de stockage `dbm` ou `dbd` à la place de `file` pour la directive [[13-directives/authbasicprovider|AuthBasicProvider]].

Par exemple, pour sélectionner un fichier dbm à la place d'un fichier texte :

```apache
<Directory "/www/docs/private">
AuthName "Private"
AuthType Basic
AuthBasicProvider dbm
AuthDBMUserFile "/www/passwords/passwd.dbm"
Require valid-user
</Directory>
```

D'autres options sont disponibles. Consultez la documentation de [[12-modules/mod_authn_dbm|mod_authn_dbm]] pour plus de détails.

## Utilisation de plusieurs fournisseurs d'authentification

Depuis l'arrivée des nouvelles architecture d'autorisation et d'authentification basées sur les fournisseurs, vous n'êtes plus limité à une méthode d'authentification et d'autorisation unique. En fait, on peut panacher autant de fournisseurs que l'on veut, ce qui vous permet d'élaborer l'architecture qui correspond exactement à vos besoins. Dans l'exemple suivant, on utilise conjointement les fournisseurs d'authentification file et LDAP :

```apache
<Directory "/www/docs/private">
AuthName "Private"
AuthType Basic
AuthBasicProvider file ldap
AuthUserFile "/usr/local/apache/passwd/passwords"
AuthLDAPURL ldap://ldaphost/o=yourorg
Require valid-user
</Directory>
```

Dans cet exemple, le fournisseur file va tenter d'authentifier l'utilisateur en premier. S'il n'y parvient pas, le fournisseur LDAP sera sollicité. Ceci permet l'élargissement des possibilités d'authentification si votre organisation implémente plusieurs types de bases d'authentification. D'autres scénarios d'authentification et d'autorisation peuvent associer un type d'authentification avec un autre type d'autorisation. Par exemple, une authentification basée sur un fichier de mots de passe peut permettre l'attribution d'autorisations basée sur un annuaire LDAP.

Tout comme plusieurs fournisseurs d'authentification peuvent être implémentés, on peut aussi utiliser plusieurs méthodes d'autorisation. Dans l'exemple suivant, on utilise à la fois une autorisation à base de fichier de groupes et une autorisation à base de groupes LDAP.

```apache
<Directory "/www/docs/private">
AuthName "Private"
AuthType Basic
AuthBasicProvider file
AuthUserFile "/usr/local/apache/passwd/passwords"
AuthLDAPURL ldap://ldaphost/o=yourorg
AuthGroupFile "/usr/local/apache/passwd/groups"
Require group GroupName
Require ldap-group cn=mygroup,o=yourorg
</Directory>
```

Pour un scénario d'autorisation un peu plus avancé, des directives de conteneur d'autorisation comme [[13-directives/requireall|<RequireAll>]] et [[13-directives/requireany|<RequireAny>]] permettent d'appliquer une logique telle que l'ordre dans lequel les autorisations sont appliquées peut être entièrement contrôlé au niveau de la configuration. Voir [[12-modules/mod_authz_core|Conteneurs d'autorisations]] pour un exemple de ce contrôle.

## Pour aller plus loin qu'une simple autorisation

La manière dont les autorisations sont accordées est désormais beaucoup plus souple qu'une simple vérification auprès d'une seule base de données. Il est maintenant possible de choisir l'ordre, la logique et la manière selon lesquels une autorisation est accordée.

### Appliquer logique et ordonnancement

Le contrôle de la manière et de l'ordre selon lesquels le processus d'autorisation était appliqué constituait une sorte de mystère par le passé. Dans Apache 2.2, un mécanisme d'authentification basé sur les fournisseurs a été développé afin de séparer le véritable processus d'authentification de l'autorisation et ses différentes fonctionnalités. Un des avantages colatéraux résidait dans le fait que les fournisseurs d'authentification pouvaient être configurés et appelés selon un ordre particulier indépendant de l'ordre de chargement du module auth proprement dit. Ce mécanisme basé sur les fournisseurs a été étendu au processus d'autorisation. Ceci signifie que la directive [[13-directives/require|Require]] définit non seulement quelles méthodes d'autorisation doivent être utilisées, mais aussi l'ordre dans lequel elles sont appelées. Les méthodes d'autorisation sont appelées selon l'ordre dans lequel les directives [[13-directives/require|Require]] apparaissent dans la configuration.

Avec l'introduction des directives de conteneur d'autorisations [[13-directives/requireall|<RequireAll>]] et [[13-directives/requireany|<RequireAny>]], la configuration contrôle aussi le moment où les méthodes d'autorisation sont appelées, et quels critères déterminent l'autorisation d'accès. Voir [[12-modules/mod_authz_core|Conteneurs d'autorisations]] pour un exemple de la manière de les utiliser pour exprimer des logiques d'autorisation complexes. Chaque fournisseur d’autorisation renvoie un des trois résultats possibles ; voir [[12-modules/mod_authz_core|États des résultats d’autorisation]] pour des détails sur la manière dont les conteneurs interprètent ces résultats.

Par défaut, toutes les directives [[13-directives/require|Require]] sont traitées comme si elles étaient contenues dans une directive [[13-directives/requireany|<RequireAny>]]. En d'autres termes, il suffit qu'une méthode d'autorisation s'applique avec succès pour que l'autorisation soit accordée.

### Utilisation de fournisseurs d'autorisation pour le contrôle d'accès

La vérification du nom d'utilisateur et du mot de passe ne constituent qu'un aspect des méthodes d'authentification. Vous pouvez aussi autoriser ou interdire l’accès en fonction d’autres critères tels que l’adresse IP du client ou le nom d’hôte en utilisant les fournisseurs d’autorisation `all`, `env`, `host` et `ip` avec la directive [[13-directives/require|Require]].

Pour des détails complets et des exemples, voir le tutoriel [[11-guides/02-guides-pratiques/controle-d-acces|Access Control]].

### Compatibilité ascendante du contrôle d'accès

L'adoption d'un mécanisme à base de fournisseurs pour l'autorisation, a pour effet colatéral de rendre inutiles les directives [[13-directives/order|Order]], [[13-directives/allow|Allow]], [[13-directives/deny|Deny]] et [[13-directives/satisfy|Satisfy]]. Cependant, et à des fins de compatibilité ascendante vers les anciennes configurations, ces directives ont été déplacées vers le module [[12-modules/mod_access_compat|mod_access_compat]].

> [!WARNING]
> **Note**
>
> Les directives fournies par le module [[12-modules/mod_access_compat|mod_access_compat]] sont devenues obsolètes depuis la refonte du module [[12-modules/mod_authz_host|mod_authz_host]]. Mélanger d'anciennes directives comme [[13-directives/order|Order]], [[13-directives/allow|Allow]] ou [[13-directives/deny|Deny]] avec des nouvelles comme [[13-directives/require|Require]] est techniquement possible mais déconseillé. En effet, [[12-modules/mod_access_compat|mod_access_compat]] a été conçu pour supporter des configurations ne contenant que des anciennes directives afin de faciliter le passage à la version 2.4. Voir le document [[11-guides/01-generalites/mise-a-jour-de-la-version-2-2-vers-la-version-2-4|upgrading]] pour plus de détails.

## Mise en cache de l'authentification

Dans certains cas, l'authentification constitue une charge inacceptable pour un fournisseur d'authentification ou votre réseau. Ceci est susceptible d'affecter les utilisateurs du module [[12-modules/mod_authn_dbd|mod_authn_dbd]] (ou les fournisseurs tiers/personnalisés). Le module [[12-modules/mod_authn_socache|mod_authn_socache]] met en cache les données d'authentification, et réduit ainsi la charge du/des fournisseurs(s) originels.

Cette mise en cache apportera un gain en performance substantiel à certains utilisateurs.

## Pour aller plus loin . . .

Vous pouvez aussi lire la documentation de [[12-modules/mod_auth_basic|mod_auth_basic]] et [[12-modules/mod_authz_host|mod_authz_host]] qui contient des informations supplémentaires à propos du fonctionnement de tout ceci. Certaines configurations d'authentification peuvent aussi être simplifiées à l'aide de la directive [[13-directives/authnprovideralias|<AuthnProviderAlias>]].

Les différents algorithmes de chiffrement supportés par Apache pour authentifier les données sont expliqués dans [[11-guides/06-divers/formats-de-mots-de-passe|PasswordEncryptions]].

Enfin vous pouvez consulter la recette [[11-guides/02-guides-pratiques/controle-d-acces|Contrôle d'accès]], qui décrit un certain nombre de situations en relation avec le sujet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
