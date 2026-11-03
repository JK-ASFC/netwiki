---
title: "RemoteIPProxyProtocol"
description: "Directive Apache RemoteIPProxyProtocol (mod_remoteip) — Active ou désactive la gestion du protocole PROXY. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_remoteip]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active ou désactive la gestion du protocole PROXY |
| **Syntaxe** | `RemoteIPProxyProtocol On\|Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_remoteip\|mod_remoteip]] |
| **Compatibilité** | Disponible à partir de la version 2.4.31 du serveur HTTP Apache |

## Utilisation

La directive `RemoteIPProxyProtocol` permet d'activer ou de désactiver la prise en compte et la gestion de l'en-tête de connexion du protocole PROXY. Si elle est définie à `On`, la demande du client *doit* envoyer l'en-tête approprié pour chaque nouvelle connexion, sinon cette dernière sera fermée à moins qu'il ne fasse partie de la liste, définie via la directive `RemoteIPProxyProtocolDisableHosts`, des hôtes pour lesquels le protocole PROXY est désactivé.

Bien que cette directive peut être définie au niveau de n'importe quel serveur virtuel, il est important de garder à l'esprit que, étant donné que le protocole PROXY est basé sur la connexion et agnostique quant au protocle, son activation/désactivation est basée sur le couple adresse IP/port. Cela signifie que si plusieurs serveurs virtuels à base de nom sont configurés avec le même couple adresse IP/port, et si vous activez le protocole PROXY pour l'un d'entre eux, il le sera aussi pour tous les autres (avec le même couple adresse IP/port). Cela signifie aussi que si vous tentez d'activer le protocole PROXY pour un serveur virtuel et de le désactiver pour un autre, cela ne marchera pas ; dans ce dernier cas, la dernière directive l'emporte sur les autres et une notification sera enregistrée dans le journal pour indiquer les réglages qui ont été annulés.

```apache
Listen 80
<VirtualHost *:80>
    ServerName www.example.com
    RemoteIPProxyProtocol On

    #Les requêtes pour ce serveur virtuel doivent contenir un en-tête du
    #protocole PROXY. Si ce n'est pas le cas, la connexion sera fermée.
</VirtualHost>

Listen 8080
<VirtualHost *:8080>
    ServerName www.example.com
    RemoteIPProxyProtocol On
    RemoteIPProxyProtocolExceptions 127.0.0.1 10.0.0.0/8

    #Les requêtes pour ce serveur virtuel doivent contenir un en-tête du
    #protocole PROXY. Si ce n'est pas le cas, la connexion sera fermée à moins
    que sa source ne soit localhost ou la gamme d'adresses RFC1918 10.x.x.x
</VirtualHost>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
