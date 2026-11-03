---
title: "LDAPTrustedMode"
description: "Directive Apache LDAPTrustedMode (mod_ldap) — Spécifie le mode (SSL ou TLS) à utiliser lors de la connexion à un serveur LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le mode (SSL ou TLS) à utiliser lors de la connexion à un serveur LDAP. |
| **Syntaxe** | `LDAPTrustedMode type` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Les modes suivants sont supportés :

- NONE - aucun chiffrement
- SSL - chiffrement ldaps:// sur le port par défaut 636
- TLS - chiffrement STARTTLS sur le port par défaut 389

Les modes ci-dessus ne sont pas supportés par tous les SDK LDAP. Un message d'erreur sera généré à l'exécution si un mode n'est pas supporté, et la connexion au serveur LDAP échouera.

Si une URL de type ldaps:// est spécifiée, le mode est forcé à SSL et la définition de `LDAPTrustedMode` est ignorée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
