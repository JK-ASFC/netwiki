---
title: "CGIMapExtension"
description: "Directive Apache CGIMapExtension (core) — Technique permettant de localiser l'interpréteur des scripts CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Technique permettant de localiser l'interpréteur des scripts CGI |
| **Syntaxe** | `CGIMapExtension chemin CGI .extension` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | NetWare uniquement |

## Utilisation

Cette directive permet de contrôler la manière dont Apache httpd trouve l'interpréteur servant à exécuter les scripts CGI. Par exemple, avec la définition `CGIMapExtension sys:\foo.nlm .foo`, tous les fichiers scripts CGI possédant une extension `.foo` seront passés à l'interpréteur FOO.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
