---
title: "mod_actions"
description: "Module Apache mod_actions — Exécution des scripts CGI en fonction du type de média ou de la méthode de requête. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_actions]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Exécution des scripts CGI en fonction du type de média ou de la méthode de requête. |
| **Statut** | Base |
| **Identificateur** | `actions_module` |
| **Fichier source** | `mod_actions.c` |

## Sommaire

Ce module possède deux directives. La directive [[13-directives/action|Action]] vous permet de lancer l'exécution de scripts CGI chaque fois qu'un fichier possédant un certain type de contenu MIME fait l'objet d'une requête. La directive [[13-directives/script|Script]] vous permet de lancer l'exécution de scripts CGI chaque fois que la requête utilise une méthode particulière. Ceci facilite grandement l'exécution de scripts qui traitent des fichiers.

## Directives

- [[13-directives/action|Action]]
- [[13-directives/script|Script]]

## Voir aussi

- [[12-modules/mod_cgi|mod_cgi]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
