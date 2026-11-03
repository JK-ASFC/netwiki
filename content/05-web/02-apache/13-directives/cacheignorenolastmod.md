---
title: "CacheIgnoreNoLastMod"
description: "Directive Apache CacheIgnoreNoLastMod (mod_cache) — Ignore le fait qu'une réponse ne possède pas d'en-tête Last Modified. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ignore le fait qu'une réponse ne possède pas d'en-tête Last Modified. |
| **Syntaxe** | `CacheIgnoreNoLastMod On\|Off` |
| **Valeur par défaut** | `CacheIgnoreNoLastMod Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

Normalement, les documents qui ne possèdent pas de date de dernière modification ne sont pas mis en cache. Dans certaines circonstances, la date de dernière modification est supprimée (au cours des traitements liés à [[12-modules/mod_include|mod_include]] par exemple), ou n'existe tout simplement pas. La directive `CacheIgnoreNoLastMod` permet de spécifier si les documents ne possèdant pas de date de dernière modification doivent être mis en cache, même sans date de dernière modification. Si le document ne possède ni date d'expiration, ni date de dernière modification, la valeur spécifiée par la directive [[13-directives/cachedefaultexpire|CacheDefaultExpire]] servira à générer une date d'expiration.

> [!NOTE]
> Plus précisément, une réponse 200 OK n'est mise en cache que si elle contient au moins un des en-têtes `Last-Modified`, `ETag` ou `Expires`, ou une directive `Cache-Control: max-age` ou `s-maxage`. Cette directive permet de s'affranchir entièrement de cette condition préalable. Si un de ces en-têtes est déjà présent, cette directive n'a aucun effet.

```apache
CacheIgnoreNoLastMod On
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
