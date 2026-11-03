---
title: "ProxyReceiveBufferSize"
description: "Directive Apache ProxyReceiveBufferSize (mod_proxy) — Taille du tampon réseau pour les connexions mandatées HTTP et FTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille du tampon réseau pour les connexions mandatées HTTP et FTP |
| **Syntaxe** | `ProxyReceiveBufferSize octets` |
| **Valeur par défaut** | `ProxyReceiveBufferSize 0` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

La directive `ProxyReceiveBufferSize` permet de spécifier une taille de tampon réseau explicite (TCP/IP) pour les connexions mandatées HTTP et FTP, afin d'améliorer le débit de données. Elle doit être supérieure à `512` ou définie à `0` pour indiquer que la taille de tampon par défaut du système doit être utilisée.

**Exemple**

```apache
ProxyReceiveBufferSize 2048
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
