---
title: "HeartbeatStorage (mod_lbmethod_heartbeat)"
description: "Directive Apache HeartbeatStorage (mod_lbmethod_heartbeat) — Indique le chemin permettant de lire les données heartbeat. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_lbmethod_heartbeat]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Indique le chemin permettant de lire les données heartbeat |
| **Syntaxe** | `HeartbeatStorage chemin-fichier` |
| **Valeur par défaut** | `HeartbeatStorage logs/hb.dat` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_lbmethod_heartbeat\|mod_lbmethod_heartbeat]] |

## Utilisation

La directive `HeartbeatStorage` permet de spécifier le chemin d'accès aux données heartbeat. Ce fichier texte n'est utilisé que si le module [[12-modules/mod_slotmem_shm|mod_slotmem_shm]] n'est pas chargé.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
