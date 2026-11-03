---
title: "ProxyHTMLStripComments"
description: "Directive Apache ProxyHTMLStripComments (mod_proxy_html) — Détermine si les commentaires HTML doivent être supprimés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_html]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si les commentaires HTML doivent être supprimés. |
| **Syntaxe** | `ProxyHTMLStripComments On\|Off` |
| **Valeur par défaut** | `ProxyHTMLStripComments Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_proxy_html\|mod_proxy_html]] |
| **Compatibilité** | Disponible depuis la version 2.4 du serveur HTTP Apache. Disponible en tant que module tiers dans les versions 2.x antérieures. |

## Utilisation

Si cette directive est définie à `On`, mod\_proxy\_html supprimera les commentaires HTML. Notez que cela supprimera aussi tout script ou style inclus dans les commentaires (une monstruosité introduite en 1995/1996 avec Netscape 2 pour les navigateurs plus anciens, et encore utilisée de nos jours). Cette directive peut aussi interférer avec des processeurs basés sur les commentaires comme SSI ou ESI : assurez-vous d'exécuter ces derniers *avant* mod\_proxy\_html dans la chaîne de filtrage si vous supprimez les commentaires !

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
