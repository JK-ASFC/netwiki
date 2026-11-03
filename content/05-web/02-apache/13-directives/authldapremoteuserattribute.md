---
title: "AuthLDAPRemoteUserAttribute"
description: "Directive Apache AuthLDAPRemoteUserAttribute (mod_authnz_ldap) — Spécifie l'attribut dont la valeur renvoyée au cours de la requête de l'utilisateur sera utilisée pour définir la variable d'environnement REMOTE_USER. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie l'attribut dont la valeur renvoyée au cours de la requête de l'utilisateur sera utilisée pour définir la variable d'environnement REMOTE\_USER |
| **Syntaxe** | `AuthLDAPRemoteUserAttribute uid` |
| **Valeur par défaut** | `none` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Lorsque cette directive est définie, la variable d'environnement `REMOTE_USER` sera définie à la valeur de l'attribut spécifié. Assurez-vous que cet attribut soit bien inclus dans la liste d'attributs spécifiés dans la définition de [[13-directives/authldapurl|AuthLDAPURL]] ; dans le cas contraire, cette directive n'aurait aucun effet. Si elle est présente, cette directive l'emporte sur [[13-directives/authldapremoteuserisdn|AuthLDAPRemoteUserIsDN]]. Elle peut s'avérer utile par exemple, si vous souhaitez que les utilisateurs se connectent à un site web en utilisant leur adresse email, alors qu'une application sous-jacente nécessite un nom d'utilisateur comme identifiant.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
