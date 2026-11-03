---
title: "mod_lbmethod_heartbeat"
description: "Module Apache mod_lbmethod_heartbeat — Algorithme d'ordonnancement de répartition de charge pour mod_proxy_balancer basé sur le comptage de trafic Heartbeat. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_lbmethod_heartbeat]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Algorithme d'ordonnancement de répartition de charge pour mod\_proxy\_balancer basé sur le comptage de trafic Heartbeat |
| **Statut** | Expérimental |
| **Identificateur** | `lbmethod_heartbeat_module` |
| **Fichier source** | `mod_lbmethod_heartbeat.c` |
| **Compatibilité** | Disponible depuis la version 2.3 d'Apache |

## Sommaire

`lbmethod=heartbeat` utilise les services du module [[12-modules/mod_heartmonitor|mod_heartmonitor]] pour répartir la charge entre les serveurs d'origine qui fournissent des données heartbeat via le module [[12-modules/mod_heartbeat|mod_heartbeat]].

Son algorithme de répartition de charge favorise les serveurs dont la capacité de traitement moyenne répartie dans le temps est la plus importante, mais il ne sélectionne pas forcément le serveur qui présente la disponibilité instantanée la plus importante. Les serveurs qui ne possèdent aucun client actif sont pénalisés, car ils sont considérés comme non entièrement initialisés.

## Directives

- [[13-directives/heartbeatstorage-mod-lbmethod-heartbeat|HeartbeatStorage]]

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
