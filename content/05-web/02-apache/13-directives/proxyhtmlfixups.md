---
title: "ProxyHTMLFixups"
description: "Directive Apache ProxyHTMLFixups (mod_proxy_html) — Corrige les erreurs HTML simples. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Corrige les erreurs HTML simples. |
| **Syntaxe** | `ProxyHTMLFixups [lowercase] [dospath] [reset]` |
| **Valeur par défaut** | `ProxyHTMLFixups none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Cette directive accepte un à trois arguments parmi les suivants :

- `lowercase` Les Urls sont réécrites en minuscules
- `dospath` Les slashes inversés dans les URLs sont remplacés par des slashes directs.
- `reset` Annule toute option définie à un niveau supérieur dans la configuration

Cette directive doit être utilisée avec prudence. Elle peut corriger certaines erreurs de création, mais risque aussi de modifier par erreur des liens corrects. Ne l'utilisez que si vous êtes sûr que le serveur d'arrière-plan est déficient.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
