---
title: "CacheDefaultExpire"
description: "Directive Apache CacheDefaultExpire (mod_cache) — La durée par défaut de mise en cache d'un document lorsqu'aucune date d'expiration n'a été spécifiée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La durée par défaut de mise en cache d'un document lorsqu'aucune date d'expiration n'a été spécifiée. |
| **Syntaxe** | `CacheDefaultExpire secondes` |
| **Valeur par défaut** | `CacheDefaultExpire 3600 (une heure)` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

La directive `CacheDefaultExpire` permet de spécifier un temps par défaut, en secondes, pendant lequel sera conservé dans le cache un document qui ne possède ni date d'expiration, ni date de dernière modification. La valeur de cette directive n'est *pas* écrasée par la valeur de la directive [[13-directives/cachemaxexpire|CacheMaxExpire]], même si cette dernière est utilisée.

```apache
CacheDefaultExpire 86400
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
