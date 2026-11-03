---
title: "LDAPReferralHopLimit"
description: "Directive Apache LDAPReferralHopLimit (mod_ldap) — Le nombre maximum de redirections vers des serveurs alternatifs (referrals) avant l'abandon de la requête LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le nombre maximum de redirections vers des serveurs alternatifs (referrals) avant l'abandon de la requête LDAP. |
| **Syntaxe** | `LDAPReferralHopLimit nombre` |
| **Valeur par défaut** | `Dépend du SDK, en général entre 5 et 10` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Si elle est activée par la directive [[13-directives/ldapreferrals|LDAPReferrals]], cette directive permet de définir le nombre maximum de sauts vers des serveurs alternatifs (referrals) avant l'abandon de la requête LDAP.

> [!WARNING]
> L'ajustement de ce paramètre n'est pas commun à tous les SDKs LDAP.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
