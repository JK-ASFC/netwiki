---
title: "AuthLDAPGroupAttributeIsDN"
description: "Directive Apache AuthLDAPGroupAttributeIsDN (mod_authnz_ldap) — Utilise le DN de l'utilisateur pour vérifier son appartenance à un groupe. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilise le DN de l'utilisateur pour vérifier son appartenance à un groupe |
| **Syntaxe** | `AuthLDAPGroupAttributeIsDN on\|off` |
| **Valeur par défaut** | `AuthLDAPGroupAttributeIsDN on` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Lorsqu'elle est définie à `on`, cette directive indique que c'est le DN de l'utilisateur qui doit être utilisé pour vérifier son appartenance à un groupe. Dans le cas contraire, c'est le nom de l'utilisateur qui sera utilisé. Par exemple, supposons que le client envoie le nom d'utilisateur `bjenson`, qui correspond au DN LDAP `cn=Babs Jenson,o=Example`. Si la directive est à `on`, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] va vérifier si `cn=Babs Jenson, o=Example` est un membre du groupe. Dans le cas contraire, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] vérifiera si `bjenson` est un membre du groupe.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
