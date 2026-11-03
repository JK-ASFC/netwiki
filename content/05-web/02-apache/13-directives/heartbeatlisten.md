---
title: "HeartbeatListen"
description: "Directive Apache HeartbeatListen (mod_heartmonitor) — Adresse multicast d'écoute des requêtes entrantes heartbeat. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_heartmonitor]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Adresse multicast d'écoute des requêtes entrantes heartbeat |
| **Syntaxe** | `HeartbeatListen addr:port` |
| **Valeur par défaut** | `disabled` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_heartmonitor\|mod_heartmonitor]] |

## Utilisation

La directive `HeartbeatListen` permet de spécifier l'adresse multicast sur laquelle le serveur va surveiller les informations d'état en provenance de serveurs où [[12-modules/mod_heartbeat|mod_heartbeat]] est activé. Cette adresse correspond en général à la valeur de la directive [[13-directives/heartbeataddress|HeartbeatAddress]] sur le serveur d'origine.

```apache
HeartbeatListen 239.0.0.1:27999
```

Tant que cette directive n'est pas utilisée, le module est désactivé.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
