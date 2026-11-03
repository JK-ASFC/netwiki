---
title: "RemoteIPTrustedProxyList"
description: "Directive Apache RemoteIPTrustedProxyList (mod_remoteip) — Déclare les adresses IP intranet clients comme dignes de confiance pour présenter la valeur RemoteIPHeader. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_remoteip]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Déclare les adresses IP intranet clients comme dignes de confiance pour présenter la valeur RemoteIPHeader |
| **Syntaxe** | `RemoteIPTrustedProxyList nom-fichier` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_remoteip\|mod_remoteip]] |

## Utilisation

La directive [[13-directives/remoteiptrustedproxylist|RemoteIPTrustedProxyList]] permet de spécifier un fichier parcouru au démarrage du serveur pour construire une liste d'adresses (ou blocs d'adresses), auxquelles on peut faire confiance pour présenter une valeur RemoteIPHeader valide de l'adresse IP du client.

Le caractère '`#`' indique une ligne de commentaires, sinon, toutes les lignes séparées par un caractère nouvelle ligne ou tous les éléments d'une ligne séparés par un espace sont traités de la même façon qu'avec la directive [[13-directives/remoteiptrustedproxy|RemoteIPTrustedProxy]].

**Exemple d'adresse de confiance (répartiteur de charge**

```apache
RemoteIPHeader X-Forwarded-For
RemoteIPTrustedProxyList conf/trusted-proxies.lst
```

**conf/mandataires-de-confiance.lst contents**

```
# Mandataires externes identifiés
192.0.2.16/28         #groupe wap phone de mandataires
proxy.isp.example.com #un FAI bien connu
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
