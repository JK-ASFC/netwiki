---
title: "CacheIgnoreCacheControl"
description: "Directive Apache CacheIgnoreCacheControl (mod_cache) — Ignore les en-têtes de requête enjoignant de ne pas servir le contenu au client depuis le cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ignore les en-têtes de requête enjoignant de ne pas servir le contenu au client depuis le cache |
| **Syntaxe** | `CacheIgnoreCacheControl On\|Off` |
| **Valeur par défaut** | `CacheIgnoreCacheControl Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

Normalement, les requêtes contenant des en-têtes tels que `Cache-Control: no-cache` ou Pragma: no-cache ne sont pas servies depuis le cache. La directive `CacheIgnoreCacheControl` permet de modifier ce comportement. Avec `CacheIgnoreCacheControl On`, le serveur tentera de servir la ressource depuis le cache, même si la requête contient un des en-têtes cités plus haut. Les ressources qui requièrent une autorisation ne seront *jamais* mises en cache.

```apache
CacheIgnoreCacheControl On
```

> [!WARNING]
> **Avertissement :**
>
> Cette directive permet de servir des ressources depuis le cache, même si le client a demandé à ce qu'il n'en soit pas ainsi. Le contenu servi est ainsi susceptible d'être périmé.

## Voir aussi

- [[13-directives/cachestoreprivate|CacheStorePrivate]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
