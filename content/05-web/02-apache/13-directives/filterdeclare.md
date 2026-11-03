---
title: "FilterDeclare"
description: "Directive Apache FilterDeclare (mod_filter) — Déclare un filtre intelligent. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_filter]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Déclare un filtre intelligent |
| **Syntaxe** | `FilterDeclare nom_filtre [type]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Base |
| **Module** | [[12-modules/mod_filter\|mod_filter]] |

## Utilisation

Cette directive permet de déclarer un filtre en sortie associé à un en-tête ou une variable d'environnement qui déterminera les conditions de son exécution. Le premier argument est le *nom du filtre* destiné à être utilisé dans les directives [[13-directives/filterprovider|FilterProvider]], [[13-directives/filterchain|FilterChain]] et [[13-directives/filterprotocol|FilterProtocol]].

Le dernier argument (optionnel) est le type du filtre, et peut prendre les valeurs de `ap_filter_type`, à savoir `RESOURCE` (valeur par défaut), `CONTENT_SET`, `PROTOCOL`, `TRANSCODE`, `CONNECTION` ou `NETWORK`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
