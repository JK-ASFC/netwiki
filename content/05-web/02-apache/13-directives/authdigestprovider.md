---
title: "AuthDigestProvider"
description: "Directive Apache AuthDigestProvider (mod_auth_digest) — Définit le(s) fournisseurs(s) d'authentification pour la zone du site web concernée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_digest]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le(s) fournisseurs(s) d'authentification pour la zone du site web concernée |
| **Syntaxe** | `AuthDigestProvider nom fournisseur [nom fournisseur] ...` |
| **Valeur par défaut** | `AuthDigestProvider file` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_auth_digest\|mod_auth_digest]] |

## Utilisation

La directive `AuthDigestProvider` permet de définir quel fournisseur d'authentification sera utilisé pour authentifier les utilisateurs pour la zone du site web concernée. Assurez-vous que le module implémentant le fournisseur d'authentification choisi soit bien présent dans le serveur. Le fournisseur par défaut `file` est implémenté par le module [[12-modules/mod_authn_file|mod_authn_file]].

Voir [[12-modules/mod_authn_dbm|mod_authn_dbm]], [[12-modules/mod_authn_file|mod_authn_file]], [[12-modules/mod_authn_dbd|mod_authn_dbd]] et [[12-modules/mod_authn_socache|mod_authn_socache]] pour la liste des fournisseurs disponibles.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
