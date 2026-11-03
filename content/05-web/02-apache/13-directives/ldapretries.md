---
title: "LDAPRetries"
description: "Directive Apache LDAPRetries (mod_ldap) — Définit le nombre maximum de tentatives de connexions au serveur LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nombre maximum de tentatives de connexions au serveur LDAP. |
| **Syntaxe** | `LDAPRetries nombre d'essais` |
| **Valeur par défaut** | `LDAPRetries 3` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Suite à des échecs de connexion au serveur LDAP, le serveur tentera de se connecter autant de fois qu'indiqué par la directive `LDAPRetries`. Si cette directive est définie à 0, le serveur ne tentera pas d'autre connexion après un échec.

Il est possible d'effectuer une autre tentative de connexion en cas d'erreurs LDAP du type délai dépassé ou connexion refusée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
