---
title: "mod_authz_user"
description: "Module Apache mod_authz_user — Autorisation basée sur l'utilisateur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authz_user]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autorisation basée sur l'utilisateur |
| **Statut** | Base |
| **Identificateur** | `authz_user_module` |
| **Fichier source** | `mod_authz_user.c` |
| **Compatibilité** | Disponible depuis les versions 2.1 et supérieures d'Apache |

## Sommaire

Ce module permet d'accorder ou de refuser l'accès à certaines zones du site web aux utilisateurs authentifiés. [[12-modules/mod_authz_user|mod_authz_user]] accorde l'accès si l'utilisateur authentifié fait partie de la liste spécifiée par une directive `Require user`. On peut aussi utiliser la directive `Require valid-user` pour accorder l'accès à tous les utilisateurs qui ont été authentifiés avec succès.

## The Require Directives

Les directives [[13-directives/require|Require]] d'Apache permettent, au cours de la phase d'autorisation, de s'assurer qu'un utilisateur est bien autorisé à accéder à une ressource. mod\_authz\_user ajoute les types d'autorisation `user` et `valid-user`.

A partir de la version 2.4.8, les directives require user supportent les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]].

### Require user

Cette directive permet de spécifier une liste d'utilisateurs autorisés à accéder à la ressource.

```apache
Require user john paul george ringo
```

### Require valid-user

Lorsque cette directive est définie, tout utilisateur qui s'est authentifié avec succès aura l'autorisation d'accès à la ressource.

```apache
Require valid-user
```

## Voir aussi

- [[13-directives/require|Require]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
