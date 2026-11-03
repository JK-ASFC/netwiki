---
title: "CacheStoreNoStore"
description: "Directive Apache CacheStoreNoStore (mod_cache) — Tente de mettre en cache les requêtes ou réponses dont l'entête Cache-Control: a pour valeur no-store. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Tente de mettre en cache les requêtes ou réponses dont l'entête Cache-Control: a pour valeur no-store. |
| **Syntaxe** | `CacheStoreNoStore On\|Off` |
| **Valeur par défaut** | `CacheStoreNoStore Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

Normalement, les requêtes ou réponses dont l'en-tête `Cache-Control: no-store` ne sont pas stockées dans le cache. La directive `CacheStoreNoStore` permet de modifier ce comportement. Si `CacheStoreNoStore` est définie à On, le serveur tente de mettre la ressource en cache même si elle contient des en-têtes ayant pour valeur no-store. Les ressources nécessitant une autorisation ne sont *jamais* mises en cache.

```apache
CacheStoreNoStore On
```

> [!WARNING]
> **Avertissement :**
>
> Selon la RFC 2616, la valeur d'en-tête no-store est censée "prévenir la suppression ou la rétention par inadvertance d'informations sensibles (par exemple, sur des bandes de sauvegarde)". Autrement dit, l'activation de la directive `CacheStoreNoCache` pourrait provoquer le stockage d'informations sensibles dans le cache. Vous avez donc été prévenus.

## Voir aussi

- [[13-directives/cacheignorecachecontrol|CacheIgnoreCacheControl]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
