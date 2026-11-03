---
title: "AuthFormProvider"
description: "Directive Apache AuthFormProvider (mod_auth_form) — Définit le(s) fournisseur(s) d'authentification pour la zone concernée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_form]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le(s) fournisseur(s) d'authentification pour la zone concernée |
| **Syntaxe** | `AuthFormProvider nom fournisseur [nom fournisseur] ...` |
| **Valeur par défaut** | `AuthFormProvider file` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_auth_form\|mod_auth_form]] |

## Utilisation

La directive `AuthFormProvider` permet de définir quel fournisseur sera utilisé pour authentifier les utilisateurs pour la zone concernée. Le fournisseur par défaut `file` est implémenté par le module [[12-modules/mod_authn_file|mod_authn_file]]. Assurez-vous que le fournisseur choisi soit bien présent dans le serveur.

**Exemple**

```apache
<Location "/secure">
    AuthType form
    AuthName "private area"
    AuthFormProvider  dbm
    AuthDBMType        SDBM
    AuthDBMUserFile    "/www/etc/dbmpasswd"
    Require            valid-user
    #...
</Location>
```

Les différents fournisseurs sont implémentés par les modules [[12-modules/mod_authn_dbm|mod_authn_dbm]], [[12-modules/mod_authn_file|mod_authn_file]], [[12-modules/mod_authn_dbd|mod_authn_dbd]] et [[12-modules/mod_authnz_ldap|mod_authnz_ldap]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
