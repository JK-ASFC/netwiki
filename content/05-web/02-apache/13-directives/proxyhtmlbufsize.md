---
title: "ProxyHTMLBufSize"
description: "Directive Apache ProxyHTMLBufSize (mod_proxy_html) — Définit l'incrément de la taille du tampon, ainsi que sa taille initiale, pour la mise en tampon des scripts en ligne et des feuilles de style. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit l'incrément de la taille du tampon, ainsi que sa taille initiale, pour la mise en tampon des scripts en ligne et des feuilles de style. |
| **Syntaxe** | `ProxyHTMLBufSize nb-octets` |
| **Valeur par défaut** | `ProxyHTMLBufSize 8192` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Pour pouvoir interpréter du contenu non HTML (feuilles de style et scripts) embarqué dans des documents HTML, [[12-modules/mod_proxy_html|mod_proxy_html]] doit le lire et le mémoriser en entier dans un tampon. Ce tampon devra être étendu autant que nécessaire afin de pouvoir accueillir le plus grand script ou la plus grande feuille de style de la page, selon un incrément de *nb-octets* que cette directive permet de définir.

La valeur par défaut est 8192 et sera suffisante pour la plupart des pages. Cependant, si vous savez que vous allez mandater des pages contenant des feuilles de style et/ou scripts plus grands que 8k (cette taille s'entend pour chaque script ou feuilles de style, non pour leur ensemble), il sera plus efficace de définir une taille de tampon initiale plus grande afin d'éviter d'avoir à le redimensionner dynamiquement au cours du traitement d'une requête.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
