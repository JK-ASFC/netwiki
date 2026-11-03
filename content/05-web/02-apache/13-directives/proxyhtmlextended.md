---
title: "ProxyHTMLExtended"
description: "Directive Apache ProxyHTMLExtended (mod_proxy_html) — Détermine si l'on doit corriger les liens dans les scripts en ligne, les feuilles de style et les évènements de type scripting. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si l'on doit corriger les liens dans les scripts en ligne, les feuilles de style et les évènements de type scripting. |
| **Syntaxe** | `ProxyHTMLExtended On\|Off` |
| **Valeur par défaut** | `ProxyHTMLExtended Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Si cette directive est définie à `Off`, les liens HTML sont réécrits en fonction des directives [[13-directives/proxyhtmlurlmap|ProxyHTMLURLMap]], mais les liens qui apparaissent dans le code Javascript et les feuilles de style restent inchangés.

Si elle est définie à `On`, tous les évènements de type scripting (définis par la directive [[13-directives/proxyhtmlevents|ProxyHTMLEvents]]) et les scripts inclus ou les feuilles de style sont aussi traités par les règles [[13-directives/proxyhtmlurlmap|ProxyHTMLURLMap]], en fonction des drapeaux définis pour chacune d'entre elles. Ne définissez cette directive à `On` qu'en cas de nécessité absolue, car la charge supplémentaire induite impacte les performances.

Vous devez aussi prêter attention aux modèles de comparaison, car l'interpréteur n'a aucune notion de la forme que pourrait prendre une URL dans un script embarqué ou une feuille de style. En particulier, la comparaison étendus du caractère `/` a de fortes chances d'induire des correspondances erronées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
