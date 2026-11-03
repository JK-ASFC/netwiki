---
title: "AuthBasicProvider"
description: "Directive Apache AuthBasicProvider (mod_auth_basic) — Définit le(les) fournisseur(s) d'authentification pour cette zone du site web. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_basic]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le(les) fournisseur(s) d'authentification pour cette zone du site web |
| **Syntaxe** | `AuthBasicProvider nom fournisseur [nom fournisseur] ...` |
| **Valeur par défaut** | `AuthBasicProvider file` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_basic\|mod_auth_basic]] |

## Utilisation

La directive `AuthBasicProvider` permet de définir le fournisseur utilisé pour authentifier les utilisateurs pour la zone du site web concernée. Le fournisseur par défaut `file` est implémenté par le module [[12-modules/mod_authn_file|mod_authn_file]]. Assurez-vous que le module implémentant le fournisseur choisi soit bien présent dans le serveur.

**Exemple**

```apache
<Location "/secure">
    AuthType basic
    AuthName "private area"
    AuthBasicProvider  dbm
    AuthDBMType        SDBM
    AuthDBMUserFile    "/www/etc/dbmpasswd"
    Require            valid-user
</Location>
```

Les fournisseurs sont sollicités dans l'ordre jusqu'à ce que l'un d'entre eux trouve une correspondance pour le nom d'utilisateur de la requête ; alors, ce dernier fournisseur sera le seul à vérifier le mot de passe. Un échec dans la vérification du mot de passe n'entraîne pas le passage du contrôle au fournisseur suivant.

Les différents fournisseurs disponibles sont implémentés par les modules [[12-modules/mod_authn_dbm|mod_authn_dbm]], [[12-modules/mod_authn_file|mod_authn_file]], [[12-modules/mod_authn_dbd|mod_authn_dbd]], [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] et [[12-modules/mod_authn_socache|mod_authn_socache]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
