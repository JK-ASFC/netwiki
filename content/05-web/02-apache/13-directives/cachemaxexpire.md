---
title: "CacheMaxExpire"
description: "Directive Apache CacheMaxExpire (mod_cache) — La durée maximale en secondes de mise en cache d'un document. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La durée maximale en secondes de mise en cache d'un document |
| **Syntaxe** | `CacheMaxExpire secondes` |
| **Valeur par défaut** | `CacheMaxExpire 86400 (une journée)` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

La directive `CacheMaxExpire` permet de spécifier le nombre maximum de secondes pendant lequel les documents HTTP suceptibles d'être mis en cache seront conservés sans vérifier leur contenu sur le serveur d'origine. Ce nombre de secondes correspond donc à la durée maximale pendant laquelle un document ne sera pas à jour. L'utilisation de cette valeur maximale est forcée, même si le document possède une date d'expiration.

```apache
CacheMaxExpire 604800
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
