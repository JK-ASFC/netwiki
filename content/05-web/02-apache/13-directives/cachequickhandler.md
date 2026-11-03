---
title: "CacheQuickHandler"
description: "Directive Apache CacheQuickHandler (mod_cache) — Exécute le cache à partir d'un gestionnaire rapide. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Exécute le cache à partir d'un gestionnaire rapide. |
| **Syntaxe** | `CacheQuickHandler on\|off` |
| **Valeur par défaut** | `CacheQuickHandler on` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |
| **Compatibilité** | Disponible à partir de la version 2.3.3 du serveur HTTP Apache |

## Utilisation

La directive `CacheQuickHandler` permet de contrôler la phase au cours de laquelle la mise en cache est effectuée.

Avec la configuration par défaut, le cache agit au cours de la phase du gestionnaire rapide. Cette phase court-circuite la majorité des traitements du serveur, et constitue le mode d'opération le plus performant pour un serveur typique. Le cache **s'incruste** devant le serveur, et la majorité des traitements du serveur est court-circuitée.

Lorsque cette directive est définie à off, le cache agit comme un gestionnaire normal, et est concerné par toutes les phases de traitement d'une requête. Bien que ce mode soit moins performant que le mode par défaut, il permet d'utiliser le cache dans les cas où un traitement complet de la requête est nécessaire, comme par exemple lorsque le contenu est soumis à autorisation.

```apache
# Exécute le cache comme un gestionnaire normal
CacheQuickHandler off
```

Lorsque le gestionnaire rapide est désactivé, l'administrateur a aussi la possibilité de choisir avec précision le point de la chaîne de filtrage où la mise en cache sera effectuée, en utilisant le filtre **CACHE**.

```apache
# Mise en cache du contenu avant l'intervention de mod_include et
     # mod_deflate
CacheQuickHandler off
AddOutputFilterByType CACHE;INCLUDES;DEFLATE text/html
```

Si le filtre CACHE est spécifié plusieurs fois, c'est la dernière instance qui sera prise en compte.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
