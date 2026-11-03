---
title: "H2WebSockets"
description: "Directive Apache H2WebSockets (mod_http2) — Active/désactive les WebSockets via HTTP/2. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active/désactive les WebSockets via HTTP/2 |
| **Syntaxe** | `H2WebSockets on\|off` |
| **Valeur par défaut** | `H2WebSockets off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache |

## Utilisation

La directive `H2WebSockets` permet d'activer ou de désactiver l'amorçage des WebSockets via le protocole HTTP/2. Cette extension du protocole est définie dans la RFC 8441.

Ces requêtes sont similaires à CONNECT, mais elles possèdent l'en-tête supplémentaire ':protocol'. Elles sont transformées au sein du module en leurs équivalents HTTP/1.1 avant d'être soumises au traitement interne.

Cela signifie que les WebSockets HTTP/2 peuvent être utilisés dans le cadre d'une directive [[13-directives/proxypass|ProxyPass]] avec le paramètre 'upgrade=websocket' sans autres modifications.

Pour les modules tiers qui gèrent les WebSockets directement dans le serveur, l'amorçage du protocole lui-même fonctionnera aussi. Dans le cas de HTTP/2 cependant, le transfert de données nécessite une prise en charge supplémentaire. Le WebSocket négocié sera incapable d'utiliser le socket de connexion du client pour examiner les évènements d'entrée/sortie concernés.

Cette fonctionnalité étant susceptible de briser la compatibilité ascendante pour de tels modules tiers, elle n'est pas activée par défaut.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
