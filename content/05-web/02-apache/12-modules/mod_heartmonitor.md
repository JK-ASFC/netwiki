---
title: "mod_heartmonitor"
description: "Module Apache mod_heartmonitor — Moniteur centralisé pour les serveurs d'origine mod_heartbeat. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_heartmonitor]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Moniteur centralisé pour les serveurs d'origine mod\_heartbeat |
| **Statut** | Expérimental |
| **Identificateur** | `heartmonitor_module` |
| **Fichier source** | `mod_heartmonitor.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

[[12-modules/mod_heartmonitor|mod_heartmonitor]] interprète les messages d'état générés par les serveurs d'origine pour lesquels [[12-modules/mod_heartbeat|mod_heartbeat]] est activé et fournit ces informations à [[12-modules/mod_lbmethod_heartbeat|mod_lbmethod_heartbeat]], ce qui permet d'utiliser la *lbmethod* "heartbeat" au sein des directives [[13-directives/proxypass|ProxyPass]].

Ce module utilise les services de [[12-modules/mod_slotmem_shm|mod_slotmem_shm]], lorsqu'il est disponible, au lieu d'un simple fichier texte. Aucune configuration supplémentaire n'est requise pour utiliser [[12-modules/mod_slotmem_shm|mod_slotmem_shm]].

> [!WARNING]
> Pour utiliser [[12-modules/mod_heartmonitor|mod_heartmonitor]], [[12-modules/mod_status|mod_status]] et [[12-modules/mod_watchdog|mod_watchdog]] doivent être soit des modules statiques, soit des modules dynamiques, et dans ce dernier cas, ils doivent être chargés avant [[12-modules/mod_heartmonitor|mod_heartmonitor]].

## Directives

- [[13-directives/heartbeatlisten|HeartbeatListen]]
- [[13-directives/heartbeatstorage-mod-heartmonitor|HeartbeatStorage]]
- [[13-directives/heartbeatmaxservers|HeartbeatMaxServers]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
