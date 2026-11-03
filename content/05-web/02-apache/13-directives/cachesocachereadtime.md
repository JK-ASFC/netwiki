---
title: "CacheSocacheReadTime"
description: "Directive Apache CacheSocacheReadTime (mod_cache_socache) — La durée minimale de lecture avant l'envoi des données. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La durée minimale de lecture avant l'envoi des données |
| **Syntaxe** | `CacheSocacheReadTime millisecondes` |
| **Valeur par défaut** | `CacheSocacheReadTime 0` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_socache\|mod_cache_socache]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Utilisation

La directive `CacheSocacheReadTime` définit le temps minimal qui doit s'écouler avant de tenter l'envoi des données au client. Cette durée sera mise à profit pour lire et mettre en tampon les données avant leur envoi au client. Ceci peut améliorer les performances en cas de mise en cache de contenu en provenance d'un mandataire inverse.

La valeur par défaut 0 désactive cette directive.

Cette directive n'a d'effet qu'au moment où les données sont stockées dans le cache, et non lorsqu'elles sont servies depuis le cache. Il est recommandé d'utiliser cette directive en concomitance avec la directive [[13-directives/cachesocachereadsize|CacheSocacheReadSize]] afin de s'assurer que le serveur ne mette pas les données en tampon de manière excessive dans le cas où les données arriveraient plus vite que prévu.

```apache
CacheSocacheReadTime 1000
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
