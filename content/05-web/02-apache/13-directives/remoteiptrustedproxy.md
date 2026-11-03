---
title: "RemoteIPTrustedProxy"
description: "Directive Apache RemoteIPTrustedProxy (mod_remoteip) — Déclare les adresses IP clientes de l'intranet dignes de confiance pour présenter la valeur RemoteIPHeader. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_remoteip]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Déclare les adresses IP clientes de l'intranet dignes de confiance pour présenter la valeur RemoteIPHeader |
| **Syntaxe** | `RemoteIPTrustedProxy ip-mandataire\|ip-mandataire/sous-réseau\|nom-hôte ...` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_remoteip\|mod_remoteip]] |

## Utilisation

La directive [[13-directives/remoteiptrustedproxy|RemoteIPTrustedProxy]] permet d'ajouter une ou plusieurs adresses, ou blocs d'adresses, auxquelles on peut faire confiance pour présenter une valeur RemoteIPHeader valide de l'adresse IP du client. A la différence de la directive [[13-directives/remoteipinternalproxy|RemoteIPInternalProxy]], toutes les adresses IP intranet ou privées indiquées par de tels mandataires, y compris les blocs d'adresses 10/8, 172.16/12, 192.168/16, 169.254/16 et 127/8 (ou située en dehors du bloc IPv6 public 2000::/3), ne sont pas dignes de confiance en tant qu'adresses IP distantes, et se situent à gauche dans le contenu de l'en-tête [[13-directives/remoteipheader|RemoteIPHeader]].

**Exemple d'adresse de confiance (répartiteur de charge**

```apache
RemoteIPHeader X-Forwarded-For
RemoteIPTrustedProxy 10.0.2.16/28
RemoteIPTrustedProxy proxy.example.com
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
