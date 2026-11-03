---
title: "MDMembers"
description: "Directive Apache MDMembers (mod_md) — Définit si les alias de noms de domaines sont automatiquement ajoutés. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si les alias de noms de domaines sont automatiquement ajoutés. |
| **Syntaxe** | `MDMembers auto\|manual` |
| **Valeur par défaut** | `MDMembers auto` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir si les valeurs de [[13-directives/servername|ServerName]] et [[13-directives/serveralias|ServerAlias]] sont automatiquement ajoutées en tant que membres d'un domaine géré.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
