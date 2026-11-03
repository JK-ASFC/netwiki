---
title: "mod_authn_file"
description: "Module Apache mod_authn_file — Authentification utilisateur à l'aide de fichiers texte. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authn_file]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Authentification utilisateur à l'aide de fichiers texte |
| **Statut** | Base |
| **Identificateur** | `authn_file_module` |
| **Fichier source** | `mod_authn_file.c` |
| **Compatibilité** | Disponible depuis les versions 2.1 et supérieures d'Apache |

## Sommaire

Ce module permet aux frontaux d'authentification comme [[12-modules/mod_auth_digest|mod_auth_digest]] et [[12-modules/mod_auth_basic|mod_auth_basic]] d'authentifier les utilisateurs en les recherchant dans des fichiers de mots de passe au format texte. [[12-modules/mod_authn_dbm|mod_authn_dbm]] fournit une fonctionnalité similaire.

Lorsqu'on utilise [[12-modules/mod_auth_basic|mod_auth_basic]] ou [[12-modules/mod_auth_digest|mod_auth_digest]], ce module peut être invoqué en affectant la valeur `file` à la directive [[13-directives/authbasicprovider|AuthBasicProvider]] ou [[13-directives/authdigestprovider|AuthDigestProvider]].

## Directives

- [[13-directives/authuserfile|AuthUserFile]]

## Voir aussi

- [[13-directives/authbasicprovider|AuthBasicProvider]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
