---
title: "mod_proxy_html"
description: "Module Apache mod_proxy_html — Réécrit les liens HTML afin de s'assurer qu'ils soient bien adressables depuis les réseaux des clients dans un contexte de mandataire. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_html]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Réécrit les liens HTML afin de s'assurer qu'ils soient bien adressables depuis les réseaux des clients dans un contexte de mandataire. |
| **Statut** | Base |
| **Identificateur** | `proxy_html_module` |
| **Fichier source** | `mod_proxy_html.c` |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. |

## Sommaire

Ce module fournit un filtre en sortie permettant de réécrire les liens HTML dans un contexte de mandataire, afin de s'assurer que ces liens fonctionnent pour les utilisateurs en dehors du mandataire. Il accomplit la même tâche que la directive [[13-directives/proxypassreverse|ProxyPassReverse]] d'Apache accomplit pour les en-têtes HTTP, et fait partie des composants essentiels d'un mandataire inverse.

Par exemple, si une entreprise possède un serveur d'applications nommé appserver.example.com qui n'est visible que depuis son réseau interne, et un serveur web public `www.example.com`, il peut être souhaitable de fournir une passerelle vers le serveur d'application à l'adresse `http://www.example.com/appserver/`. Lorsque le serveur d'applications présente un lien vers lui-même, ce lien doit être réécrit pour fonctionner à travers la passerelle. A cet effet, [[12-modules/mod_proxy_html|mod_proxy_html]] permet de réécrire `<a href="http://appserver.example.com/foo/bar.html">foobar</a>` en `<a href="http://www.example.com/appserver/foo/bar.html">foobar</a>`, ce qui permet de rendre le serveur d'applications accessible depuis l'extérieur.

mod\_proxy\_html a été développé à l'origine à WebÞing, dont la [documentation](http://apache.webthing.com/mod_proxy_html/) détaillée pourra s'avérer utile aux utilisateurs.

## Directives

- [[13-directives/proxyhtmlmeta|ProxyHTMLMeta]]
- [[13-directives/proxyhtmlenable|ProxyHTMLEnable]]
- [[13-directives/proxyhtmlurlmap|ProxyHTMLURLMap]]
- [[13-directives/proxyhtmlinterp|ProxyHTMLInterp]]
- [[13-directives/proxyhtmldoctype|ProxyHTMLDocType]]
- [[13-directives/proxyhtmlfixups|ProxyHTMLFixups]]
- [[13-directives/proxyhtmlextended|ProxyHTMLExtended]]
- [[13-directives/proxyhtmlstripcomments|ProxyHTMLStripComments]]
- [[13-directives/proxyhtmlbufsize|ProxyHTMLBufSize]]
- [[13-directives/proxyhtmlevents|ProxyHTMLEvents]]
- [[13-directives/proxyhtmllinks|ProxyHTMLLinks]]
- [[13-directives/proxyhtmlcharsetout|ProxyHTMLCharsetOut]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
