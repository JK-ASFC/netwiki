---
title: "ReflectorHeader"
description: "Directive Apache ReflectorHeader (mod_reflector) — Renvoie un en-tête d'entrée dans les en-têtes de sortie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_reflector]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Renvoie un en-tête d'entrée dans les en-têtes de sortie |
| **Syntaxe** | `ReflectorHeader en-tête-entrée [en-tête-sortie]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Base |
| **Module** | [[12-modules/mod_reflector\|mod_reflector]] |

## Utilisation

Cette directive permet de contrôler la répercution des en-têtes de la requête dans la réponse. Le premier argument correspond au nom de l'en-tête à copier. Si le second argument (optionnel) est spécifié, il définit le nom sous lequel l'en-tête sera répercuté dans la réponse ; dans le cas contraire, c'est le nom de l'en-tête original qui sera utilisé.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
