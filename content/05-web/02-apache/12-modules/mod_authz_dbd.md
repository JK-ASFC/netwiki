---
title: "mod_authz_dbd"
description: "Module Apache mod_authz_dbd — Autorisation en groupe et reconnaissance d'identité avec base SQL. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authz_dbd]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autorisation en groupe et reconnaissance d'identité avec base SQL |
| **Statut** | Extension |
| **Identificateur** | `authz_dbd_module` |
| **Fichier source** | `mod_authz_dbd.c` |
| **Compatibilité** | Disponible dans les versions 2.4 et supérieures d'Apache |

## Sommaire

Ce module fournit des fonctionnalités d'autorisation permettant d'accorder ou de refuser aux utilisateurs authentifiés l'accès à certaines zones du site web en fonction de leur appartenance à tel ou tel groupe. Les modules [[12-modules/mod_authz_groupfile|mod_authz_groupfile]] et [[12-modules/mod_authz_dbm|mod_authz_dbm]] fournissent une fonctionnalité similaire, mais ici le module interroge une base de données SQL pour déterminer si un utilisateur appartient ou non à tel ou tel groupe.

Ce module propose également des fonctionnalités de connexion utilisateur s'appuyant sur une base de données, ce qui peut se révéler particulièrement utile lorsque le module est utilisé conjointement avec [[12-modules/mod_authn_dbd|mod_authn_dbd]].

Ce module s'appuie sur [[12-modules/mod_dbd|mod_dbd]] pour spécifier le pilote de la base de données sous-jacente et les paramètres de connexion, et gérer les connexions à la base de données.

## Les directives Require

Les directives [[13-directives/require|Require]] d'Apache permettent, au cours de la phase d'autorisation, de s'assurer qu'un utilisateur est bien autorisé à accéder à une ressource. mod\_authz\_dbd ajoute les types d'autorisation `dbd-group`, `dbd-login` et `dbd-logout`.

A partir de la version 2.4.8, les directives require DBD supportent les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]].

### Require dbd-group

Cette directive permet de spécifier à quel groupe un utilisateur doit appartenir pour obtenir l'autorisation d'accès.

```apache
Require dbd-group team
AuthzDBDQuery "SELECT user_group FROM authz WHERE user = %s"
```

### Require dbd-login

Cette directive permet de spécifier une requête à exécuter pour indiquer que l'utilisateur s'est authentifié.

```apache
Require dbd-login
AuthzDBDQuery "UPDATE authn SET login = 'true' WHERE user = %s"
```

### Require dbd-logout

Cette directive permet de spécifier une requête à exécuter pour indiquer que l'utilisateur s'est déconnecté.

```apache
Require dbd-logout
AuthzDBDQuery "UPDATE authn SET login = 'false' WHERE user = %s"
```

## Reconnaissance d'identité s'appuyant sur une base de données

Outre sa fonction d'autorisation standard consistant à vérifier l'appartenance à des groupes, ce module permet aussi de gérer des sessions utilisateur côté serveur grâce à sa fonctionnalité de connexion utilisateur en s'appuyant sur une base de données. En particulier, il peut mettre à jour le statut de session de l'utilisateur dans la base de données chaque fois que celui-ci visite certaines URLs (sous réserve bien entendu que l'utilisateur fournissent les informations de connexion nécessaires).

Pour cela, il faut definir deux directives [[13-directives/require|Require]] spéciales : `Require dbd-login` et `Require dbd-logout`. Pour les détails de leur utilisation, voir l'exemple de configuration ci-dessous.

## Reconnaissance d'identité côté client

Certains administrateurs peuvent vouloir implémenter une gestion de session côté client fonctionnant de concert avec les fonctionnalités de connexion/déconnexion des utilisateurs côté serveur offertes par ce module, en définissant ou en annulant par exemple un cookie HTTP ou un jeton similaire lorsqu'un utilisateur se connecte ou se déconnecte.

Pour supporter une telle intégration, [[12-modules/mod_authz_dbd|mod_authz_dbd]] exporte un programme à déclenchement optionnel (hook) qui sera lancé chaque fois que le statut d'un utilisateur sera mis à jour dans la base de données. D'autres modules de gestion de session pourront alors utiliser ce programme pour implémenter des fonctions permettant d'ouvrir et de fermer des sessions côté client.

## Exemple de configuration

```apache
# configuration de mod_dbd
DBDriver pgsql
DBDParams "dbname=apacheauth user=apache pass=xxxxxx"

DBDMin  4
DBDKeep 8
DBDMax  20
DBDExptime 300

<Directory "/usr/www/mon.site/team-private/">
  # configuration de mod_authn_core et mod_auth_basic
  # pour mod_authn_dbd
  AuthType Basic
  AuthName Team
  AuthBasicProvider dbd

  # requête SQL de mod_authn_dbd pour authentifier un utilisateur qui se
  # connecte
  AuthDBDUserPWQuery \
    "SELECT password FROM authn WHERE user = %s AND login = 'true'"

  # configuration de mod_authz_core pour mod_authz_dbd
  Require dbd-group team

  # configuration de mod_authz_dbd
  AuthzDBDQuery "SELECT group FROM authz WHERE user = %s"

  # lorsqu'un utilisateur échoue dans sa tentative d'authentification ou
  # d'autorisation, on l'invite à se connecter ; cette page doit
  # contenir un lien vers /team-private/login.html
  ErrorDocument 401 "/login-info.html"

  <Files "login.html">
    # il n'est pas nécessaire que l'utilisateur soit déjà connecté !
    AuthDBDUserPWQuery "SELECT password FROM authn WHERE user = %s"

    # le processus de connexion dbd exécute une requête pour enregistrer
    # la connexion de l'utilisateur
    Require dbd-login
    AuthzDBDQuery "UPDATE authn SET login = 'true' WHERE user = %s"

    # redirige l'utilisateur vers la page d'origine (si elle existe)
    # après une connexion réussie
    AuthzDBDLoginToReferer On
  </Files>

  <Files "logout.html">
    # le processus de déconnexion dbd exécute une requête pour
    # enregistrer la déconnexion de l'utilisateur
    Require dbd-logout
    AuthzDBDQuery "UPDATE authn SET login = 'false' WHERE user = %s"
  </Files>
</Directory>
```

## Directives

- [[13-directives/authzdbdquery|AuthzDBDQuery]]
- [[13-directives/authzdbdredirectquery|AuthzDBDRedirectQuery]]
- [[13-directives/authzdbdlogintoreferer|AuthzDBDLoginToReferer]]

## Voir aussi

- [[13-directives/require|Require]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
