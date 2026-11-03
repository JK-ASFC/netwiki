---
title: "ProxyHTMLEnable"
description: "Directive Apache ProxyHTMLEnable (mod_proxy_html) — Permet d'activer/désactiver le filtre proxy_html. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet d'activer/désactiver le filtre proxy\_html. |
| **Syntaxe** | `ProxyHTMLEnable On\|Off` |
| **Valeur par défaut** | `ProxyHTMLEnable Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Cette directive est un simple commutateur permettant d'activer/désactiver le filtre proxy\_html. Si [[12-modules/mod_xml2enc|mod_xml2enc]] est chargé, elle va aussi activer automatiquement le support de l'internationalisation.

Notez que le filtre proxy\_html s'agira que si les données sont de type HTML (Content-Type text/html ou application/xhtml+xml), et si elles passent par un mandataire. Vous pouvez passer outre ces contraintes (à vos risques et périls) en définissant la variable d'environnement *PROXY\_HTML\_FORCE*.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
