---
title: "RemoteIPProxyProtocolExceptions"
description: "Directive Apache RemoteIPProxyProtocolExceptions (mod_remoteip) — Désactive la prise en compte de l'en-tête PROXY pour certains hôtes ou réseaux. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_remoteip]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Désactive la prise en compte de l'en-tête PROXY pour certains hôtes ou réseaux |
| **Syntaxe** | `RemoteIPProxyProtocolExceptions host\|range [host\|range] [host\|range]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_remoteip\|mod_remoteip]] |
| **Compatibilité** | RemoteIPProxyProtocolExceptions est disponible à partir de la version 2.4.31 du serveur HTTP Apache |

## Utilisation

La directive `RemoteIPProxyProtocol` permet de contrôler la prise en compte de l'en-tête de connexion du protocole PROXY. Il est parfois souhaitable d'exiger pour certains clients la présence de l'en-tête PROXY, mais aussi de permettre aux autres clients de se connecter sans ce dernier. Cette directive permet à l'administrateur du serveur d'autoriser cette possibilité à un hôte isolé ou à une gamme d'hôtes au format CIDR.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
