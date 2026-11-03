---
title: "AuthLDAPSubGroupClass"
description: "Directive Apache AuthLDAPSubGroupClass (mod_authnz_ldap) — Spécifie quelles valeurs d'objectClass LDAP identifient les objets de l'annuaire qui sont des groupes au cours du traitement des sous-groupes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie quelles valeurs d'objectClass LDAP identifient les objets de l'annuaire qui sont des groupes au cours du traitement des sous-groupes. |
| **Syntaxe** | `AuthLDAPSubGroupClass ObjectClass-LDAP` |
| **Valeur par défaut** | `AuthLDAPSubGroupClass groupOfNames groupOfUniqueNames` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |
| **Compatibilité** | Disponible à partir de la version 2.3.0 du serveur HTTP Apache |

## Utilisation

Un objet groupe LDAP peut contenir des membres qui sont des utilisateurs et des membres qui sont eux-mêmes des groupes (appelés sous-groupes ou groupes imbriqués). La directive [[13-directives/authldapsubgroupattribute|AuthLDAPSubGroupAttribute]] permet d'identifier les membres qui sont des sous-groupes du groupe courant (à l'opposé des membres utilisateurs). La directive `AuthLDAPSubGroupClass` permet de spécifier les valeurs d'objectClass LDAP utilisées pour vérifier que certains membres sont en fait des objets groupe. Les sous-groupes ainsi identifiés peuvent alors faire l'objet d'une recherche d'autres membres utilisateurs ou sous-groupes. On peut spécifier plusieurs attributs en répétant cette directive plusieurs fois. Si cette directive n'est pas définie, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] utilise les attributs `groupOfNames` et `groupOfUniqueNames`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
