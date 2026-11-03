---
title: "mod_cgid"
description: "Module Apache mod_cgid — Exécution des scripts CGI par l'intermédiaire d'un démon CGI externe. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_cgid]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Exécution des scripts CGI par l'intermédiaire d'un démon CGI externe |
| **Statut** | Base |
| **Identificateur** | `cgid_module` |
| **Fichier source** | `mod_cgid.c` |
| **Compatibilité** | Uniquement compatible avec les MPMs Unix threadés |

## Sommaire

Exceptées les optimisations et la directive additionnelle [[13-directives/scriptsock|ScriptSock]] décrite ci-dessous, [[12-modules/mod_cgid|mod_cgid]] a un comportement similaire à celui de [[12-modules/mod_cgi|mod_cgi]]. **Voir le résumé de [[12-modules/mod_cgi|mod_cgi]] pour plus de détails à propos d'Apache et CGI.**

Sur certains systèmes d'exploitation de type unix, le lancement (forking) d'un processus depuis un serveur multi-threadé est une opération très lourde car le nouveau processus va répliquer tous les threads du processus parent. Pour éviter cette dépense de ressouces pour chaque invocation d'un programme CGI, [[12-modules/mod_cgid|mod_cgid]] crée un démon externe qui est responsable du branchement de processus enfants destinés au lancement de scripts CGI. Le serveur principal communique avec ce démon par l'intermédiaire d'une socket de domaine unix.

Si un MPM multi-threadé a été sélectionné lors du processus de compilation, c'est ce module qui est utilisé par défaut à la place de [[12-modules/mod_cgi|mod_cgi]]. Du point de vue de l'utilisateur, ce module est identique à [[12-modules/mod_cgi|mod_cgi]] quant à sa configuration et son utilisation. La seule différence est la directive additionnelle `ScriptSock` qui permet de définir le nom du socket à utiliser pour la communication avec le démon CGI.

## Directives

- [[13-directives/scriptsock|ScriptSock]]
- [[13-directives/cgidscripttimeout|CGIDScriptTimeout]]
- [[13-directives/scriptlog|ScriptLog]] (définie dans [[12-modules/mod_cgi|mod_cgi]])
- [[13-directives/scriptloglength|ScriptLogLength]] (définie dans [[12-modules/mod_cgi|mod_cgi]])
- [[13-directives/scriptlogbuffer|ScriptLogBuffer]] (définie dans [[12-modules/mod_cgi|mod_cgi]])

## Voir aussi

- [[12-modules/mod_cgi|mod_cgi]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
