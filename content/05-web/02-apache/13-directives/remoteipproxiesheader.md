---
title: "RemoteIPProxiesHeader"
description: "Directive Apache RemoteIPProxiesHeader (mod_remoteip) — Déclare le champ d'en-tête qui contiendra toutes les adresses IP intermédiaires. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_remoteip]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Déclare le champ d'en-tête qui contiendra toutes les adresses IP intermédiaires |
| **Syntaxe** | `RemoteIPProxiesHeader Nom_en-tête` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_remoteip\|mod_remoteip]] |

## Utilisation

La directive [[13-directives/remoteipproxiesheader|RemoteIPProxiesHeader]] permet de spécifier l'en-tête dans lequel [[12-modules/mod_remoteip|mod_remoteip]] va collecter une liste de toutes les adresses IP clients intermédiaires auxquelles on pourra faire confiance pour résoudre l'adresse IP client de la requête. Notez que les adresses intermédiaires [[13-directives/remoteiptrustedproxy|RemoteIPTrustedProxy]] sont enregistrées dans cet en-tête, alors que toute adresse intermédiaire [[13-directives/remoteipinternalproxy|RemoteIPInternalProxy]] est omise.

**Exemple**

```apache
RemoteIPHeader X-Forwarded-For
RemoteIPProxiesHeader X-Forwarded-By
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
