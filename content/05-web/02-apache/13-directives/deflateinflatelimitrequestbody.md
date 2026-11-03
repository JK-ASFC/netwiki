---
title: "DeflateInflateLimitRequestBody"
description: "Directive Apache DeflateInflateLimitRequestBody (mod_deflate) — Taille maximale des corps de requête décompressés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_deflate]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille maximale des corps de requête décompressés |
| **Syntaxe** | `DeflateInflateLimitRequestBody value` |
| **Valeur par défaut** | `Aucune limite, mais LimitRequestBody s'applique après la compression` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_deflate\|mod_deflate]] |
| **Compatibilité** | Disponible à partir de la version 2.4.10 du serveur HTTP Apache |

## Utilisation

La directive `DeflateInflateLimitRequestBody` permet de spécifier la taille maximale d'un corps de requête décompressé. Si elle n'est pas définie, c'est la valeur de la directive [[13-directives/limitrequestbody|LimitRequestBody]] qui s'applique au corps de requête décompressé. Une valeur de `0` signifie qu’aucune limite n’est imposée à la taille du corps décompressé (d’autres limites telles que celles de la directive [[13-directives/limitrequestbody|LimitRequestBody]] peuvent cependant s’appliquer).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
