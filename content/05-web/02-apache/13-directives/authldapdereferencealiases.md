---
title: "AuthLDAPDereferenceAliases"
description: "Directive Apache AuthLDAPDereferenceAliases (mod_authnz_ldap) — À quel moment le module va déréférencer les alias. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | À quel moment le module va déréférencer les alias |
| **Syntaxe** | `AuthLDAPDereferenceAliases never\|searching\|finding\|always` |
| **Valeur par défaut** | `AuthLDAPDereferenceAliases always` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Cette directive permet de spécifier à quel moment [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] va déréférencer les alias au cours des opérations liées à LDAP. La valeur par défaut est `always`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
