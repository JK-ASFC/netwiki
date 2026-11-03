---
title: "LDAPSharedCacheSize"
description: "Directive Apache LDAPSharedCacheSize (mod_ldap) — Taille en octets du cache en mémoire partagée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille en octets du cache en mémoire partagée |
| **Syntaxe** | `LDAPSharedCacheSize octets` |
| **Valeur par défaut** | `LDAPSharedCacheSize 500000` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive permet de spécifier le nombre d'octets à allouer pour le cache en mémoire partagée. La valeur par défaut est 500kb. Si elle est définie à 0, le cache en mémoire partagée ne sera pas utilisé et chaque processus HTTPD va créer son propre cache.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
