---
title: "FilterProvider"
description: "Directive Apache FilterProvider (mod_filter) — Enregistre un filtre de contenu. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_filter]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre un filtre de contenu |
| **Syntaxe** | `FilterProvider nom_filtre nom_fournisseur expression` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Base |
| **Module** | [[12-modules/mod_filter\|mod_filter]] |

## Utilisation

Cette directive permet d'associer un *fournisseur* au filtre intelligent. Le fournisseur sera invoqué si et seulement si l'*expression* est évaluée vraie lorsque le sélecteur de filtre est appelé pour la première fois.

*nom fournisseur* doit avoir été enregistré au cours du chargement d'un module à l'aide de `ap_register_output_filter`.

*expression* est une expression [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|ap_expr]].

## Voir aussi

- [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
