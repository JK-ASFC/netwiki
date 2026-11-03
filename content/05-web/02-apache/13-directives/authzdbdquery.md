---
title: "AuthzDBDQuery"
description: "Directive Apache AuthzDBDQuery (mod_authz_dbd) — Définit la requête SQL pour l'opération requise. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la requête SQL pour l'opération requise |
| **Syntaxe** | `AuthzDBDQuery requête` |
| **Contexte** | répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authz_dbd\|mod_authz_dbd]] |

## Utilisation

La directive `AuthzDBDQuery` permet de spécifier une requête SQL à exécuter. Le but de cette requête dépend de la directive [[13-directives/require|Require]] en cours de traitement.

- Avec la directive `Require dbd-group`, elle spécifie une requête permettant de rechercher les groupes d'appartenance de l'utilisateur courant. Ceci correspond à la fonctionnalité standard d'autres modules d'autorisation comme [[12-modules/mod_authz_groupfile|mod_authz_groupfile]] et [[12-modules/mod_authz_dbm|mod_authz_dbm]]. La première colonne de chaque enregistrement renvoyé par la requête doit contenir une chaîne de caractères correspondant à un nom de groupe. La requête peut renvoyer zéro, un ou plusieurs enregistrements.

  ```apache
  Require dbd-group
  AuthzDBDQuery "SELECT group FROM groups WHERE user = %s"
  ```
- Avec la directive `Require dbd-login` ou `Require dbd-logout`, elle ne refusera jamais l'accès, mais au contraire exécutera une requête SQL permettant d'enregistrer la connexion ou la déconnexion de l'utilisateur. Ce dernier doit être déjà authentifié avec [[12-modules/mod_authn_dbd|mod_authn_dbd]].

  ```apache
  Require dbd-login
  AuthzDBDQuery "UPDATE authn SET login = 'true' WHERE user = %s"
  ```

Dans tous les cas, l'identifiant utilisateur sera transmis comme paramètre sous la forme d'une simple chaîne lorsque la requête SQL sera exécutée. Il y sera fait référence dans la requête en utilisant le spécificateur de format `%s`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
