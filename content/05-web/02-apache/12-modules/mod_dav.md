---
title: "mod_dav"
description: "Module Apache mod_dav — Fonctionnalité de création et gestion de versions de documents via le web (WebDAV). Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_dav]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fonctionnalité de création et gestion de versions de documents via le web (WebDAV) |
| **Statut** | Extension |
| **Identificateur** | `dav_module` |
| **Fichier source** | `mod_dav.c` |

## Sommaire

Ce module ajoute à Apache une fonctionnalité [WebDAV](http://www.webdav.org) de classes 1 et 2 ('Web-based Distributed Authoring and Versioning' ou Création et gestion de versions de documents via le web). Il s'agit d'une extension du protocole HTTP qui permet de créer, déplacer, copier et supprimer des ressources ou collections de ressources sur un serveur web distant.

## Activation de WebDAV

Pour activer le module [[12-modules/mod_dav|mod_dav]], ajoutez la ligne suivante à un conteneur de votre fichier `httpd.conf` :

```apache
Dav On
```

Ceci active le fournisseur de système de fichier DAV implémenté par le module [[12-modules/mod_dav_fs|mod_dav_fs]]. Ce dernier doit donc être compilé dans le serveur ou chargé au démarrage à l'aide de la directive [[13-directives/loadmodule|LoadModule]].

En outre, vous devez indiquer où se trouve la base de données des verrous DAV via une directive [[13-directives/davlockdb|DavLockDB]] dans la section globale de votre fichier `httpd.conf` :

```apache
DavLockDB /usr/local/apache2/var/DavLock
```

Le répertoire contenant le fichier de la base de données des verrous doit avoir des droits en écriture pour l'utilisateur et le groupe sous lesquels Apache s'exécute et définis respectivement par les directives [[13-directives/user|User]] et [[13-directives/group|Group]].

Dans l'exemple ci-après, la directive [[13-directives/requireany|<RequireAny>]] permet de s'assurer que les méthodes spécifiques à DAV (autrement dit les méthodes autres que `GET`, `POST` et `OPTIONS`) sont réservées aux utilisateurs authentifiés.

Pour définir la quantité maximale de données en octets qu'un client DAV peut envoyer par requête, vous devez utiliser la directive [[13-directives/limitxmlrequestbody|LimitXMLRequestBody]], car La directive [[13-directives/limitrequestbody|LimitRequestBody]] "habituelle" n'a aucune incidence sur les requêtes DAV.

**Exemple complet**

```apache
DavLockDB "/usr/local/apache2/var/DavLock"

<Directory "/usr/local/apache2/htdocs/foo">
    Dav On

    AuthType Basic
    AuthName DAV
    AuthUserFile "user.passwd"

    <RequireAny>
        Require method GET POST OPTIONS
        Require user admin
    </RequireAny>
</Directory>
```

## Problèmes concernant la sécurité

Etant donné que les méthodes d'accès DAV permettent à des clients distants de manipuler des fichiers sur le serveur, vous devez vous assurer que votre serveur est bien sécurisé avant d'activer [[12-modules/mod_dav|mod_dav]].

Tout répertoire du serveur où DAV est activé doit être protégé par une procédure d'authentification. L'utilisation de l'authentification HTTP de base n'est pas recommandée. Vous devez utiliser au moins l'authentification HTTP à base de condensés qu'implémente le module [[12-modules/mod_auth_digest|mod_auth_digest]]. Pratiquement tous les clients WebDAV supportent cette méthode d'authentification. Vous pouvez aussi utiliser l'authentification de base sur une connexion où [[11-guides/04-chiffrement-ssl-tls/00-apache-et-le-chiffrement-ssl-tls|SSL]] est activé.

Pour que [[12-modules/mod_dav|mod_dav]] puisse manipuler des fichiers, il doit avoir des permissions en écriture sur les répertoires et les fichiers qui sont sous son contrôle ; en d'autre termes, c'est l'utilisateur et le groupe sous lesquels Apache s'exécute et définis par les directives [[13-directives/user|User]] et [[13-directives/group|Group]] qui doivent avoir les droits en écriture sur ces fichiers et répertoires. Les fichiers nouvellement créés appartiendront aussi à ces utilisateur et groupe. Par conséquent, il est important de contrôler l'accès à ce compte. Les répertoires DAV sont considérés comme privés du point de vue d'Apache, et la modification des fichiers qu'ils contiennent autrement que par l'intermédiaire d'Apache (par exemple par FTP ou par des outils du niveau du système de fichiers) ne doit pas être permise.

[[12-modules/mod_dav|mod_dav]] peut faire l'objet de plusieurs sortes d'attaques par déni de service. La directive [[13-directives/limitxmlrequestbody|LimitXMLRequestBody]] permet de limiter la quantité de mémoire consommée pour interpréter des requêtes DAV de grande taille. En outre, la directive [[13-directives/davdepthinfinity|DavDepthInfinity]] permet d'empêcher les requêtes `PROPFIND` concernant un répertoire de très grande taille de consommer de grandes quantités de mémoire. Un autre type d'attaque par déni de service peut aussi être mené par un client qui remplit simplement tout l'espace disque disponible avec des fichiers de très grande taille. Etant donné qu'il n'existe aucun moyen direct d'éviter ce genre d'attaque dans Apache, vous ne devez accorder des accès DAV qu'à des utilisateurs de confiance.

## Configurations complexes

Les requêtes ayant pour but de manipuler des fichiers dynamiques (scripts PHP, scripts CGI, etc...) en utilisant [[12-modules/mod_dav|mod_dav]] sont courantes. Ce traitement n'est pas évident car une requête `GET` va toujours tenter d'exécuter le script, plutôt que de télécharger son contenu. Pour éviter cet inconvénient, une méthode possible consiste à faire correspondre deux URLs différentes au même contenu, l'une d'entre elles servant à lancer le script, alors que l'autre peut être utilisée pour le télécharger et le manipuler avec DAV.

```apache
Alias "/phparea" "/home/gstein/php_files"
Alias "/php-source" "/home/gstein/php_files"
<Location "/php-source">
Dav On
ForceType text/plain
</Location>
```

Avec cette configuration, on peut utiliser `http://example.com/phparea` pour afficher le résultat de l'exécution des scripts PHP, et `http://example.com/php-source` pour les manipuler avec DAV.

## Directives

- [[13-directives/dav|Dav]]
- [[13-directives/davbasepath|DavBasePath]]
- [[13-directives/davmintimeout|DavMinTimeout]]
- [[13-directives/davdepthinfinity|DavDepthInfinity]]

## Voir aussi

- [[13-directives/davlockdb|DavLockDB]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
