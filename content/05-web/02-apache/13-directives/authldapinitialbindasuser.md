---
title: "AuthLDAPInitialBindAsUser"
description: "Directive Apache AuthLDAPInitialBindAsUser (mod_authnz_ldap) — Détermine si le serveur effectue la recherche initiale du DN en utilisant le nom propre de l'utilisateur pour l'authentification de base et non de manière anonyme, ou en utilisant des données d'authentification codées en dur pour le serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si le serveur effectue la recherche initiale du DN en utilisant le nom propre de l'utilisateur pour l'authentification de base et non de manière anonyme, ou en utilisant des données d'authentification codées en dur pour le serveur |
| **Syntaxe** | `AuthLDAPInitialBindAsUser off\|on` |
| **Valeur par défaut** | `AuthLDAPInitialBindAsUser off` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |
| **Compatibilité** | Disponible depuis la version 2.3.6 |

## Utilisation

Par défaut, le serveur convertit le nom d'utilisateur pour l'authentification de base en nom distinctif LDAP (DN) soit de manière anonyme, soit avec un couple nom/mot de passe dédié. Cette directive permet de forcer le serveur à utiliser les véritables nom d'utilisateur et mot de passe fournis par l'utilisateur pour effectuer la recherche initiale du DN.

Si le nom d'utilisateur ne peut pas s'authentifier directement et nécessite de légères modifications, voir la directive [[13-directives/authldapinitialbindpattern|AuthLDAPInitialBindPattern]].

Cette directive ne doit être utilisée que si votre serveur LDAP n'autorise pas les recherches anonymes, ou si vous ne pouvez pas utiliser de nom d'utilisateur dédié via la directive [[13-directives/authldapbinddn|AuthLDAPBindDN]].

> [!NOTE]
> **Non disponible dans la cas d'une autorisation seule**
>
> On ne peut utiliser cette directive que si ce module effectue une authentification, et n'a aucun effet si ce module n'est utilisé que pour les processus d'autorisation.

## Voir aussi

- [[13-directives/authldapinitialbindpattern|AuthLDAPInitialBindPattern]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
