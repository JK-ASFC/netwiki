---
title: "ScriptLogBuffer"
description: "Directive Apache ScriptLogBuffer (mod_cgi) — Taille maximale des requêtes PUT ou POST qui seront enregistrées dans le journal du script. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille maximale des requêtes PUT ou POST qui seront enregistrées dans le journal du script |
| **Syntaxe** | `ScriptLogBuffer octets` |
| **Valeur par défaut** | `ScriptLogBuffer 1024` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_cgi\|mod_cgi]] |

## Utilisation

Cette directive permet de limiter la taille du corps de toute entité PUT ou POST qui sera enregistrée dans le journal, afin de prévenir une croissance trop importante et trop rapide du fichier journal due à la réception de corps de requête de grandes tailles. Cette directive permet de modifier cette taille maximale, dont la valeur par défaut est de 1024 octets.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
