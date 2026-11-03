---
title: "CacheStoreExpired"
description: "Directive Apache CacheStoreExpired (mod_cache) — Tente de mettre en cache les réponses que le serveur considère comme arrivées à expiration. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Tente de mettre en cache les réponses que le serveur considère comme arrivées à expiration |
| **Syntaxe** | `CacheStoreExpired On\|Off` |
| **Valeur par défaut** | `CacheStoreExpired Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

Depuis la version 2.2.4, les réponses qui sont arrivées à expiration ne sont pas stockées dans le cache. La directive `CacheStoreExpired` permet de modifier ce comportement. Avec `CacheStoreExpired` On, le serveur tente de mettre en cache la ressource si elle est périmée. Les requêtes suivantes vont déclencher une requête si-modifié-depuis de la part du serveur d'origine, et la réponse sera renvoyée à partir du cache si la ressource d'arrière-plan n'a pas été modifiée.

```apache
CacheStoreExpired On
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
