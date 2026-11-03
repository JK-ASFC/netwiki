---
title: "ImapDefault"
description: "Directive Apache ImapDefault (mod_imagemap) — Action à entreprendre par défaut lorsqu'un fichier imagemap est invoqué avec des coordonnées qui ne correspondent à aucune cible. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_imagemap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Action à entreprendre par défaut lorsqu'un fichier imagemap est invoqué avec des coordonnées qui ne correspondent à aucune cible |
| **Syntaxe** | `ImapDefault error\|nocontent\|map\|referer\|URL` |
| **Valeur par défaut** | `ImapDefault nocontent` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_imagemap\|mod_imagemap]] |

## Utilisation

La directive `ImapDefault` permet de définir la valeur par défaut de la directive `default` utilisée dans les fichiers imagemap. Sa valeur est écrasée par la présence éventuelle d'une directive `default` dans le fichier imagemap. Si cette directive est absente, l'action associée à `default` est `nocontent`, ce qui implique l'envoi d'un code de statut `204 No Content` au client. Dans ce cas, le client doit continuer à afficher la même page.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
