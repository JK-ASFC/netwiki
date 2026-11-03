---
title: "mod_authz_groupfile"
description: "Module Apache mod_authz_groupfile — Autorisation basée sur les groupes à l'aide de fichiers textes. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authz_groupfile]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autorisation basée sur les groupes à l'aide de fichiers textes |
| **Statut** | Base |
| **Identificateur** | `authz_groupfile_module` |
| **Fichier source** | `mod_authz_groupfile.c` |
| **Compatibilité** | Disponible depuis les versions 2.1 et supérieures d'Apache |

## Sommaire

Ce module permet d'autoriser ou d'interdire l'accès à certaines zones du site web aux utilisateurs authentifiés en fonction de leur appartenance à un groupe spécifié. Le module [[12-modules/mod_authz_dbm|mod_authz_dbm]] fournit une fonctionnalité similaire.

## Les directives Require

Les directives [[13-directives/require|Require]] d'Apache permettent, au cours de la phase d'autorisation, de s'assurer qu'un utilisateur est bien autorisé à accéder à une ressource. mod\_authz\_groupfile ajoute les types d'autorisation `group` et `file-group`.

A partir de la version 2.4.8, les directives require groupfile supportent les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]].

### Require group

Cette directive permet de spécifier à quel groupe un utilisateur doit appartenir pour obtenir l'autorisation d'accès.

```apache
Require group admin
```

### Require file-group

Lorsque cette directive est définie, Les permissions système du fichier auquel on veut accéder sont vérifiées. L'utilisateur doit être un membre d'un groupe de même nom que le groupe qui possède le fichier. Voir [[12-modules/mod_authz_owner|mod_authz_owner]] pour plus de détails.

```apache
Require file-group
```

## Directives

- [[13-directives/authgroupfile|AuthGroupFile]]

## Voir aussi

- [[13-directives/require|Require]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
