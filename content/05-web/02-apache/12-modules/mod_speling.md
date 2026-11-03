---
title: "mod_speling"
description: "Module Apache mod_speling — Tente de corriger les erreurs de casse dans les URLs ou les fautes de frappe mineures. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_speling]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Tente de corriger les erreurs de casse dans les URLs ou les fautes de frappe mineures. |
| **Statut** | Extension |
| **Identificateur** | `speling_module` |
| **Fichier source** | `mod_speling.c` |

## Sommaire

Il arrive que des requêtes pour des documents ne puissent pas être traitées par le serveur Apache de base à cause d'une erreur de frappe ou de casse. Ce module permet de traiter ce problème en essayant de trouver un document correspondant, même lorsque tous les autres modules y ont renoncé. Sa méthode de travail consiste à comparer chaque nom de document du répertoire demandé avec le document de la requête **sans tenir compte de la casse**, et en acceptant **jusqu'à une erreur** (insertion, omission, inversion de caractère ou caractère erroné). Une liste de tous les documents qui correspondent est alors élaborée en utilisant cette stratégie. Ce module traite aussi les **erreurs dans les extensions de fichiers**.

Si après le parcours du répertoire,

- aucun document correspondant n'a été trouvé, Apache procèdera normalement et renverra une erreur (`404 - document not found`).
- un seul document correspondant pratiquement à la requête a été trouvé, celui-ci est renvoyé sous la forme d'une réponse de redirection (`301 - Moved Permanently`).
- plusieurs documents pouvant correspondre ont été trouvés, une liste des documents est envoyée au client afin que ce dernier puisse sélectionner le document correct (`300 - Multiple Choices`).

## Directives

- [[13-directives/checkspelling|CheckSpelling]]
- [[13-directives/checkcaseonly|CheckCaseOnly]]
- [[13-directives/checkbasenamematch|CheckBasenameMatch]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
