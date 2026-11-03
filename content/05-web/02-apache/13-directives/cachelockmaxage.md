---
title: "CacheLockMaxAge"
description: "Directive Apache CacheLockMaxAge (mod_cache) — Définit la durée de vie maximale d'un verrou de cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la durée de vie maximale d'un verrou de cache. |
| **Syntaxe** | `CacheLockMaxAge entier` |
| **Valeur par défaut** | `CacheLockMaxAge 5` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

La directive `CacheLockMaxAge` permet de spécifier la durée de vie maximale d'un verrou de cache.

Un verrou plus ancien que cette valeur exprimée en secondes sera ignoré, et la prochaine requête entrante sera alors en mesure de recréer le verrou. Ce mécanisme permet d'éviter les mises à jour trop longues initiées par des clients lents.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
