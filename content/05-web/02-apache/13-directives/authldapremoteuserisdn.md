---
title: "AuthLDAPRemoteUserIsDN"
description: "Directive Apache AuthLDAPRemoteUserIsDN (mod_authnz_ldap) — Utilise le DN de l'utilisateur pour définir la variable d'environnement REMOTE_USER. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilise le DN de l'utilisateur pour définir la variable d'environnement REMOTE\_USER |
| **Syntaxe** | `AuthLDAPRemoteUserIsDN on\|off` |
| **Valeur par défaut** | `AuthLDAPRemoteUserIsDN off` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Lorsque cette directive est à on, la variable d'environnement `REMOTE_USER` sera définie avec la valeur du DN complet de l'utilisateur authentifié, et non plus avec simplement le nom d'utilisateur fourni par le client. Elle est définie à off par défaut.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
