---
title: "CacheLock"
description: "Directive Apache CacheLock (mod_cache) — Active la protection contre les tempêtes de requêtes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la protection contre les tempêtes de requêtes. |
| **Syntaxe** | `CacheLock on\|off` |
| **Valeur par défaut** | `CacheLock off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |
| **Compatibilité** | Disponible depuis la version 2.2.15 d'Apache |

## Utilisation

La directive `CacheLock` active la protection contre les tempêtes de requêtes pour l'espace d'adressage donné.

La configuration minimale pour activer le verrouillage contre les tempêtes de requêtes dans le répertoire temp par défaut du système est la suivante :

```apache
# Active le verrouillage du cache
CacheLock on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
