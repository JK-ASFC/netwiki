---
title: "LDAPSharedCacheFile"
description: "Directive Apache LDAPSharedCacheFile (mod_ldap) — Définit le fichier du cache en mémoire partagée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ldap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le fichier du cache en mémoire partagée |
| **Syntaxe** | `LDAPSharedCacheFile directory-path/filename` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ldap\|mod_ldap]] |

## Utilisation

Cette directive permet de spécifier le chemin et le nom du fichier du cache en mémoire partagée. Si elle n'est pas définie, la mémoire partagée anonyme sera utilisée si la plate-forme la supporte.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
