---
title: "Listen"
description: "Directive Apache Listen (mpm_common) — Les adresses IP et ports sur lesquels le serveur écoute. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Les adresses IP et ports sur lesquels le serveur écoute |
| **Syntaxe** | `Listen [adresse IP:]numéro port [protocole]` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |
| **Compatibilité** | L'argument *protocole* est supporté depuis la version 2.1.5 |

## Utilisation

La directive `Listen` permet de signifier à Apache httpd de ne se mettre à l'écoute que sur les adresses IP et ports spécifiés ; par défaut, le serveur répond aux requêtes en provenance de toutes les interfaces réseau. La directive `Listen` est dorénavant requise, et si elle est absente du fichier de configuration, le serveur refusera de démarrer. Ceci constitue un changement par rapport aux versions précédentes d'Apache httpd.

La directive `Listen` signifie au serveur de n'accepter les requêtes entrantes que vers le port ou le couple adresse-port spécifié. Si seulement un port est spécifié, le serveur se met à l'écoute sur ce port sur toutes les interfaces réseau. Si une adresse IP et un port sont spécifiés, le serveur va se mettre à l'écoute sur ce port sur l'interface réseau correspondant à l'adresse IP.

On peut utiliser autant de directives `Listen` que nécessaire pour spécifier plusieurs adresses et/ou ports à écouter. Le serveur répondra aux requêtes vers tous les adresses et ports spécifiés.

Par exemple, pour que le serveur accepte les connexions sur les ports 80 et 8000, utilisez :

```apache
Listen 80
Listen 8000
```

Pour que le serveur accepte les connexions sur deux interfaces et ports particuliers, spécifiez :

```apache
Listen 192.170.2.1:80
Listen 192.170.2.5:8000
```

Les adressee IPv6 doivent être entourées de crochets, comme dans l'exemple suivant :

```apache
Listen [2001:db8::a00:20ff:fea7:ccea]:80
```

L'argument optionnel *protocole* n'est pas nécessaire dans la plupart des configurations. S'il est absent, `https` est la valeur par défaut pour le port 443 et `http` l'est pour tous les autres ports. L'argument protocole sert à déterminer quel module doit traiter une requête, et à appliquer des optimisations spécifiques à certains protocoles à l'aide de la directive [[13-directives/acceptfilter|AcceptFilter]].

La spécification d'un protocole n'est nécessaire que si vous utilisez des ports non standards. Par exemple, pour configurer un site en `https` sur le port 8443 :

```apache
Listen 192.170.2.1:8443 https
```

> [!NOTE]
> **Condition d'erreur**
>
> Plusieurs directives `Listen` pour les mêmes adresse IP/port vont provoquer l'envoi d'un message d'erreur `Address already in use`.

## Voir aussi

- [[11-guides/01-generalites/problemes-lies-au-dns-avec-le-serveur-http-apache|Problèmes avec DNS]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
