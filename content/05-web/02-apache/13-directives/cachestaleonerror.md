---
title: "CacheStaleOnError"
description: "Directive Apache CacheStaleOnError (mod_cache) — Sert du contenu non à jour à la place de réponses 5xx. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Sert du contenu non à jour à la place de réponses 5xx. |
| **Syntaxe** | `CacheStaleOnError on\|off` |
| **Valeur par défaut** | `CacheStaleOnError on` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |
| **Compatibilité** | Disponible depuis la version 2.3.9 d'Apache |

## Utilisation

Lorsque la directive `CacheStaleOnError` est définie à on, et si des données non mises à jour sont disponibles dans le cache, ce dernier renverra ces données, plutôt qu'une éventuelle réponse 5xx en provenance du serveur d'arrière-plan. Alors que l'en-tête Cache-Control envoyé par les clients sera respecté, et que les clients recevront donc dans ce cas la réponse 5xx brute à leur requête, cette réponse 5xx renvoyée au client n'invalidera pas le contenu dans le cache.

```apache
# Sert des données non mises à jour en cas d'erreur.
CacheStaleOnError on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
