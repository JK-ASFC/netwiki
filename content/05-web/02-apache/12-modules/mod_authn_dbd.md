---
title: "mod_authn_dbd"
description: "Module Apache mod_authn_dbd — Authentification utilisateur à l'aide d'une base de données SQL. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authn_dbd]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Authentification utilisateur à l'aide d'une base de données SQL |
| **Statut** | Extension |
| **Identificateur** | `authn_dbd_module` |
| **Fichier source** | `mod_authn_dbd.c` |
| **Compatibilité** | Disponible depuis la version 2.1 d'Apache |

## Sommaire

Ce module permet aux frontaux d'authentification comme [[12-modules/mod_auth_digest|mod_auth_digest]] et [[12-modules/mod_auth_basic|mod_auth_basic]] d'authentifier les utilisateurs en les recherchant dans une base de données SQL. [[12-modules/mod_authn_file|mod_authn_file]], par exemple, fournit une fonctionnalité similaire.

Ce module s'appuie sur [[12-modules/mod_dbd|mod_dbd]] pour spécifier le pilote de la base de données sous-jacente et les paramètres de connexion, mais aussi pour gérer les connexions à la base de données.

Si l'on utilise [[12-modules/mod_auth_basic|mod_auth_basic]] ou [[12-modules/mod_auth_digest|mod_auth_digest]], on peut invoquer ce module en affectant la valeur `dbd` à la directive [[13-directives/authbasicprovider|AuthBasicProvider]] ou [[13-directives/authdigestprovider|AuthDigestProvider]].

## Performances et mise en cache

Certains utilisateurs de l'authentification DBD sous HTTPD 2.2/2.4 ont signalé une charge problématique au niveau de la base de données. Cela se produit en général lorsqu'une page HTML contient des centaines d'objets (comme des images, des scripts, etc...), chacun d'entre eux nécessitant une authentification. Les utilisateurs qui rencontrent ce genre de problème peuvent utiliser le module [[12-modules/mod_authn_socache|mod_authn_socache]] qui permet de mettre les données d'authentification en cache, et soulager ainsi la base de données de la plus grande partie de la charge.

## Exemple de configuration

Voici un exemple simple d'utilisation de ce module dans un contexte d'authentification et de bases de données.

```apache
# configuration de mod_dbd
# MISE À JOUR pour inclure la mise en cache de l'authentification
DBDriver pgsql
DBDParams "dbname=apacheauth user=apache password=xxxxxx"

DBDMin  4
DBDKeep 8
DBDMax  20
DBDExptime 300

<Directory "/usr/www/mon-serveur/private">
  # configuration de mod_authn_core et mod_auth_basic
  # pour mod_authn_dbd
  AuthType Basic
  AuthName "Mon serveur"

  # Pour mettre en cache les données d'authentification, placez socache
  # avant dbd
  AuthBasicProvider socache dbd

  # Aussi nécessaire à la mise en cache : dire au cache de mettre en
  # cache les recherches dbd !
  AuthnCacheProvideFor dbd
  AuthnCacheContext mon-serveur

  # configuration de mod_authz_core
  Require valid-user

  # la requête SQL de mod_authn_dbd pour authentifier un utilisateur
  AuthDBDUserPWQuery "SELECT password FROM authn WHERE user = %s"
</Directory>
```

## Mise à disposition des informations de connexion

Pour chaque requête envoyée au serveur de base de données, toutes les valeurs de colonnes du premier enregistrement renvoyé par la requête sont affectées à des variables d'environnement avec le préfixe "AUTHENTICATE\_".

Par exemple, si une requête renvoie un nom d'utilisateur, un nom complet et un numéro de téléphone, un programme CGI pourra accéder à ces informations sans avoir besoin d'effectuer une deuxième requête vers la base de données.

Ceci va entraîner une simplification considérable du code et de la configuration nécessaire de certaines applications web.

## Directives

- [[13-directives/authdbduserpwquery|AuthDBDUserPWQuery]]
- [[13-directives/authdbduserrealmquery|AuthDBDUserRealmQuery]]

## Voir aussi

- [[13-directives/authname|AuthName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
