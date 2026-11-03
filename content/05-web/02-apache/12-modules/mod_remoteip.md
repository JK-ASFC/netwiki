---
title: "mod_remoteip"
description: "Module Apache mod_remoteip — Remplace l'adresse IP du client pour la requête par l'adresse IP présentée par un mandataire ou un répartiteur de charge via les en-têtes de la requête. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_remoteip]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Remplace l'adresse IP du client pour la requête par l'adresse IP présentée par un mandataire ou un répartiteur de charge via les en-têtes de la requête. |
| **Statut** | Base |
| **Identificateur** | `remoteip_module` |
| **Fichier source** | `mod_remoteip.c` |

## Sommaire

Ce module permet de traiter le client qui a initié la requête en tant que client original du point de vue de httpd à des fins d'autorisation et de connexion, même si ce client se trouve derrière un répartiteur de charge, un serveur frontal, ou un serveur mandataire.

Le module remplace l'adresse IP du client pour la connexion par l'adresse IP indiquée dans l'en-tête de requête configuré via la directive [[13-directives/remoteipheader|RemoteIPHeader]].

Ce module implémente aussi la partie serveur du [protocole PROXY](https://www.haproxy.org/download/3.1/doc/proxy-protocol.txt) de HAProxy via la directive [[13-directives/remoteipproxyprotocol|RemoteIPProxyProtocol]].

Une fois sa valeur modifiée comme indiqué, cette adresse IP client est utilisée pour la fonctionnalité `Require ip` de [[12-modules/mod_authz_host|mod_authz_host]] ; elle est aussi affichée par [[12-modules/mod_status|mod_status]], et enregistrée via les chaînes de formatage `%a` des modules [[12-modules/mod_log_config|mod_log_config]] et [[12-modules/core|core]]. L'adresse IP client sous-jacente de la connexion est enregistrée via la chaîne de formatage `%{c}a` et via la variable `CONN_REMOTE_ADDR` dans les [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expressions]].

> [!WARNING]
> Il est essentiel de n'activer cette fonctionnalité que pour les requêtes en provenance des serveurs intermédiaires (mandataires, etc...) auxquels le serveur peut faire confiance, car il est trivial pour le client distant d'usurper l'identité d'un autre client.

## Traitement des adresses distantes

Par défaut, Apache identifie le client via la valeur client\_ip de la connexion, et de cette valeur découlent les valeurs remote\_host et remote\_logname de la connexion. Ces champs jouent un rôle dans l'authentification, l'autorisation et la journalisation, ainsi que dans d'autres traitements effectués par d'autres modules chargeables.

mod\_remoteip remplace l'adresse IP client de la connexion par l'adresse IP client indiquée par exemple par un mandataire ou un répartiteur de charge pour toute la durée de la requête. Un répartiteur de charge pourra ainsi établir une connexion keepalive de longue durée avec le serveur, chaque requête conservant alors l'adresse IP client correcte bien que l'adresse IP client sous-jacente du répartiteur de charge reste inchangée.

Lorsque la valeur de l'en-tête comporte plusieurs adresses IP client séparées par des virgules, celles-ci sont traitées de la droite vers la gauche. Le traitement s'arrête lorsque l'adresse IP client courante n'est pas digne de confiance pour présenter l'adresse IP précédente. Le champ d'en-tête est alors mis à jour de façon à ne contenir que cette liste d'adresses non confirmées, ou bien, si toutes les adresses IP sont dignes de confiance, cet en-tête est tout bonnement supprimé de la requête.

Lors du remplacement de l'adresse IP client, le module stocke la liste des hôtes intermédiaires dans un mémo remoteip-proxy-ip-list, que l'on peut faire enregistrer par [[12-modules/mod_log_config|mod_log_config]] en utilisant le symbole de format `%{remoteip-proxy-ip-list}n`. Si l'administrateur doit stocker ceci dans un en-tête additionnel, la même valeur peut aussi être enregistrée sous la forme d'un en-tête en utilisant la directive [[13-directives/remoteipproxiesheader|RemoteIPProxiesHeader]].

> [!NOTE]
> **Adresses IPv4 converties au format IPv6**
>
> Avec httpd, d'une manière générale, toute adresse IPv4 convertie au format IPv6 est enregistrée sous sa forme IPv4.

> [!NOTE]
> **Adresses internes (privées)**
>
> Tous les blocs d'adresses internes 10/8, 172.16/12, 192.168/16, 169.254/16 and 127/8 (ainsi que les adresses IPv6 en dehors du bloc public 2000::/3 block) ne sont évaluées par mod\_remoteip que lorsque des mandataires internes (intranet) [[13-directives/remoteipinternalproxy|RemoteIPInternalProxy]] sont enregistrés.

## Directives

- [[13-directives/remoteipheader|RemoteIPHeader]]
- [[13-directives/remoteipinternalproxy|RemoteIPInternalProxy]]
- [[13-directives/remoteipinternalproxylist|RemoteIPInternalProxyList]]
- [[13-directives/remoteipproxiesheader|RemoteIPProxiesHeader]]
- [[13-directives/remoteipproxyprotocol|RemoteIPProxyProtocol]]
- [[13-directives/remoteipproxyprotocolexceptions|RemoteIPProxyProtocolExceptions]]
- [[13-directives/remoteiptrustedproxy|RemoteIPTrustedProxy]]
- [[13-directives/remoteiptrustedproxylist|RemoteIPTrustedProxyList]]

## Voir aussi

- [[12-modules/mod_authz_host|mod_authz_host]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
