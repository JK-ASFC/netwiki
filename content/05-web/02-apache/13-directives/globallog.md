---
title: "GlobalLog"
description: "Directive Apache GlobalLog (mod_log_config) — Définit le nom et le format du fichier journal. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_log_config]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom et le format du fichier journal |
| **Syntaxe** | `GlobalLog file\|pipe format\|nickname [env=[!]environment-variable\| expr=expression]` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_log_config\|mod_log_config]] |
| **Compatibilité** | Disponible à partir de la version 2.4.19 du serveur HTTP Apache |

## Utilisation

La directive `GlobalLog` permet de spécifier un journal partagé entre le serveur principal et tous les serveurs virtuels définis.

Elle est identique à la directive `CustomLog` à ces différences près :

- Elle n'est pas valide dans un contexte de serveur virtuel.
- A la différence d'une directive `CustomLog` définie globalement, elle est prise en compte par les serveurs virtuels qui définissent leur propre directive `CustomLog`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
