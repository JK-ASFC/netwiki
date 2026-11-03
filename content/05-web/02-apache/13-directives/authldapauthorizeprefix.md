---
title: "AuthLDAPAuthorizePrefix"
description: "Directive Apache AuthLDAPAuthorizePrefix (mod_authnz_ldap) — Spécifie le préfixe ajouté aux variables d'environnement durant la phase d'autorisation. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le préfixe ajouté aux variables d'environnement durant la phase d'autorisation |
| **Syntaxe** | `AuthLDAPAuthorizePrefix préfixe` |
| **Valeur par défaut** | `AuthLDAPAuthorizePrefix AUTHORIZE_` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |
| **Compatibilité** | Disponible depuis la version 2.3.6 |

## Utilisation

Cette directive permet de spécifier le préfixe ajouté aux variables d'environnement durant la phase d'autorisation. Si la valeur spécifiée est `AUTHENTICATE_`, les utilisateurs de ces variables d'environnement verront les mêmes informations, que le serveur effectue une authentification, une autorisation, ou les deux.

> [!NOTE]
> **Note**
>
> Aucune variable d'autorisation n'est définie lorsqu'un utilisateur s'est vu autoriser l'accès via la directive `Require valid-user`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
