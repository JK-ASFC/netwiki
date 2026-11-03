---
title: "AuthnzFcgiDefineProvider"
description: "Directive Apache AuthnzFcgiDefineProvider (mod_authnz_fcgi) — Définit une application FastCGI en tant que fournisseur d'authentification et/ou autorisation. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_fcgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une application FastCGI en tant que fournisseur d'authentification et/ou autorisation |
| **Syntaxe** | `AuthnzFcgiDefineProvider type provider-name backend-address` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_fcgi\|mod_authnz_fcgi]] |

## Utilisation

Cette directive permet de définir une application FastCGI en tant que fournisseur pour une phase particulière d'authentification ou d'autorisation.

***type***

Les valeurs de ce paramètre sont *authn* pour l'authentification, *authz* pour l'autorisation, ou *authnz* pour un fournisseur d'autorisation générique FastCGI qui effectue les deux vérifications.

***provider-name***

Ce paramètre permet d'associer un nom au fournisseur ; ce nom pourra être utilisé dans des directives comme [[13-directives/authbasicprovider|AuthBasicProvider]] et [[13-directives/require|Require]].

***backend-address***

Ce paramètre permet de spécifier l'adresse de l'application sous la forme *fcgi://hostname:port/*. Le ou les processus de l'application doivent être gérés indépendamment comme avec [[10-commandes/fcgistarter|fcgistarter]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
