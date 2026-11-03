---
title: "CacheIgnoreQueryString"
description: "Directive Apache CacheIgnoreQueryString (mod_cache) — Ignore la chaîne de paramètres lors de la mise en cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ignore la chaîne de paramètres lors de la mise en cache |
| **Syntaxe** | `CacheIgnoreQueryString On\|Off` |
| **Valeur par défaut** | `CacheIgnoreQueryString Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

Normalement, les requêtes comportant une chaîne de paramètres sont mises en cache séparément si leurs chaînes de paramètres diffèrent. En accord avec la RFC 2616/13.9, cette mise en cache n'est effectuée séparément que si une date d'expiration est spécifiée. La directive `CacheIgnoreQueryString` permet la mise en cache de requêtes même si aucune date d'expiration est spécifiée, et de renvoyer une réponse depuis la cache même si les chaînes de paramètres diffèrent. Du point de vue du cache, la requête est traitée comme si elle ne possèdait pas de chaîne de paramètres lorsque cette directive est activée.

```apache
CacheIgnoreQueryString On
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
