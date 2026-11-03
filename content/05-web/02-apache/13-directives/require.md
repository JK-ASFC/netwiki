---
title: "Require"
description: "Directive Apache Require (mod_authz_core) — Vérifie si un utilisateur authentifié a une autorisation d'accès accordée par un fournisseur d'autorisation. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authz_core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Vérifie si un utilisateur authentifié a une autorisation d'accès accordée par un fournisseur d'autorisation. |
| **Syntaxe** | `Require [not] nom-entité [nom-entité] ...` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Base |
| **Module** | [[12-modules/mod_authz_core\|mod_authz_core]] |

## Utilisation

Cette directive permet de vérifier si un utilisateur authentifié a l'autorisation d'accès accordée pour un certain fournisseur d'autorisation et en tenant compte de certaines restrictions. [[12-modules/mod_authz_core|mod_authz_core]] met à disposition les fournisseurs d'autorisation génériques suivants :

**`Require all granted`**

L'accès est autorisé sans restriction.

**`Require all denied`**

L'accès est systématiquement refusé.

**`Require env env-var [env-var] ...`**

L'accès n'est autorisé que si l'une au moins des variables d'environnement spécifiées est définie.

**`Require method http-method [http-method] ...`**

L'accès n'est autorisé que pour les méthodes HTTP spécifiées.

**`Require expr expression`**

L'accès est autorisé si *expression* est évalué à vrai.

Voici quelques exemples de syntaxes autorisées par [[12-modules/mod_authz_user|mod_authz_user]], [[12-modules/mod_authz_host|mod_authz_host]] et [[12-modules/mod_authz_groupfile|mod_authz_groupfile]] :

**`Require user identifiant utilisateur [identifiant utilisateur] ...`**

Seuls les utilisateurs spécifiés auront accès à la ressource.

**`Require group nom groupe [nom groupe] ...`**

Seuls les utilisateurs appartenant aux groupes spécifiés auront accès à la ressource.

**`Require valid-user`**

Tous les utilisateurs valides auront accès à la ressource.

**`Require ip 10 172.20 192.168.2`**

Les clients dont les adresses IP font partie des tranches spécifiées auront accès à la ressource.

**`Require forward-dns dynamic.example.org`**

Un client dont l'adresse IP est résolue à partir du nom dynamic.example.org aura l'autorisation d'accès.

D'autres modules d'autorisation comme [[12-modules/mod_authnz_ldap|mod_authnz_ldap]], [[12-modules/mod_authz_dbm|mod_authz_dbm]], [[12-modules/mod_authz_dbd|mod_authz_dbd]], [[12-modules/mod_authz_owner|mod_authz_owner]] et [[12-modules/mod_ssl|mod_ssl]] implémentent des options de la directive Require.

Pour qu'une configuration d'authentification et d'autorisation fonctionne correctement, la directive `Require` doit être accompagnée dans la plupart des cas de directives [[13-directives/authname|AuthName]], [[13-directives/authtype|AuthType]] et [[13-directives/authbasicprovider|AuthBasicProvider]] ou [[13-directives/authdigestprovider|AuthDigestProvider]], ainsi que de directives telles que [[13-directives/authuserfile|AuthUserFile]] et [[13-directives/authgroupfile|AuthGroupFile]] (pour la définition des utilisateurs et des groupes). Exemple :

```apache
AuthType Basic
AuthName "Restricted Resource"
AuthBasicProvider file
AuthUserFile "/web/users"
AuthGroupFile "/web/groups"
Require group admin
```

Les contrôles d'accès appliqués de cette manière sont effectifs pour **toutes** les méthodes. **C'est d'ailleurs ce que l'on souhaite en général.** Si vous voulez n'appliquer les contrôles d'accès qu'à certaines méthodes, tout en laissant les autres méthodes sans protection, placez la directive `Require` dans une section [[13-directives/limit|<Limit>]].

Le résultat de la directive `Require` peut être inversé en utilisant l'option `not`. Comme dans le cas de l'autre directive d'autorisation inversée `<RequireNone>`, si la directive `Require` est inversée, elle ne peut qu'échouer ou produire un résultat neutre ; elle ne peut donc alors pas en soi autoriser une requête.

Dans l'exemple suivant, tous les utilisateurs appartenant aux groupes `alpha` et `beta` ont l'autorisation d'accès, à l'exception de ceux appartenant au groupe `reject`.

```apache
<Directory "/www/docs">
    <RequireAll>
        Require group alpha beta
        Require not group reject
    </RequireAll>
</Directory>
```

Lorsque plusieurs directives `Require` sont placées dans une même [[11-guides/01-generalites/sections-de-configuration|section de configuration]], et ne se trouvent pas dans une autre directive d'autorisation comme [[13-directives/requireall|<RequireAll>]], elles sont implicitement contenues dans une directive [[13-directives/requireany|<RequireAny>]]. Ainsi, la première directive `Require` qui autorise l'accès à un utilisateur autorise l'accès pour l'ensemble de la requête, et les directives `Require` suivantes sont ignorées.

> [!WARNING]
> **Avertissement à propos de la sécurité**
>
> Prettez une attention particulière aux directives d'autorisation définies au sein des sections [[13-directives/location|<Location>]] qui se chevauchent avec des contenus servis depuis le système de fichiers. Par défaut, les configurations définies dans ces [[11-guides/01-generalites/sections-de-configuration|sections]] l'emportent sur les configurations d'autorisations définies au sein des sections [[13-directives/directory|<Directory>]] et [[13-directives/files|<Files>]] sections.
>
> La directive [[13-directives/authmerging|AuthMerging]] permet de contrôler la manière selon laquelle les configurations d'autorisations sont fusionnées au sein des sections précitées.

## Voir aussi

- [[11-guides/02-guides-pratiques/controle-d-acces|Tutoriel du contrôle d'accès]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
