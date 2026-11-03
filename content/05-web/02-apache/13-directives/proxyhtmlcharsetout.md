---
title: "ProxyHTMLCharsetOut"
description: "Directive Apache ProxyHTMLCharsetOut (mod_proxy_html) — Spécifie un jeu de caractères pour la sortie de mod_proxy_html. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie un jeu de caractères pour la sortie de mod\_proxy\_html. |
| **Syntaxe** | `ProxyHTMLCharsetOut jeu-de-caractères \| *` |
| **Valeur par défaut** | `ProxyHTMLCharsetOut UTF-8` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Cette directive permet de spécifier un jeu de caractères pour la sortie de mod\_proxy\_html. Elle ne devrait jamais être utilisée, car tout changement par rapport à la valeur par défaut `UTF-8` (Unicode - utilisé en interne par libxml2) induit une charge supplémentaire de traitement. La définition spéciale `ProxyHTMLCharsetOut *` permet de générer une sortie qui utilisera le même encodage que l'entrée.

Notez que tout ceci ne fonctionne que si le module [[12-modules/mod_xml2enc|mod_xml2enc]] est chargé.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
