---
title: "RemoteIPHeader"
description: "Directive Apache RemoteIPHeader (mod_remoteip) — Définit le champ d'en-tête qui contiendra les adresses IP du client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_remoteip]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le champ d'en-tête qui contiendra les adresses IP du client |
| **Syntaxe** | `RemoteIPHeader en-tête` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_remoteip\|mod_remoteip]] |

## Utilisation

La directive [[13-directives/remoteipheader|RemoteIPHeader]] indique à [[12-modules/mod_remoteip|mod_remoteip]] de traiter la valeur de l'*en-tête* spécifié comme l'adresse IP du client, ou comme une liste d'adresses IP clients intermédiaires, en fonction de la configuration des directives [[13-directives/remoteipinternalproxy|RemoteIPInternalProxy]] et [[13-directives/remoteiptrustedproxy|RemoteIPTrustedProxy]]. Si ces deux dernières directives ne sont pas utilisées, [[12-modules/mod_remoteip|mod_remoteip]] traitera tout hôte présentant une adresse non interne dans l'en-tête [[13-directives/remoteipheader|RemoteIPHeader]] comme hôte de confiance.

> [!WARNING]
> Si ces deux dernières directives ne sont pas utilisées, [[12-modules/mod_remoteip|mod_remoteip]] traitera tout hôte présentant une adresse non interne dans l'en-tête [[13-directives/remoteipheader|RemoteIPHeader]] comme hôte de confiance.

**Exemple à usage interne (répartiteur de charge)**

```apache
RemoteIPHeader X-Client-IP
```

**Exemple dans le cas d'un mandataire**

```apache
RemoteIPHeader X-Forwarded-For
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
