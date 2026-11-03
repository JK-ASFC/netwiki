---
title: "LDAPRetryDelay"
description: "Directive Apache LDAPRetryDelay (mod_ldap) — Définit le temps d'attente avant un autre essai de connexion au serveur LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le temps d'attente avant un autre essai de connexion au serveur LDAP. |
| **Syntaxe** | `LDAPRetryDelay secondes` |
| **Valeur par défaut** | `LDAPRetryDelay 0` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Si la directive `LDAPRetryDelay` est définie à une valeur différente de 0, le serveur attendra pendant la durée spécifiée pour envoyer à nouveau sa requête LDAP. Une valeur de 0 implique une absence de délai pour les essais successifs.

Il est possible d'effectuer une autre tentative de connexion en cas d'erreurs LDAP du type délai dépassé ou connexion refusée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
