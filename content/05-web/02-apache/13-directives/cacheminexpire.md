---
title: "CacheMinExpire"
description: "Directive Apache CacheMinExpire (mod_cache) — La durée minimale en secondes de mise en cache d'un document. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La durée minimale en secondes de mise en cache d'un document |
| **Syntaxe** | `CacheMinExpire secondes` |
| **Valeur par défaut** | `CacheMinExpire 0` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

La directive `CacheMinExpire` permet de spécifier le nombre minimum de secondes pendant lequel les documents HTTP susceptibles d'être mis en cache seront conservés sans vérifier leur contenu sur le serveur d'origine. Elle n'est prise en compte que dans le cas où le document ne possède aucune date d'expiration valide.

```apache
CacheMinExpire 3600
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
