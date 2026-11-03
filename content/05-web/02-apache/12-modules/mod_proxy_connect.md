---
title: "mod_proxy_connect"
description: "Module Apache mod_proxy_connect — Extension de mod_proxy pour le traitement des requêtes CONNECT. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_connect]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Extension de mod\_proxy pour le traitement des requêtes CONNECT |
| **Statut** | Extension |
| **Identificateur** | `proxy_connect_module` |
| **Fichier source** | `mod_proxy_connect.c` |

## Sommaire

Pour fonctionner, ce module *nécessite* le chargement de [[12-modules/mod_proxy|mod_proxy]]. Il fournit le support de la méthode HTTP `CONNECT`. Cette méthode est principalement utilisée pour faire franchir les serveurs mandataires aux requêtes SSL à l'aide d'un tunnel.

Ainsi, pour pouvoir traiter les requêtes `CONNECT`, [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_connect|mod_proxy_connect]] doivent être chargés dans le serveur.

CONNECT est aussi utilisée lorsque le serveur doit envoyer une requête HTTPS via un mandataire. Dans ce cas, le serveur se comporte comme un client CONNECT. Cette fonctionnalité étant fournie par le module [[12-modules/mod_proxy|mod_proxy]], le module [[12-modules/mod_proxy_connect|mod_proxy_connect]] n'est dans ce cas pas nécessaire.

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avant d'avoir [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux non seulement pour votre réseau, mais aussi pour l'Internet au sens large.

## Informations sur les requêtes

[[12-modules/mod_proxy_connect|mod_proxy_connect]] enregistre les informations suivantes pour journalisation via le format `%{NOMVAR}n` dans les directives [[13-directives/logformat|LogFormat]] ou [[13-directives/errorlogformat|ErrorLogFormat]] :

**proxy-source-port**

Le port local utilisé pour la connexion vers le serveur d'arrière-plan.

## Directives

- [[13-directives/allowconnect|AllowCONNECT]]

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
