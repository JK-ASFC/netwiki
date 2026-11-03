---
title: "mod_authz_dbm"
description: "Module Apache mod_authz_dbm — Autorisation basée sur les groupes à l'aide de fichiers DBM. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authz_dbm]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autorisation basée sur les groupes à l'aide de fichiers DBM |
| **Statut** | Extension |
| **Identificateur** | `authz_dbm_module` |
| **Fichier source** | `mod_authz_dbm.c` |
| **Compatibilité** | Disponible depuis les versions 2.1 et supérieures d'Apache |

## Sommaire

Ce module permet d'autoriser ou d'interdire l'accès à certaines zones du site web aux utilisateurs authentifiés en fonction de leur appartenance à un groupe spécifié. Le module [[12-modules/mod_authz_groupfile|mod_authz_groupfile]] fournit une fonctionnalité similaire.

## The Require Directives

Les directives [[13-directives/require|Require]] d'Apache permettent, au cours de la phase d'autorisation, de s'assurer qu'un utilisateur est bien autorisé à accéder à une ressource. mod\_authz\_dbm ajoute les types d'autorisation `dbm-group` et `dbm-file-group`.

A partir de la version 2.4.8, les directives require DBM supportent les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]].

### Require dbm-group

Cette directive permet de spécifier à quel groupe un utilisateur doit appartenir pour obtenir l'autorisation d'accès.

```apache
Require dbm-group admin
```

### Require dbm-file-group

Lorsque cette directive est définie, l'utilisateur doit appartenir au groupe du fichier pour pouvoir y accéder.

```apache
Require dbm-file-group
```

## Exemple d'utilisation

*Notez que si vous utilisez mod\_authz\_dbm, le mot-clé pour les groupes d'authentification qui était auparavant `group` est maintenant `dbm-group` :*

```apache
<Directory "/foo/bar">
  AuthType Basic
  AuthName "Secure Area"
  AuthBasicProvider dbm
  AuthDBMUserFile "site/data/users"
  AuthDBMGroupFile "site/data/users"
  Require dbm-group admin
</Directory>
```

## Directives

- [[13-directives/authdbmgroupfile|AuthDBMGroupFile]]
- [[13-directives/authzdbmtype|AuthzDBMType]]

## Voir aussi

- [[13-directives/require|Require]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
