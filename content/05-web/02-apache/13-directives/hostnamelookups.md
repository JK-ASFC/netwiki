---
title: "HostnameLookups"
description: "Directive Apache HostnameLookups (core) — Active la recherche DNS sur les adresses IP des clients. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la recherche DNS sur les adresses IP des clients |
| **Syntaxe** | `HostnameLookups On\|Off\|Double` |
| **Valeur par défaut** | `HostnameLookups Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive active la recherche DNS afin de pouvoir journaliser les nom d'hôtes (et les passer aux programmes CGI et aux inclusions SSI via la variable `REMOTE_HOST`). La valeur `Double` déclenche une double recherche DNS inverse. En d'autres termes, une fois la recherche inverse effectuée, on lance une recherche directe sur le résultat de cette dernière. Au moins une des adresses IP fournies par la recherche directe doit correspondre à l'adresse originale (ce que l'on nomme `PARANOID` dans la terminologie "tcpwrappers").

Quelle que soit la configuration, lorsqu'on utilise [[12-modules/mod_authz_host|mod_authz_host]] pour contrôler l'accès en fonction du nom d'hôte, une double recherche DNS inverse est effectuée, sécurité oblige. Notez cependant que le résultat de cette double recherche n'est en général pas accessible, à moins que vous n'ayez spécifié `HostnameLookups Double`. Par exemple, si vous n'avez spécifié que `HostnameLookups On`, et si une requête concerne un objet protégé par des restrictions en fonction du nom d'hôte, quel que soit le résultat de la double recherche inverse, les programmes CGI ne recevront que le résultat de la recherche inverse simple dans la variable `REMOTE_HOST`.

La valeur par défaut est `Off` afin de préserver le traffic réseau des sites pour lesquels la recherche inverse n'est pas vraiment nécessaire. Cette valeur par défaut est aussi bénéfique pour les utilisateurs finaux car il n'ont ainsi pas à subir de temps d'attente supplémentaires dus aux recherches DNS. Les sites fortement chargés devraient laisser cette directive à `Off`, car les recherches DNS peuvent prendre des temps très longs. Vous pouvez éventuellement utiliser hors ligne l'utilitaire [[10-commandes/logresolve|logresolve]], compilé par défaut dans le sous-répertoire `bin` de votre répertoire d'installation, afin de déterminer les noms d'hôtes associés aux adresses IP journalisées.

Enfin, si vous avez des [[12-modules/mod_authz_host|directives Require à base de nom]], une recherche de nom d'hôte sera effectuée quelle que soit la définition de la directive `HostnameLookups`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
