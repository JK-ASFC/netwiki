---
title: "CacheSocacheMinTime"
description: "Directive Apache CacheSocacheMinTime (mod_cache_socache) — La durée minimale de stockage d'un document dans le cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La durée minimale de stockage d'un document dans le cache |
| **Syntaxe** | `CacheSocacheMinTime seconds` |
| **Valeur par défaut** | `CacheSocacheMinTime 600` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_socache\|mod_cache_socache]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Utilisation

La directive `CacheSocacheMinTime` définit le nombre de secondes au delà de la durée de fraîcheur de la réponse pendant lesquelles cette dernière devra être stockée dans le cache d'objets partagés. En effet, si une réponse n'est stockée que pour une durée égale à sa durée de fraîcheur, elle n'a pas besoin d'être rafraîchie.

```apache
CacheSocacheMinTime 600
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
