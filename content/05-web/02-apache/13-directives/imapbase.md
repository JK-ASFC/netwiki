---
title: "ImapBase"
description: "Directive Apache ImapBase (mod_imagemap) — Valeur par défaut de la directive base des fichiers imagemap. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_imagemap]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Valeur par défaut de la directive `base` des fichiers imagemap |
| **Syntaxe** | `ImapBase map\|referer\|URL` |
| **Valeur par défaut** | `ImapBase http://nom_serveur/` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Deprecated |
| **Module** | [[12-modules/mod_imagemap\|mod_imagemap]] |

## Utilisation

La directive `ImapBase` permet de définir la valeur par défaut de la directive `base` des fichiers imagemap. Sa valeur est écrasée par la présence éventuelle d'une directive `base` dans le fichier imagemap. Si cette directive est absente, la valeur par défaut de la directive `base` est `http://nom_serveur/`.

## Voir aussi

- [[13-directives/usecanonicalname|UseCanonicalName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
