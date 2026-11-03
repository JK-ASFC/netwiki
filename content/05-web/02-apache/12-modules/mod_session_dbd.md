---
title: "mod_session_dbd"
description: "Module Apache mod_session_dbd — Support des session basé sur DBD/SQL. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_session_dbd]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Support des session basé sur DBD/SQL |
| **Statut** | Extension |
| **Identificateur** | `session_dbd_module` |
| **Fichier source** | `mod_session_dbd.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

> [!WARNING]
> **Avertissement**
>
> Les modules de session font usage des cookies HTTP, et peuvent à ce titre être victimes d'attaques de type Cross Site Scripting, ou divulguer des informations à caractère privé aux clients. Veuillez vous assurer que les risques ainsi encourus ont été pris en compte avant d'activer le support des sessions sur votre serveur.

Ce sous-module du module [[12-modules/mod_session|mod_session]] fournit le support du stockage des sessions utilisateur dans une base de données SQL en utilisant le module [[12-modules/mod_dbd|mod_dbd]].

Les sessions sont soit **anonymes**, et la session est alors identifiée par un UUID unique stocké dans un cookie au niveau du navigateur, soit **propres à l'utilisateur**, et la session est alors identifiée par l'identifiant de l'utilisateur connecté.

Les sessions basées sur SQL sont dissimulées au navigateur, et permettent ainsi de préserver la confidentialité sans avoir recours au chiffrement.

Plusieurs serveurs web d'une forêt de serveurs peuvent choisir de partager une base de données, et ainsi partager les sessions entre eux.

Pour plus de détails à propos de l'interface des sessions, voir la documentation du module [[12-modules/mod_session|mod_session]].

## Configuration de DBD

Pour que le module [[12-modules/mod_session_dbd|mod_session_dbd]] puisse être configuré et maintenir une session, il faut tout d'abord configurer le module [[12-modules/mod_dbd|mod_dbd]] pour que le serveur puisse exécuter des requêtes vers la base de données.

Quatre types de requêtes sont nécessaires pour maintenir une session, sélectionner ou mettre à jour une session existante, insérer une nouvelle session et supprimer une session vide ou arrivée à expiration. Ces requêtes sont configurées comme dans l'exemple suivant :

**Exemple de configuration de DBD**

```apache
DBDriver pgsql
DBDParams "dbname=apachesession user=apache password=xxxxx host=localhost"
DBDPrepareSQL "delete from session where key = %s" deletesession
DBDPrepareSQL "update session set value = %s, expiry = %lld, key = %s where key = %s" updatesession
DBDPrepareSQL "insert into session (value, expiry, key) values (%s, %lld, %s)" insertsession
DBDPrepareSQL "select value from session where key = %s and (expiry = 0 or expiry > %lld)" selectsession
DBDPrepareSQL "delete from session where expiry != 0 and expiry < %lld" cleansession
```

## Sessions anonymes

Les sessions anonymes sont identifiées par un UUID unique, et stockées dans un cookie au niveau du navigateur. Cette méthode est similaire à celle utilisée par la plupart des serveurs d'applications pour stocker les informations de session.

Pour créer une session anonyme, la stocker dans une table de base de donnée postgres nommée *apachesession*, et sauvegarder l'identifiant de session dans un cookie nommé *session*, configurez la session comme suit :

**Session anonyme basée sur SQL**

```apache
Session On
SessionDBDCookieName session path=/
```

Pour plus d'exemples sur la manière dont une application CGI peut accéder aux informations de session, voir la section exemples de la documentation du module [[12-modules/mod_session|mod_session]].

Pour des détails sur la manière dont une session peut être utilisée pour stocker des informations de type nom d'utilisateur/mot de passe, voir la documentation du module [[12-modules/mod_auth_form|mod_auth_form]].

## Sessions propres à un utilisateur

Les sessions propres à un utilisateur sont identifiées par le nom de l'utilisateur authentifié avec succès. Ceci permet d'assurer une confidentialité optimale, car aucun traitement externe à la session n'existe en dehors du contexte authentifié.

Les sessions propres à un utilisateur ne fonctionnent que dans un environnement d'authentification correctement configuré, qu'il s'agisse d'une authentification de base, à base de condensés (digest) ou de certificats client SSL. Suite à des limitations dues à des dépendances mutuelles, les sessions propres à un utilisateur ne peuvent pas être utilisées pour stocker les données d'authentification en provenance d'un module comme [[12-modules/mod_auth_form|mod_auth_form]].

Pour créer une session propre à un utilisateur, la stocker dans une table de base de données postgres nommée *apachesession*, avec comme clé de session l'identifiant utilisateur, ajoutez les lignes suivantes :

**Session propre à un utilisateur basée sur SQL**

```apache
Session On
SessionDBDPerUser On
```

## Nettoyage de la base de données

Avec le temps, la base de données va commencer à accumuler des sessions expirées. Pour le moment, le module [[12-modules/mod_session_dbd|mod_session_dbd]] n'est pas en mesure de gérer automatiquement l'expiration des sessions.

> [!WARNING]
> **Avertissement**
>
> L'administrateur devra mettre en oeuvre un traitement externe via cron pour nettoyer les sessions expirées.

## Directives

- [[13-directives/sessiondbdcookiename|SessionDBDCookieName]]
- [[13-directives/sessiondbdcookiename2|SessionDBDCookieName2]]
- [[13-directives/sessiondbdcookieremove|SessionDBDCookieRemove]]
- [[13-directives/sessiondbdperuser|SessionDBDPerUser]]
- [[13-directives/sessiondbdselectlabel|SessionDBDSelectLabel]]
- [[13-directives/sessiondbdinsertlabel|SessionDBDInsertLabel]]
- [[13-directives/sessiondbdupdatelabel|SessionDBDUpdateLabel]]
- [[13-directives/sessiondbddeletelabel|SessionDBDDeleteLabel]]

## Voir aussi

- [[12-modules/mod_session|mod_session]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
