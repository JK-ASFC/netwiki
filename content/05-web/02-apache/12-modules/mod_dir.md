---
title: "mod_dir"
description: "Module Apache mod_dir — Permet la redirection des adresses se terminant par un répertoire sans slash de fin et la mise à disposition des fichiers index de répertoire. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_dir]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet la redirection des adresses se terminant par un répertoire sans slash de fin et la mise à disposition des fichiers index de répertoire |
| **Statut** | Base |
| **Identificateur** | `dir_module` |
| **Fichier source** | `mod_dir.c` |

## Sommaire

L'index d'un répertoire peut provenir de deux sources :

- Un fichier écrit par l'utilisateur, dont le nom, en général appelé `index.html`, peut être défini à l'aide de la directive [[13-directives/directoryindex|DirectoryIndex]] fournie par le module [[12-modules/mod_dir|mod_dir]].
- Un listing généré par le serveur, par l'intermédiaire du module [[12-modules/mod_autoindex|mod_autoindex]].

Les deux fonctions sont bien distinctes, si bien que vous pouvez supprimer (ou remplacer) la génération automatique d'index, si vous le souhaitez.

Une redirection "slash de fin" est effectuée lorsque le serveur reçoit une requête pour une URL du style `http://nom-serveur/foo/nom-rep` où `nom-rep` est le nom d'un répertoire. Comme les répertoires nécessitent un slash de fin, [[12-modules/mod_dir|mod_dir]] effectue une redirection vers `http://nom-serveur/foo/nom-rep/`.

## Directives

- [[13-directives/directoryindex|DirectoryIndex]]
- [[13-directives/directoryindexredirect|DirectoryIndexRedirect]]
- [[13-directives/directoryslash|DirectorySlash]]
- [[13-directives/fallbackresource|FallbackResource]]
- [[13-directives/directorycheckhandler|DirectoryCheckHandler]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
