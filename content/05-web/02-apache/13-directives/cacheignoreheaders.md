---
title: "CacheIgnoreHeaders"
description: "Directive Apache CacheIgnoreHeaders (mod_cache) — Ne pas stocker le(s) en-tête(s) spécifié(s) dans le cache. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ne pas stocker le(s) en-tête(s) spécifié(s) dans le cache. |
| **Syntaxe** | `CacheIgnoreHeaders en-tête [en-tête] ...` |
| **Valeur par défaut** | `CacheIgnoreHeaders None` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

En accord avec la RFC 2616, les en-têtes HTTP hop-by-hop ne sont pas stockés dans le cache. Les en-têtes HTTP suivant sont des en-têtes hop-by-hop, et en tant que tels, ne sont en *aucun* cas stockés dans le cache, quelle que soit la définition de la directive `CacheIgnoreHeaders` :

- `Connection`
- `Keep-Alive`
- `Proxy-Authenticate`
- `Proxy-Authorization`
- `TE`
- `Trailers`
- `Transfer-Encoding`
- `Upgrade`

La directive `CacheIgnoreHeaders` permet de spécifier quels en-têtes HTTP ne doivent pas être stockés dans le cache. Par exemple, il peut s'avérer pertinent dans certains cas de ne pas stocker les cookies dans le cache.

La directive `CacheIgnoreHeaders` accepte une liste d'en-têtes HTTP séparés par des espaces, qui ne doivent pas être stockés dans le cache. Si les en-têtes hop-by-hop sont les seuls à ne pas devoir être stockés dans le cache (le comportement compatible RFC 2616), la directive `CacheIgnoreHeaders` peut être définie à `None`.

**Exemple 1**

```apache
CacheIgnoreHeaders Set-Cookie
```

**Exemple 2**

```apache
CacheIgnoreHeaders None
```

> [!WARNING]
> **Avertissement :**
>
> Si des en-têtes nécessaires à la bonne gestion du cache, comme `Expires`, ne sont pas stockés suite à la définition d'une directive `CacheIgnoreHeaders`, le comportement de mod\_cache sera imprévisible.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
