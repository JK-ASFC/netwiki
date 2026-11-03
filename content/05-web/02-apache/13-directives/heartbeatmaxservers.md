---
title: "HeartbeatMaxServers"
description: "Directive Apache HeartbeatMaxServers (mod_heartmonitor) — Spécifie le nombre maximal de serveurs qui pourront envoyer des requêtes heartbeat à ce serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_heartmonitor]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie le nombre maximal de serveurs qui pourront envoyer des requêtes heartbeat à ce serveur. |
| **Syntaxe** | `HeartbeatMaxServers nombre-de-serveurs` |
| **Valeur par défaut** | `HeartbeatMaxServers 10` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_heartmonitor\|mod_heartmonitor]] |
| **Compatibilité** | La valeur 0 est prise en charge à partir de la version 2.4.55 du serveur HTTP Apache |

## Utilisation

La directive `HeartbeatMaxServers` spécifie le nombre maximal de serveurs qui pourront envoyer des requêtes heartbeat à ce serveur de monitoring. Elle permet ainsi de contrôler la quantité de mémoire partagée allouée pour le stockage des données heartbeat lorsqu'on utilise [[12-modules/mod_slotmem_shm|mod_slotmem_shm]].

Définissez cette directive à `0` pour utiliser un stockage de type fichier bidimensionnel (flat-file) au lieu de la mémoire partagée (c’est-à-dire sans charger [[12-modules/mod_slotmem_shm|mod_slotmem_shm]]). Lorsqu’on utilise la mémoire partagée, la valeur doit être supérieure ou égale à 10.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
