---
title: "ProxyHTMLEvents"
description: "Directive Apache ProxyHTMLEvents (mod_proxy_html) — Spécifie les attributs à traiter comme des évènements de type scripting. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie les attributs à traiter comme des évènements de type scripting. |
| **Syntaxe** | `ProxyHTMLEvents attribut [attribut ...]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Cette directive permet de spécifier un ou plusieurs attributs à traiter comme des évènements de type scripting et de leur appliquer les règles [[13-directives/proxyhtmlurlmap|ProxyHTMLURLMap]] lorsqu'elles ont été définies. Vous pouvez spécifier un nombre quelconque d'attributs dans une ou plusieurs directives `ProxyHTMLEvents`.

> [!NOTE]
> **Nécessite ProxyHTMLExtended**
>
> Les évènements de type scripting ne sont traités que si la directive [[13-directives/proxyhtmlextended|ProxyHTMLExtended]] est définie à *On*. Dans le cas contraire, les attributs d'évènement sont transmis sans modification, même s'ils sont listés dans la directive `ProxyHTMLEvents`.

Normalement, cette directive est définie globalement. Si vous définissez `ProxyHTMLEvents` à plusieurs niveaux, certains niveaux l'emportant sur d'autres, vous devrez spécifier un jeu complet d'évènements pour chaque niveau.

Le fichier *proxy-html.conf* fournit une configuration par défaut et définit les évènements selon les standards HTML 4 et XHTML 1.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
