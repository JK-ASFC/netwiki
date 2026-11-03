---
title: "ProxyHTMLLinks"
description: "Directive Apache ProxyHTMLLinks (mod_proxy_html) — Spécifie les éléments HTML dont les attributs d'URL doivent être réécrits. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie les éléments HTML dont les attributs d'URL doivent être réécrits. |
| **Syntaxe** | `ProxyHTMLLinks élément attribut [attribut2 ...]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Cette directive permet de spécifier les éléments dont les attributs d'URL doivent être réécrits en utilisant les règles standards [[13-directives/proxyhtmlurlmap|ProxyHTMLURLMap]]. Vous devez définir une directive `ProxyHTMLLinks` pour chaque élément, mais chacune d'entre elles peut spécifier un nombre quelconque d'attributs

Normalement, cette directive est définie globalement. Si vous définissez `ProxyHTMLLinks` à plusieurs niveaux, certains niveaux l'emportant sur d'autres, vous devrez spécifier un jeu complet de liens pour chaque niveau.

Le fichier *proxy-html.conf* fournit une configuration par défaut et définit les liens HTML selon les standards HTML 4 et XHTML 1.

**Exemples issus de proxy-html.conf**

```apache
ProxyHTMLLinks  a          href
ProxyHTMLLinks  area       href
ProxyHTMLLinks  link       href
ProxyHTMLLinks  img        src longdesc usemap
ProxyHTMLLinks  object     classid codebase data usemap
ProxyHTMLLinks  q          cite
ProxyHTMLLinks  blockquote cite
ProxyHTMLLinks  ins        cite
ProxyHTMLLinks  del        cite
ProxyHTMLLinks  form       action
ProxyHTMLLinks  input      src usemap
ProxyHTMLLinks  head       profile
ProxyHTMLLinks  base       href
ProxyHTMLLinks  script     src for
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
