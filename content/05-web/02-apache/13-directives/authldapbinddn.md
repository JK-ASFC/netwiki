---
title: "AuthLDAPBindDN"
description: "Directive Apache AuthLDAPBindDN (mod_authnz_ldap) — Un DN optionnel pour se connecter au serveur LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Un DN optionnel pour se connecter au serveur LDAP |
| **Syntaxe** | `AuthLDAPBindDN dn` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Cette directive permet de définir un DN optionnel pour se connecter au serveur afin d'y rechercher des entrées. Si aucun DN n'est spécifié, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] tentera une connexion anonyme.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
