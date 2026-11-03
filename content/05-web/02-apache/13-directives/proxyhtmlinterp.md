---
title: "ProxyHTMLInterp"
description: "Directive Apache ProxyHTMLInterp (mod_proxy_html) — Active la réinterprétation des règles ProxyHTMLURLMap pour chaque requête. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la réinterprétation des règles `ProxyHTMLURLMap` pour chaque requête. |
| **Syntaxe** | `ProxyHTMLInterp On\|Off` |
| **Valeur par défaut** | `ProxyHTMLInterp Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Cette directive permet d'activer le réinterprétation pour chaque requête des modèles source et cible de la directive [[13-directives/proxyhtmlurlmap|ProxyHTMLURLMap]].

Si la réinterprétation n'est pas activée, toutes les règles sont précompilées au démarrage du serveur. Si elle est activée, les règles doivent être recompilées pour chaque requête, ce qui induit une charge de traitement supplémentaire. Elle ne doit donc être activée que si cela s'avère nécessaire.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
