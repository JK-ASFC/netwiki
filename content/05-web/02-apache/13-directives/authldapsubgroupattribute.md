---
title: "AuthLDAPSubGroupAttribute"
description: "Directive Apache AuthLDAPSubGroupAttribute (mod_authnz_ldap) — Spécifie les noms d'attribut, un par directive, utilisés pour différencier les membres du groupe courant qui sont eux-mêmes des groupes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie les noms d'attribut, un par directive, utilisés pour différencier les membres du groupe courant qui sont eux-mêmes des groupes. |
| **Syntaxe** | `AuthLDAPSubGroupAttribute attribut` |
| **Valeur par défaut** | `AuthLDAPSubgroupAttribute member uniqueMember` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |
| **Compatibilité** | Disponible à partir de la version 2.3.0 du serveur HTTP Apache |

## Utilisation

Un objet groupe LDAP peut contenir des membres qui sont des utilisateurs et des membres qui sont eux-mêmes des groupes (appelés sous-groupes ou groupes imbriqués). La directive `AuthLDAPSubGroupAttribute` spécifie l'attribut utilisé pour identifier les groupes, alors que la directive [[13-directives/authldapgroupattribute|AuthLDAPGroupAttribute]] spécifie l'attribut utilisé pour identifier les utilisateurs. On peut spécifier plusieurs attributs en répétant la directive plusieurs fois. Si elle n'est pas définie, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] utilise les attributs `member` et `uniqueMember`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
