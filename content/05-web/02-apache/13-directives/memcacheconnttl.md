---
title: "MemcacheConnTTL"
description: "Directive Apache MemcacheConnTTL (mod_socache_memcache) — Durée de conservation des connexions inactives. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_socache_memcache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée de conservation des connexions inactives |
| **Syntaxe** | `MemcacheConnTTL num[units]` |
| **Valeur par défaut** | `MemcacheConnTTL 15s` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_socache_memcache\|mod_socache_memcache]] |
| **Compatibilité** | Disponible à partir de la version 2.4.17 du serveur HTTP Apache. |

## Utilisation

Définit la durée pendant laquelle les connexions inactives avec le(s) serveur(s) memcache seront conservées (plateformes threadées seulement).

Les valeurs valides de la directive `MemcacheConnTTL` sont des durées d'une heure maximum. La valeur 0 signifie une absence de péremption

> [!NOTE]
> L'unité par défaut pour ce délai est la seconde, mais vous pouvez ajouter un suffixe pour spécifier une unité différente ; ms pour milliseconde, s pour seconde, min pour minute et h pour heure..

Dans les versions antérieures à 2.4.17, ce délai était codé en dur et sa valeur était 600 microsecondes. La valeur la plus proche de cette ancienne valeur pour la directive `MemcacheConnTTL` est donc 1ms.

```apache
# Définition d'un délai de 10 minutes
MemcacheConnTTL 10min
# Définition d'un délai de 60 secondes
MemcacheConnTTL 60
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
