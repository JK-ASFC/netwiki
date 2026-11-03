---
title: "mod_authz_owner"
description: "Module Apache mod_authz_owner — Autorisation basée sur l'appartenance des fichiers. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authz_owner]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autorisation basée sur l'appartenance des fichiers |
| **Statut** | Extension |
| **Identificateur** | `authz_owner_module` |
| **Fichier source** | `mod_authz_owner.c` |
| **Compatibilité** | Disponible depuis les versions 2.1 et supérieures d'Apache |

## Sommaire

Ce module permet de contrôler l'accès aux fichiers en comparant l'identifiant utilisateur ayant servi à l'authentification HTTP (l'identifiant utilisateur web) avec le propriétaire ou le groupe du fichier demandé du point de vue du système de fichiers. Le nom d'utilisateur et le mot de passe doivent déjà avoir été vérifiés par un module d'authentification comme [[12-modules/mod_auth_basic|mod_auth_basic]] ou [[12-modules/mod_auth_digest|mod_auth_digest]]. [[12-modules/mod_authz_owner|mod_authz_owner]] reconnaît deux arguments pour la directive [[13-directives/require|Require]] : `file-owner` et `file-group` :

**`file-owner`**

Le nom d'utilisateur web utilisé pour l'authentification doit correspondre au nom système du propriétaire du fichier demandé. En d'autres termes, si le système indique `jones` comme propriétaire du fichier demandé, le nom d'utilisateur fourni pour l'authentification HTTP doit aussi être `jones`.

**`file-group`**

Le nom du groupe système du fichier demandé doit être présent dans une base de données de groupes fournie, par exemple, par [[12-modules/mod_authz_groupfile|mod_authz_groupfile]] ou [[12-modules/mod_authz_dbm|mod_authz_dbm]], et le nom d'utilisateur web fourni pour l'authentification doit être un membre de ce groupe. Par exemple, si le système indique que le groupe (système) du fichier demandé est `accounts`, le groupe `accounts` doit apparaître dans la base de données des groupes, et le nom d'utilisateur web utilisé pour l'authentification doit être un membre de ce groupe.

> [!NOTE]
> **Note**
>
> Si le module [[12-modules/mod_authz_owner|mod_authz_owner]] est utilisé pour vérifier l'autorisation d'accès à une ressource qui n'est pas vraiment présente dans le système de fichiers (en d'autres termes une ressource virtuelle), il refusera l'accès.
>
> En particulier, il n'accordera jamais l'accès à une ressource du type [[11-guides/01-generalites/negociation-de-contenu|"Vues multiples" (MultiViews) d'un contenu négocié]].

## Exemples de configuration

### Require file-owner

Considérons un serveur Web Apache fonctionnant sous un système multi-utilisateurs, où les fichiers de chaque utilisateur sont stockés dans `~/public_html/private`. En supposant qu'il n'existe qu'une seule base de données contenant les noms d'utilisateurs web, et que ces noms d'utilisateurs correspondent aux noms d'utilisateurs système qui sont les propriétaires effectifs des fichiers, la configuration de l'exemple suivant n'accordera l'autorisation d'accès aux fichiers qu'à leur propriétaire. L'utilisateur `jones` ne sera pas autorisé à accéder aux fichiers situés dans `/home/smith/public_html/private`, à moins que leur propriétaire ne soit `jones` au lieu de `smith`.

```apache
<Directory "/home/*/public_html/private">
    AuthType Basic
    AuthName MyPrivateFiles
    AuthBasicProvider dbm
    AuthDBMUserFile "/usr/local/apache2/etc/.htdbm-all"
    Require file-owner
</Directory>
```

### Require file-group

Considérons un système similaire à celui décrit ci-dessus, mais où certains utilisateurs partagent leurs fichiers de projets dans `~/public_html/project-foo`. Le groupe système des fichiers est `foo`, et il n'existe qu'une seule base de données [[13-directives/authdbmgroupfile|AuthDBMGroupFile]] qui contient tous les noms d'utilisateurs web et leurs groupes d'appartenance. Ces noms d'utilisateurs web doivent alors appartenir au moins au groupe `foo`. En d'autres termes, si `jones` et `smith` sont tous deux membres du groupe `foo`, ils seront autorisés à accéder aux répertoires `project-foo` de chacun d'entre eux.

```apache
<Directory "/home/*/public_html/project-foo">
    AuthType Basic
    AuthName "Project Foo Files"
    AuthBasicProvider dbm

    # combined user/group database
    AuthDBMUserFile  "/usr/local/apache2/etc/.htdbm-all"
    AuthDBMGroupFile "/usr/local/apache2/etc/.htdbm-all"

    Satisfy All
    Require file-group
</Directory>
```

## Voir aussi

- [[13-directives/require|Require]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
