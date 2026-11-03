---
title: "CheckSpelling"
description: "Directive Apache CheckSpelling (mod_speling) — Active le module de correction. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_speling]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active le module de correction |
| **Syntaxe** | `CheckSpelling on\|off` |
| **Valeur par défaut** | `CheckSpelling Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_speling\|mod_speling]] |

## Utilisation

Cette directive permet d'activer ou de désactiver le module de correction. Lorsqu'il est activé, rappelez-vous que :

- le parcours du répertoire nécessaire à la correction aura un impact sur les performances du serveur lorsque de nombreuses corrections devront être effectuées au même moment.
- l'arborescence ne doit pas contenir de documents sensibles qui pourraient être considérés par erreur comme correspondant à la requête.
- le module ne corrige pas les noms d'utilisateur mal orthographiés (comme dans `http://mon.serveur/~apahce/`), mais seulement les noms de fichiers ou de répertoires.
- les corrections s'appliquent strictement aux fichiers existants, si bien qu'une requête pour `<Location /status>` pour être traitée de manière incorrecte comme une requête pour le fichier négocié "`/stats.html`".

[[12-modules/mod_speling|mod_speling]] ne doit pas être activé pour des répertoires où [[12-modules/mod_dav|DAV]] l'est aussi, car il va essayer de "corriger" les noms des ressources nouvellement créées en fonction des noms de fichiers existants ; par exemple, lors du chargement d'un nouveau document `doc43.html`, il est possible qu'il redirige vers un document existant `doc34.html`, ce qui ne correspond pas à ce que l'on souhaite.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
