---
title: "ProtocolsHonorOrder"
description: "Directive Apache ProtocolsHonorOrder (core) — Détermine qui du client ou du serveur détermine l'ordre des protocoles au cours de la négociation de la connexion. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine qui du client ou du serveur détermine l'ordre des protocoles au cours de la négociation de la connexion |
| **Syntaxe** | `ProtocolsHonorOrder On\|Off` |
| **Valeur par défaut** | `ProtocolsHonorOrder On` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.17 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir si le serveur doit tenir compte de l'ordre des protocoles définis par la directive `Protocols`.

Si cette directive est définie à Off, l'ordre de la liste des protocoles fournie par le client l'emporte sur l'ordre défini dans la configuration du serveur.

Si la directive `ProtocolsHonorOrder` est définie à `on` (valeur par défaut), il n'est pas tenu compte de l'ordre de la liste des protocoles fournie par le client, et seul l'ordre de la liste des protocles définie au niveau du serveur influera la négociation du protocole.

## Voir aussi

- [[13-directives/protocols|Protocols]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
