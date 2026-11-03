---
title: "HeartbeatStorage (mod_heartmonitor)"
description: "Directive Apache HeartbeatStorage (mod_heartmonitor) — Chemin vers le stockage des données heartbeat lorsqu'on utilise un fichier bidimensionnel (flat-file). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_heartmonitor]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin vers le stockage des données heartbeat lorsqu'on utilise un fichier bidimensionnel (flat-file) |
| **Syntaxe** | `HeartbeatStorage chemin fichier` |
| **Valeur par défaut** | `HeartbeatStorage logs/hb.dat` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_heartmonitor\|mod_heartmonitor]] |

## Utilisation

La directive `HeartbeatStorage` permet de spécifier le chemin de stockage des données heartbeat. Ce fichier bidimensionnel n'est utilisé que si [[12-modules/mod_slotmem_shm|mod_slotmem_shm]] n'est pas chargé et si la directive [[13-directives/heartbeatmaxservers|HeartbeatMaxServers]] est définie à 0.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
