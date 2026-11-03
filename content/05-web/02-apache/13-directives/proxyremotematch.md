---
title: "ProxyRemoteMatch"
description: "Directive Apache ProxyRemoteMatch (mod_proxy) — Le mandataire distant à utiliser pour traiter les requêtes correspondant à une expression rationnelle. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le mandataire distant à utiliser pour traiter les requêtes correspondant à une expression rationnelle |
| **Syntaxe** | `ProxyRemoteMatch regex remote-server [username:password]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Le troisième argument facultatif est disponible à partir de la version 2.4.59 du serveur HTTP Apache. |

## Utilisation

La directive `ProxyRemoteMatch` est identique à la directive [[13-directives/proxyremote|ProxyRemote]], à l'exception du premier argument qui est une expression rationnelle à mettre en correspondance avec l'URL de la requête.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
