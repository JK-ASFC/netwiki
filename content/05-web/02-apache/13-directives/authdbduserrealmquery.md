---
title: "AuthDBDUserRealmQuery"
description: "Directive Apache AuthDBDUserRealmQuery (mod_authn_dbd) — Requête SQL servant à vérifier une empreinte de mot de passe pour un utilisateur et un identifiant d'authentification. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authn_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Requête SQL servant à vérifier une empreinte de mot de passe pour un utilisateur et un identifiant d'authentification. |
| **Syntaxe** | `AuthDBDUserRealmQuery requête` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authn_dbd\|mod_authn_dbd]] |

## Utilisation

La directive `AuthDBDUserRealmQuery` permet de spécifier une requête SQL servant à vérifier une empreinte de mot de passe pour un utilisateur et un identifiant d'authentification donnés au cours d'un processus d'authentification digest. Les identifiants de l'utilisateur et de l'authentification sont passés dans cet ordre comme paramètres à l'exécution de la requête. Ils sont référencés dans la chaîne de la requête en utilisant des spécificateurs de format `%s`.

```apache
AuthDBDUserRealmQuery "SELECT password FROM authn WHERE user = %s AND realm = %s"
```

La première colonne du premier enregistrement renvoyé par la requête se présentera sous la forme d'une chaîne de caractères contenant le mot de passe chiffré. Les enregistrements suivants seront ignorés. Si aucun enregistrement n'est renvoyé, l'utilisateur ne sera pas authentifié par [[12-modules/mod_authn_dbd|mod_authn_dbd]].

Toute valeur de colonne supplémentaire du premier enregistrement renvoyé par la requête sera stockée dans une variable d'environnement avec un nom de la forme `AUTHENTICATE_COLONNE`.

Le format du mot de passe chiffré dépend du frontal d'authentification utilisé (par exemple [[12-modules/mod_auth_basic|mod_auth_basic]] ou [[12-modules/mod_auth_digest|mod_auth_digest]]). Voir la documentation sur les [[11-guides/06-divers/formats-de-mots-de-passe|Formats de mots de passe]] pour plus de détails.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
