---
title: "mod_authn_core"
description: "Module Apache mod_authn_core — Le noyau de l'authentification. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_authn_core]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le noyau de l'authentification |
| **Statut** | Base |
| **Identificateur** | `authn_core_module` |
| **Fichier source** | `mod_authn_core.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

Ce module fournit le coeur des fonctionnalités d'authentification permettant d'accorder ou de refuser l'accès à certaines zones du site web. Les directives fournies par le module [[12-modules/mod_authn_core|mod_authn_core]] sont communes à tous les fournisseurs d'authentification.

## Création d'alias de fournisseurs d'authentification

Il est possible de créer des fournisseurs d'authentification étendus dans le fichier de configuration et de leur assigner un alias. Le fournisseur ainsi nommé peut alors être référencé à l'aide des directives [[13-directives/authbasicprovider|AuthBasicProvider]] ou [[13-directives/authdigestprovider|AuthDigestProvider]] tout comme un fournisseur d'authentification de base. Outre la possibilité de créer et attribuer un alias à un fournisseur étendu, le même fournisseur d'authentification peut aussi être référencé par plusieurs sections relatives à une zone du site web.

### Exemples

Cet exemple vérifie les mots de passe dans deux fichiers textes différents.

**Vérification dans plusieurs fichiers de mots de passe au format texte**

```apache
# Première vérification
<AuthnProviderAlias file file1>
    AuthUserFile "/www/conf/passwords1"
</AuthnProviderAlias>

# Vérification suivante
<AuthnProviderAlias file file2>
    AuthUserFile "/www/conf/passwords2"
</AuthnProviderAlias>

<Directory "/var/web/pages/secure">
    AuthBasicProvider file1 file2

    AuthType Basic
    AuthName "Protected Area"
    Require valid-user
</Directory>
```

Dans l'exemple ci-dessous, deux fournisseurs d'authentification ldap sont créés à partir du fournisseur ldap de base, et se voient attribuer un alias. L'authentification d'une même zone peut alors être traitée par plusieurs serveurs ldap :

**Vérification auprès de plusieurs serveurs LDAP**

```apache
<AuthnProviderAlias ldap ldap-alias1>
    AuthLDAPBindDN cn=youruser,o=ctx
    AuthLDAPBindPassword yourpassword
    AuthLDAPURL ldap://ldap.host/o=ctx
    </AuthnProviderAlias>
    <AuthnProviderAlias ldap ldap-other-alias>
    AuthLDAPBindDN cn=yourotheruser,o=dev
    AuthLDAPBindPassword yourotherpassword
    AuthLDAPURL ldap://other.ldap.host/o=dev?cn
</AuthnProviderAlias>

Alias "/secure" "/webpages/secure"
<Directory "/webpages/secure">

    AuthBasicProvider ldap-other-alias  ldap-alias1

    AuthType Basic
    AuthName LDAP_Protected Place
    Require valid-user
    # Notez que Require ldap-* ne fonctionnerait pas ici, car
    # AuthnProviderAlias ne fournit pas de configuration pour les
    # fournisseurs d'autorisation implémentés dans le même module que le
    # fournisseur d'authentification.
</Directory>
```

## Directives

- [[13-directives/authname|AuthName]]
- [[13-directives/authtype|AuthType]]
- [[13-directives/authnprovideralias|<AuthnProviderAlias>]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
