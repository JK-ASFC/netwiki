---
title: "mod_watchdog"
description: "Module Apache mod_watchdog — Fournit une infrastructure permettant à d'autres modules d'exécuter des tâches périodiques. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_watchdog]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit une infrastructure permettant à d'autres modules d'exécuter des tâches périodiques. |
| **Statut** | Base |
| **Identificateur** | `watchdog_module` |
| **Fichier source** | `mod_watchdog.c` |
| **Compatibilité** | Disponible à partir de la version 2.3 du serveur HTTP Apache |

## Sommaire

Le module [[12-modules/mod_watchdog|mod_watchdog]] définit des branchements (hooks) programmés pour permettre à d'autres modules d'exécuter des tâches périodiques. Ces modules peuvent enregistrer des gestionnaires (handlers) pour les branchements de [[12-modules/mod_watchdog|mod_watchdog]]. Actuellement, seuls les modules suivants de la distribution Apache utilisent cette fonctionnalité :

- [[12-modules/mod_heartbeat|mod_heartbeat]]
- [[12-modules/mod_heartmonitor|mod_heartmonitor]]
- [[12-modules/mod_md|mod_md]]
- [[12-modules/mod_proxy_hcheck|mod_proxy_hcheck]]

> [!WARNING]
> Pour qu'un module puisse utiliser la fonctionnalité de [[12-modules/mod_watchdog|mod_watchdog]], ce dernier doit être lié statiquement avec le serveur httpd ; s'il a été lié dynamiquement, il doit être chargé avant l'appel au module qui doit utiliser sa fonctionnalité.

## Directives

- [[13-directives/watchdoginterval|WatchdogInterval]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
