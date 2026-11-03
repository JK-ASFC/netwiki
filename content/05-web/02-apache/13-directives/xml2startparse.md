---
title: "xml2StartParse"
description: "Directive Apache xml2StartParse (mod_xml2enc) — Indique à l'interpréteur à partir de quelle balise il doit commencer son traitement. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_xml2enc]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Indique à l'interpréteur à partir de quelle balise il doit commencer son traitement. |
| **Syntaxe** | `xml2StartParse élément [élément ...]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Base |
| **Module** | [[12-modules/mod_xml2enc\|mod_xml2enc]] |

## Utilisation

Cette directive permet de spécifier à partir de quelle balise, parmi les éléments spécifiés, l'interpréteur de balise doit commencer son traitement. Ccei permet de contourner le problème des serveurs d'arrière-plan qui insèrent des éléments non conformes en début de données, ce qui a pour effet de perturber l'interpréteur ([voir un exemple ici](http://bahumbug.wordpress.com/2006/10/12/mod_proxy_html-revisited/)).

Elle ne doit être utilisée ni pour les documents XML, ni pour les documents HTML correctement formatés.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
