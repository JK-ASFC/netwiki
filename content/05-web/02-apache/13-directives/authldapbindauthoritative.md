---
title: "AuthLDAPBindAuthoritative"
description: "Directive Apache AuthLDAPBindAuthoritative (mod_authnz_ldap) — Détermine si l'on doit utiliser d'autres fournisseurs d'authentification lorsque le serveur ne peut pas valider les données d'authentification de l'utilisateur, alors que ce dernier possède un DN. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si l'on doit utiliser d'autres fournisseurs d'authentification lorsque le serveur ne peut pas valider les données d'authentification de l'utilisateur, alors que ce dernier possède un DN. |
| **Syntaxe** | `AuthLDAPBindAuthoritative off\|on` |
| **Valeur par défaut** | `AuthLDAPBindAuthoritative on` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Par défaut, des fournisseurs d'authentification sont appelés si un utilisateur ne possède pas de DN, mais ne le sont pas si l'utilisateur possède un DN et si son mot de passe ne peut pas être vérifié lors d'une connexion au serveur LDAP. Si la directive `AuthLDAPBindAuthoritative` est définie à `off`, d'autres modules d'authentification configurés auront une chance de valider le mot de passe de l'utilisateur si la tentative de connexion au serveur LDAP échoue pour une raison quelconque (avec les données d'authentification fournies).

Ceci permet aux utilisateurs présent à la fois dans l'annuaire LDAP et dans un fichier [[13-directives/authuserfile|AuthUserFile]] de s'authentifier lorsque le serveur LDAP est disponible, alors que le compte de l'utilisateur est verrouillé ou que son mot de passe est inutilisable pour une raison quelconque.

## Voir aussi

- [[13-directives/authuserfile|AuthUserFile]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
