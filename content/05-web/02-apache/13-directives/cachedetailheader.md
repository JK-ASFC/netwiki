---
title: "CacheDetailHeader"
description: "Directive Apache CacheDetailHeader (mod_cache) — Ajoute un en-tête X-Cache-Detail à la réponse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute un en-tête X-Cache-Detail à la réponse. |
| **Syntaxe** | `CacheDetailHeader on\|off` |
| **Valeur par défaut** | `CacheDetailHeader off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |
| **Compatibilité** | Disponible depuis la version 2.3.9 d'Apache |

## Utilisation

Lorsque la directive `CacheDetailHeader` est définie à on, un en-tête **X-Cache-Detail** est ajouté à la réponse et contient les raisons précises d'une décision d'utilisation du cache vis à vis de cette dernière.

Ceci peut s'avérer utile au cours du développement de services RESTful mis en cache pour obtenir des informations supplémentaires à propos des décisions vis à vis du cache écrites dans les en-têtes de la réponse. Il est ainsi possible de vérifier si `Cache-Control` et d'autres en-têtes ont été correctement utilisés par le service et le client.

Si le gestionnaire normal est utilisé, cette directive peut se situer dans une section [[13-directives/directory|<Directory>]] ou [[13-directives/location|<Location>]]. Si c'est le gestionnaire rapide qui est utilisé, elle doit se situer dans un contexte de serveur principal ou de serveur virtuel, sinon elle sera ignorée.

```apache
# Active l'en-tête X-Cache-Detail
CacheDetailHeader on
```

```
X-Cache-Detail: "conditional cache hit: entity refreshed" from localhost
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
