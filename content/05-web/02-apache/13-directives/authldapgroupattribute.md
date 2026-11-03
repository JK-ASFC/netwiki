---
title: "AuthLDAPGroupAttribute"
description: "Directive Apache AuthLDAPGroupAttribute (mod_authnz_ldap) — L'attribut LDAP utilisé pour vérifier l'appartenance d'un utilisateur à un groupe. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'attribut LDAP utilisé pour vérifier l'appartenance d'un utilisateur à un groupe. |
| **Syntaxe** | `AuthLDAPGroupAttribute attribut` |
| **Valeur par défaut** | `AuthLDAPGroupAttribute member uniqueMember` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Cette directive permet de spécifier quel attribut LDAP est utilisé pour vérifier l'appartenance d'un utilisateur à un groupe. On peut spécifier plusieurs attributs en répétant cette directive plusieurs fois. Si la directive n'est pas définie, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] utilise les attributs `member` et `uniqueMember`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
