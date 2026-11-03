---
title: "CacheSocacheMaxTime"
description: "Directive Apache CacheSocacheMaxTime (mod_cache_socache) — La durée maximale de stockage d'un document dans le cache avant péremption. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache_socache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La durée maximale de stockage d'un document dans le cache avant péremption |
| **Syntaxe** | `CacheSocacheMaxTime secondes` |
| **Valeur par défaut** | `CacheSocacheMaxTime 86400` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache_socache\|mod_cache_socache]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache |

## Utilisation

La directive `CacheSocacheMaxTime` définit la durée de stockage maximale en secondes d'un document dans le cache avant péremption. Cette définition l'emporte sur la durée de fraîcheur définie pour le document par le protocole HTTP.

```apache
CacheSocacheMaxTime 86400
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
