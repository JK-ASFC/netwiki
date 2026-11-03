---
title: "AuthLDAPCompareAsUser"
description: "Directive Apache AuthLDAPCompareAsUser (mod_authnz_ldap) — Utilisation des données d'authentification de l'utilisateur pour effectuer les comparaisons pour l'attribution des autorisations. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilisation des données d'authentification de l'utilisateur pour effectuer les comparaisons pour l'attribution des autorisations |
| **Syntaxe** | `AuthLDAPCompareAsUser on\|off` |
| **Valeur par défaut** | `AuthLDAPCompareAsUser off` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |
| **Compatibilité** | Disponible depuis la version version 2.3.6 |

## Utilisation

Lorsque cette directive est définie, et si [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] a authentifié l'utilisateur, les recherches LDAP pour les autorisations utilisent le nom distinctif trouvé (DN) et le mot de passe d'authentification basique HTTP de l'utilisateur authentifié au lieu des données d'authentification configurées au niveau du serveur.

Les vérifications d'autorisation `ldap-attribute`, `ldap-user`, et `ldap-group` (niveau simple seulement) utilisent des comparaisons.

Cette directive n'a d'effet sur les comparaisons effectuées au cours des traitements de groupe imbriqués, et lorsque la directive [[13-directives/authldapsearchasuser|AuthLDAPSearchAsUser]] est aussi activée.

Cette directive ne doit être utilisée que si votre serveur LDAP n'autorise pas les recherches anonymes, ou si vous ne pouvez pas utiliser de nom d'utilisateur dédié via la directive [[13-directives/authldapbinddn|AuthLDAPBindDN]].

## Voir aussi

- [[13-directives/authldapinitialbindasuser|AuthLDAPInitialBindAsUser]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
