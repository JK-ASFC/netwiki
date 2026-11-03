---
title: "mod_suexec"
description: "Module Apache mod_suexec — Permet l'exécution des scripts CGI sous l'utilisateur et le groupe spécifiés. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_suexec]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet l'exécution des scripts CGI sous l'utilisateur et le groupe spécifiés |
| **Statut** | Extension |
| **Identificateur** | `suexec_module` |
| **Fichier source** | `mod_suexec.c` |

## Sommaire

Ce module, en combinaison avec son programme support [[10-commandes/suexec|suexec]], permet l'exécution des scripts CGI sous l'utilisateur et le groupe spécifiés.

## Directives

- [[13-directives/suexecusergroup|SuexecUserGroup]]

## Voir aussi

- [[11-guides/01-generalites/support-suexec|Support de SuEXEC]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
