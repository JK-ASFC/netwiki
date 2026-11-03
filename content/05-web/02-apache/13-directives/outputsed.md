---
title: "OutputSed"
description: "Directive Apache OutputSed (mod_sed) — Commande sed pour le filtrage des contenus de type réponse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_sed]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Commande sed pour le filtrage des contenus de type réponse |
| **Syntaxe** | `OutputSed commande-sed` |
| **Contexte** | répertoire, .htaccess |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_sed\|mod_sed]] |

## Utilisation

La directive `OutputSed` permet de spécifier la commande `sed` à exécuter dans le cadre du traitement d'une réponse.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
