---
title: "HeartbeatAddress"
description: "Directive Apache HeartbeatAddress (mod_heartbeat) — Adresse multicast à laquelle envoyer les requêtes heartbeat. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_heartbeat]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Adresse multicast à laquelle envoyer les requêtes heartbeat |
| **Syntaxe** | `HeartbeatAddress addr:port` |
| **Valeur par défaut** | `disabled` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_heartbeat\|mod_heartbeat]] |

## Utilisation

La directive `HeartbeatAddress` permet de spécifier l'adresse multicast à laquelle [[12-modules/mod_heartbeat|mod_heartbeat]] va envoyer ses informations. En général, cette adresse correspond à la valeur définie par la directive [[13-directives/heartbeatlisten|HeartbeatListen]] sur le serveur mandataire frontal.

```apache
HeartbeatAddress 239.0.0.1:27999
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
