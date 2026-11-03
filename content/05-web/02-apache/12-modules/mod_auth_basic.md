---
title: "mod_auth_basic"
description: "Module Apache mod_auth_basic — Authentification HTTP de base. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_auth_basic]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Authentification HTTP de base |
| **Statut** | Base |
| **Identificateur** | `auth_basic_module` |
| **Fichier source** | `mod_auth_basic.c` |
| **Compatibilité** | Disponible depuis la version 2.1 d'Apache |

## Sommaire

Ce module permet d'utiliser l'authentification basique HTTP pour restreindre l'accès en recherchant les utilisateurs dans les fournisseurs d'authentification spécifiés. Il est en général combiné avec au moins un module d'authentification comme [[12-modules/mod_authn_file|mod_authn_file]] et un module d'autorisation comme [[12-modules/mod_authz_user|mod_authz_user]]. L'authentification HTTP à base de condensé (digest), quant à elle, est fournie par le module [[12-modules/mod_auth_digest|mod_auth_digest]].

## Directives

- [[13-directives/authbasicprovider|AuthBasicProvider]]
- [[13-directives/authbasicauthoritative|AuthBasicAuthoritative]]
- [[13-directives/authbasicfake|AuthBasicFake]]
- [[13-directives/authbasicusedigestalgorithm|AuthBasicUseDigestAlgorithm]]

## Voir aussi

- [[13-directives/authname|AuthName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
