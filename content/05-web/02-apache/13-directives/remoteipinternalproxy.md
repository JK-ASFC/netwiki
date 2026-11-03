---
title: "RemoteIPInternalProxy"
description: "Directive Apache RemoteIPInternalProxy (mod_remoteip) — Déclare les adresses IP intranet clients comme dignes de confiance pour présenter la valeur RemoteIPHeader. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_remoteip]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Déclare les adresses IP intranet clients comme dignes de confiance pour présenter la valeur RemoteIPHeader |
| **Syntaxe** | `RemoteIPInternalProxy ip-mandataire\|ip-mandataire/sous-réseau\|nom-hôte ...` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_remoteip\|mod_remoteip]] |

## Utilisation

La directive [[13-directives/remoteipinternalproxy|RemoteIPInternalProxy]] permet d'ajouter une ou plusieurs adresses (ou blocs d'adresses) auxquelles on peut faire confiance pour présenter une valeur RemoteIPHeader valide de l'adresse IP du client. A la différence de la directive [[13-directives/remoteiptrustedproxy|RemoteIPTrustedProxy]], toute adresse IP présentée dans cet en-tête, y comprises les adresses intranet privées, sont considérées comme dignes de confiance lorsqu'elles sont indiquées par ces mandataires.

**Exemple à usage interne (répartiteur de charge)**

```apache
RemoteIPHeader X-Client-IP
RemoteIPInternalProxy 10.0.2.0/24
RemoteIPInternalProxy gateway.localdomain
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
