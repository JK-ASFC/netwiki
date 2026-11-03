---
title: "CacheKeyBaseURL"
description: "Directive Apache CacheKeyBaseURL (mod_cache) — Remplace l'URL de base des clés du cache mandatées en inverse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Remplace l'URL de base des clés du cache mandatées en inverse |
| **Syntaxe** | `CacheKeyBaseURL URL` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |
| **Compatibilité** | Disponible depuis la version 2.3.9 d'Apache |

## Utilisation

Lorsque la directive `CacheKeyBaseURL` est utilisée, l'URL spécifiée sera utilisée comme URL de base pour calculer l'URL des clés du cache dans la configuration du mandataire inverse. Par défaut, c'est le protocole/nom d'hôte/port du serveur virtuel courant qui sera utilisé pour construire la clé de cache. Dans le cas d'un cluster de machines, si toutes les entrées du cache doivent posséder la même clé, cette directive permet de spécifier une nouvelle URL de base.

```apache
# Remplace l'URL de base de la clé de cache.
CacheKeyBaseURL "http://www.example.com/"
```

> [!WARNING]
> Prenez garde en définissant cette directive. Si deux serveurs virtuels distincts possèdent accidentellement la même URL de base, les entrées en provenance d'un serveur virtuel seront servies par l'autre.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
