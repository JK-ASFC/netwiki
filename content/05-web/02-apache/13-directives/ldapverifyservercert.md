---
title: "LDAPVerifyServerCert"
description: "Directive Apache LDAPVerifyServerCert (mod_ldap) — Force la vérification du certificat du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Force la vérification du certificat du serveur |
| **Syntaxe** | `LDAPVerifyServerCert On\|Off` |
| **Valeur par défaut** | `LDAPVerifyServerCert On` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive permet de spécifier s'il faut forcer la vérification d'un certificat de serveur lors de l'établissement d'une connexion SSL avec un serveur LDAP.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
