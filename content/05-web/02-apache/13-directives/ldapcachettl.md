---
title: "LDAPCacheTTL"
description: "Directive Apache LDAPCacheTTL (mod_ldap) — Durée pendant laquelle les entrées du cache restent valides. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée pendant laquelle les entrées du cache restent valides. |
| **Syntaxe** | `LDAPCacheTTL secondes` |
| **Valeur par défaut** | `LDAPCacheTTL 600` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive permet de spécifier la durée (en secondes) pendant laquelle une entrée du cache de recherche/identification reste valide. La valeur par défaut est de 600 secondes (10 minutes).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
