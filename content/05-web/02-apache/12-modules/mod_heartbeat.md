---
title: "mod_heartbeat"
description: "Module Apache mod_heartbeat — Envoie des messages d'état au mandataire frontal. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_heartbeat]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Envoie des messages d'état au mandataire frontal |
| **Statut** | Expérimental |
| **Identificateur** | `heartbeat_module` |
| **Fichier source** | `mod_heartbeat` |
| **Compatibilité** | Disponible à partir de la version 2.3 du serveur HTTP Apache |

## Sommaire

[[12-modules/mod_heartbeat|mod_heartbeat]] envoie à un moniteur [[12-modules/mod_heartmonitor|mod_heartmonitor]] des messages multicast l'informant du nombre de connexions courantes. En général, [[12-modules/mod_heartmonitor|mod_heartmonitor]] est chargé sur un serveur mandataire où [[12-modules/mod_lbmethod_heartbeat|mod_lbmethod_heartbeat]] est chargé, ce qui permet d'utiliser la *lbmethod* "heartbeat" au sein des directives [[13-directives/proxypass|ProxyPass]].

Le module [[12-modules/mod_heartbeat|mod_heartbeat]] est chargé sur le serveur d'origine qui sert les requêtes via le serveur mandataire.

> [!WARNING]
> Pour utiliser [[12-modules/mod_heartbeat|mod_heartbeat]], [[12-modules/mod_status|mod_status]] et [[12-modules/mod_watchdog|mod_watchdog]] doivent être soit des modules statiques, soit des modules dynamiques, et dans ce dernier cas, ils doivent être chargés avant [[12-modules/mod_heartbeat|mod_heartbeat]].

## Utilisation de la sortie de mod\_heartbeat

Chaque seconde, ce module génère un paquet multicast UDP contenant le nombre de threads/processus occupés et en attente. Le paquet possède un format ASCII simple similaire aux paramètres de requête GET en HTTP.

**Exemple de paquet**

```
v=1&ready=75&busy=0
```

Les utilisateurs disposeront dans le futur de nouvelles variables en plus de busy et ready, et toujours séparées par des '&'.

## Directives

- [[13-directives/heartbeataddress|HeartbeatAddress]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
