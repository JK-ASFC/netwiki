---
title: "LDAPOpCacheEntries"
description: "Directive Apache LDAPOpCacheEntries (mod_ldap) — Nombre d'entrées utilisées pour mettre en cache les opérations de comparaison LDAP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre d'entrées utilisées pour mettre en cache les opérations de comparaison LDAP |
| **Syntaxe** | `LDAPOpCacheEntries nombre` |
| **Valeur par défaut** | `LDAPOpCacheEntries 1024` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive permet de spécifier le nombre d'entrées que [[12-modules/mod_ldap|mod_ldap]] va utiliser pour mettre en cache les opérations de comparaison LDAP. La valeur par défaut est de 1024 entrées. Si elle est définie à 0, la mise en cache des opérations de comparaison LDAP est désactivée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
