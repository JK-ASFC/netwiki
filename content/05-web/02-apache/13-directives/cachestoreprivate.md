---
title: "CacheStorePrivate"
description: "Directive Apache CacheStorePrivate (mod_cache) — Tente de mettre en cache des réponses que le serveur a marquées comme privées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Tente de mettre en cache des réponses que le serveur a marquées comme privées |
| **Syntaxe** | `CacheStorePrivate On\|Off` |
| **Valeur par défaut** | `CacheStorePrivate Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

Normalement, les réponse comportant un en-tête `Cache-Control: private` ne seront pas stockées dans le cache. La directive `CacheStorePrivate` permet de modifier ce comportement. Si `CacheStorePrivate` est définie à On, le serveur tentera de mettre la ressource en cache, même si elle contient des en-têtes ayant pour valeur private. Les ressources nécessitant une autorisation ne sont *jamais* mises en cache.

```apache
CacheStorePrivate On
```

> [!WARNING]
> **Avertissement :**
>
> Cette directive autorise la mise en cache même si le serveur indique que la ressource ne doit pas être mise en cache. Elle n'est de ce fait appropriée que dans le cas d'un cache 'privé'.

## Voir aussi

- [[13-directives/cacheignorecachecontrol|CacheIgnoreCacheControl]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
