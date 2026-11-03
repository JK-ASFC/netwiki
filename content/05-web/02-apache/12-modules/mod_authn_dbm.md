---
title: "mod_authn_dbm"
description: "Module Apache mod_authn_dbm — Authentification utilisateur utilisant des fichiers DBM. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authn_dbm]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Authentification utilisateur utilisant des fichiers DBM |
| **Statut** | Extension |
| **Identificateur** | `authn_dbm_module` |
| **Fichier source** | `mod_authn_dbm.c` |
| **Compatibilité** | Disponible depuis les versions 2.1 et supérieures d'Apache |

## Sommaire

Ce module permet aux frontaux comme [[12-modules/mod_auth_digest|mod_auth_digest]] et [[12-modules/mod_auth_basic|mod_auth_basic]] d'authentifier les utilisateurs en les recherchant dans des fichiers de mots de passe *dbm*. [[12-modules/mod_authn_file|mod_authn_file]] fournit une fonctionnalité similaire.

Lorsqu'on utilise [[12-modules/mod_auth_basic|mod_auth_basic]] ou [[12-modules/mod_auth_digest|mod_auth_digest]], ce module est invoqué en affectant la valeur `dbm` à la directive [[13-directives/authbasicprovider|AuthBasicProvider]] ou [[13-directives/authdigestprovider|AuthDigestProvider]].

## Directives

- [[13-directives/authdbmuserfile|AuthDBMUserFile]]
- [[13-directives/authdbmtype|AuthDBMType]]

## Voir aussi

- [[13-directives/authname|AuthName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
