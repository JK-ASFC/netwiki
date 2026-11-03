---
title: "DirectoryCheckHandler"
description: "Directive Apache DirectoryCheckHandler (mod_dir) — Définit la réponse de ce module lorsqu'un autre gestionnaire est utilisé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dir]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit la réponse de ce module lorsqu'un autre gestionnaire est utilisé |
| **Syntaxe** | `DirectoryCheckHandler On\|Off` |
| **Valeur par défaut** | `DirectoryCheckHandler Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_dir\|mod_dir]] |
| **Compatibilité** | Disponible depuis la version 2.4.8 du serveur HTTP Apache. Les versions antérieures à 2.4 se comportaient implicitement comme si "DirectoryCheckHandler ON" avait été spécifié. |

## Utilisation

La directive `DirectoryCheckHandler` permet de faire en sorte que [[12-modules/mod_dir|mod_dir]] recherche un index de répertoire ou ajoute des slashes de fin lorsqu'un autre gestionnaire a été défini pour l'URL considérée. Les gestionnaires peuvent être définis via des directives telles que [[13-directives/sethandler|SetHandler]] ou par d'autres modules comme [[12-modules/mod_rewrite|mod_rewrite]] au cours d'une substitution par répertoire.

Lorsqu'elle est définie à `On`, [[12-modules/mod_dir|mod_dir]] ne prend aucune mesure si un autre gestionnaire a déjà été défini pour l'URL.

Lorsqu'elle est définie à `Off` (la valeur par défaut), [[12-modules/mod_dir|mod_dir]] traite la requête quel que soit le gestionnaire éventuellement défini. Ceci permet de servir des index de répertoires même si une directive `SetHandler` a été définie pour un répertoire entier, mais peut aussi être à l'origine de conflits avec d'autres modules comme [[12-modules/mod_rewrite|mod_rewrite]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
