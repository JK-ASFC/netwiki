---
title: "ProxyRemote"
description: "Directive Apache ProxyRemote (mod_proxy) — Mandataire distant à utiliser pour traiter certaines requêtes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Mandataire distant à utiliser pour traiter certaines requêtes |
| **Syntaxe** | `ProxyRemote match remote-server [username:password]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Le troisième argument facultatif est disponible depuis la version 2.4.59 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir des mandataires distants pour ce mandataire. *match* est soit le nom d'un protocole que supporte le serveur distant, soit une URL partielle pour laquelle le serveur distant devra être utilisé, soit `*` pour indiquer que le serveur distant doit être utilisé pour toutes les requêtes. *remote-server* est une URL partielle correspondant au serveur distant. Syntaxe :

```
remote-server =
    scheme://hostname[:port]
```

*scheme* est effectivement le protocole à utiliser pour communiquer avec le serveur distant ; ce module ne supporte que `http` et `https`. Lorsqu'on utilise `https`, les requêtes sont redirigées par le mandataire distant en utilisant la méthode HTTP CONNECT.

**Exemple**

```apache
ProxyRemote "http://goodguys.example.com/" "http://mirrorguys.example.com:8000"
ProxyRemote "*" "http://cleverproxy.localdomain"
ProxyRemote "ftp" "http://ftpproxy.mydomain:8080"
```

Dans la dernière ligne de l'exemple, le mandataire va faire suivre les requêtes FTP, encapsulées dans une autre requête mandatée HTTP, vers un autre mandataire capable de les traiter.

Cette directive supporte aussi les configurations de mandataire inverse ; un serveur web d'arrière-plan peut être intégré dans l'espace d'URL d'un serveur virtuel, même si ce serveur est caché par un autre mandataire direct.

Le troisième argument optionnel *username:password* permet de spécifier des données d'authentification basiques à transmettre au mandataire distant défini. Ces données d'authentification seront toujoujours envoyées sans attendre que le mandataire distant n'effectue une demande d'authentification. La variable d'environnement [[12-modules/mod_proxy_http|Proxy-Chain-Auth]] n'est plus prise en compte si cet argument est utilisé.

> [!NOTE]
> **Résolution DNS et mandataires directs**
>
> Lorsqu’un mandataire direct (distant) est configuré, la résolution DNS du nom d’hôte originel/dorsal n’est effectuée que sur le mandataire direct. Toute règle [[13-directives/proxyblock|ProxyBlock]] qui limite l’accès à des adresses IP spécifiques doit être définie au niveau du mandataire direct.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
