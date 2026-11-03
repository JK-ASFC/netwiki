---
title: "AuthLDAPMaxSubGroupDepth"
description: "Directive Apache AuthLDAPMaxSubGroupDepth (mod_authnz_ldap) — Spécifie la profondeur d'imbrication des sous-groupes maximale prise en compte avant l'abandon de la recherche de l'utilisateur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie la profondeur d'imbrication des sous-groupes maximale prise en compte avant l'abandon de la recherche de l'utilisateur. |
| **Syntaxe** | `AuthLDAPMaxSubGroupDepth Nombre` |
| **Valeur par défaut** | `AuthLDAPMaxSubGroupDepth 10` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |
| **Compatibilité** | Disponible à partir de la version 2.3.0 du serveur HTTP Apache |

## Utilisation

Lorsque cette directive est définie à une valeur `X` non nulle, en combinaison avec l'utilisation de la directive `Require ldap-group DN-groupe`, les données de connexion fournies seront utilisées pour vérifier l'appartenance de l'utilisateur à l'objet de l'annuaire `DN-groupe` ou à tout sous-groupe du groupe courant en tenant compte de la profondeur d'imbrication maximale `X` spécifiée par la directive.

Se référer à la section `Require ldap-group` pour un exemple plus détaillé.

> [!NOTE]
> **Performances dans le cas des groupes imbriqués**
>
> Lorsque les directives `AuthLDAPSubGroupAttribute` et `AuthLDAPGroupAttribute` se recouvrent (comme c'est le cas par défaut et requis par les schémas LDAP courants), la recherche de sous-groupes au sein de grands groupes peut être très longue. Si vos groupes sont très grands et non imbriqués, définissez la directive `AuthLDAPMaxSubGroupDepth` à 0.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
