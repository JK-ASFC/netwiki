---
title: "LDAPCacheEntries"
description: "Directive Apache LDAPCacheEntries (mod_ldap) — Nombre maximum d'entrées dans le cache LDAP primaire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximum d'entrées dans le cache LDAP primaire |
| **Syntaxe** | `LDAPCacheEntries nombre` |
| **Valeur par défaut** | `LDAPCacheEntries 1024` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive permet de spécifier la taille maximale du cache LDAP primaire. Ce cache contient les résultats de recherche/identification positifs. Définissez-la à 0 pour désactiver la mise en cache des résultats de recherche/identification positifs. La taille par défaut est de 1024 recherches en cache.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
