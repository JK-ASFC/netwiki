---
title: "CacheHeader"
description: "Directive Apache CacheHeader (mod_cache) — Ajoute un en-tête X-Cache à la réponse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute un en-tête X-Cache à la réponse. |
| **Syntaxe** | `CacheHeader on\|off` |
| **Valeur par défaut** | `CacheHeader off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |
| **Compatibilité** | Disponible depuis la version 2.3.9 d'Apache |

## Utilisation

Lorsque la directive `CacheHeader` est définie à on, un en-tête **X-Cache** est ajouté à la réponse et contient l'état du cache pour cette dernière. Si le gestionnaire normal est utilisé, cette directive peut se situer dans une section [[13-directives/directory|<Directory>]] ou [[13-directives/location|<Location>]]. Si c'est le gestionnaire rapide qui est utilisé, elle doit se situer dans un contexte de serveur principal ou de serveur virtuel, sinon elle sera ignorée.

**HIT**

Le contenu était à jour et a été servi depuis le cache.

**REVALIDATE**

Le contenu était périmé, a été mis à jour, puis a été servi depuis le cache.

**MISS**

Le contenu n'a pas été servi depuis le cache, mais directement depuis le serveur demandé.

```apache
# Active l'en-tête X-Cache
CacheHeader on
```

```apache
X-Cache: HIT from localhost
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
