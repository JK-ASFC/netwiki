---
title: "AuthLDAPCompareDNOnServer"
description: "Directive Apache AuthLDAPCompareDNOnServer (mod_authnz_ldap) — Utilise le serveur LDAP pour comparer les DNs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_authnz_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Utilise le serveur LDAP pour comparer les DNs |
| **Syntaxe** | `AuthLDAPCompareDNOnServer on\|off` |
| **Valeur par défaut** | `AuthLDAPCompareDNOnServer on` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_authnz_ldap\|mod_authnz_ldap]] |

## Utilisation

Lorsque cette directive est définie à on, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] utilise le serveur LDAP pour comparer les DNs. Il s'agit de la seule méthode infaillible pour comparer les DNs. [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] va rechercher dans l'annuaire le DN spécifié par la directive `Require dn`, puis extraire ce DN et le comparer avec le DN extrait de l'entrée de l'utilisateur. Si cette directive est à off, [[12-modules/mod_authnz_ldap|mod_authnz_ldap]] effectue une simple comparaison de chaînes. Cette dernière approche peut produire des faux négatifs, mais elle est beaucoup plus rapide. Notez cependant que le cache de [[12-modules/mod_ldap|mod_ldap]] peut accélérer la comparaison de DNs dans la plupart des situations.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
