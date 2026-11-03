---
title: "ProxyHTMLMeta"
description: "Directive Apache ProxyHTMLMeta (mod_proxy_html) — Active ou désactive une préinterprétation supplémentaire des métadonnées dans les sections HTML <head>. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active ou désactive une préinterprétation supplémentaire des métadonnées dans les sections HTML `<head>`. |
| **Syntaxe** | `ProxyHTMLMeta On\|Off` |
| **Valeur par défaut** | `ProxyHTMLMeta Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible à partir de la version 2.4 du serveur HTTP Apache ; proposé en tant que module tiers dans les versions 2.x précédentes. |

## Utilisation

Cette directive permet d'activer ou désactiver une préinterprétation supplémentaire des métadonnées dans les sections HTML `<head>`. Si cette préinterprétation n'est pas requise, définissez ProxyHTMLMeta à Off et les performances seront légèrement améliorées. Cependant, elle s'avère parfois nécessaire pour assurer un fonctionnement correct de l'internationalisation.

La directive `ProxyHTMLMeta` a deux effets. Le premier et le plus important est la détection des codages de caractères déclarés sous la forme

```
<meta http-equiv="Content-Type" content="text/html;charset=foo">
```

ou, dans le cas d'un document XHTML, sous la forme d'une déclaration XML. Elle n'est pas nécessaire si le jeu de caractères est déclaré explicitement dans un en-tête HTTP (ce qui est préférable) en provenance du serveur d'arrière-plan, ou si le document est en *utf-8* (unicode) ou un de ses sous-ensembles comme ASCII. Vous pourrez aussi vous en passer lorsque le document utilise une valeur par défaut déclarée via la directive [[13-directives/xml2encdefault|xml2EncDefault]], avec le risque de propager une déclaration incorrecte. Une directive [[13-directives/proxyhtmlcharsetout|ProxyHTMLCharsetOut]] permettra d'annuler ce risque, mais pourra induire une surcharge de traitement supérieure à celle de ProxyHTMLMeta.

Le deuxième effet est l'interprétation de toutes les déclarations `<meta http-equiv=...>` et leur conversion en en-têtes HTTP, afin de conserver le but original de cette forme de métaélément HTML.

> [!WARNING]
> **Avertissement**
>
> Compte tenu du fait que la directive ProxyHTMLMeta promeut **tous** les éléments `http-equiv` au rang d'en-têtes HTTP, il est conseillé de ne l'activer que si vous faites autant confiance au contenu HTML qu'à votre serveur mandataire. Avec cette directive en effet, si ce contenu est géré par des gens malintentionnés, ces derniers seront en mesure d'injecter des en-têtes HTTP arbitraires et peut-être malveillants dans les réponses de votre serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
