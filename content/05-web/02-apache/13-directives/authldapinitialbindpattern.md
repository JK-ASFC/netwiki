---
title: "AuthLDAPInitialBindPattern"
description: "Directive Apache AuthLDAPInitialBindPattern (mod_authnz_ldap) — Spécifie la modification a apporter au nom d'utilisateur pour l'authentification de base lors de l'authentification auprès du serveur LDAP pour effectuer une recherche de DN. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie la modification a apporter au nom d'utilisateur pour l'authentification de base lors de l'authentification auprès du serveur LDAP pour effectuer une recherche de DN |
| **Syntaxe** | `AuthLDAPInitialBindPattern regex substitution` |
| **Valeur par défaut** | `AuthLDAPInitialBindPattern (.*) $1 (nom de l'utilisateur distant utilisé tel quel)` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |
| **Compatibilité** | Disponible depuis la version 2.3.6 |

## Utilisation

Si la directive [[13-directives/authldapinitialbindasuser|AuthLDAPInitialBindAsUser]] est définie à `ON`, le nom utilisateur pour l'authentification de base sera transformé selon l'expression rationnelle *regex* et l'argument *substitution* spécifiés.

L'expression rationnelle est comparée au nom d'utilisateur pour l'authentification de base courant. L'argument *substitution* peut contenir des références arrières, mais n'effectue aucune autre interpolation de variable.

Cette directive ne doit être utilisée que si votre serveur LDAP n'autorise pas les recherches anonymes, ou si vous ne pouvez pas utiliser de nom d'utilisateur dédié via la directive [[13-directives/authldapbinddn|AuthLDAPBindDN]].

```apache
AuthLDAPInitialBindPattern (.+) $1@example.com
```

```apache
AuthLDAPInitialBindPattern (.+) cn=$1,dc=example,dc=com
```

> [!NOTE]
> **Non disponible dans la cas d'une autorisation seule**
>
> On ne peut utiliser cette directive que si ce module effectue une authentification, et n'a aucun effet si ce module n'est utilisé que pour les processus d'autorisation.

> [!NOTE]
> **Débogage**
>
> Le DN de substitution est enregistré dans la variable d'environnement `LDAP_BINDASUSER`. Si l'expression rationnelle ne convient pas, le nom d'utilisateur est utilisé tel quel.

## Voir aussi

- [[13-directives/authldapinitialbindasuser|AuthLDAPInitialBindAsUser]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
