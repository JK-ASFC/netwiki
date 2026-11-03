---
title: "StrictHostCheck"
description: "Directive Apache StrictHostCheck (core) — Détermine si le nom d'hôte contenu dans une requête doit être explicitement spécifié au niveau du serveur virtuel qui a pris en compte cette dernière. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si le nom d'hôte contenu dans une requête doit être explicitement spécifié au niveau du serveur virtuel qui a pris en compte cette dernière. |
| **Syntaxe** | `StrictHostCheck ON\|OFF` |
| **Valeur par défaut** | `StrictHostCheck OFF` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.49 du serveur HTTP Apache. |

## Utilisation

Par défaut, le serveur répond aux requêtes quel que soit le nom d'hôte qu'elles contiennent, y compris un nom d'hôte non prévu dans la configuration. Bien que cela soit pratique, il peut s'avérer souhaitable de restreindre les noms d'hôte qu'une application sous-jacente devra prendre en compte car elle va souvent générer des réponses en se référençant elle-même.

Si la directive `StrictHostCheck` est définie à *ON*, le serveur générera une erreur HTTP 400 si le nom d'hôte que contient la requête n'a pas été explicitement spécifié par une directive [[13-directives/servername|ServerName]] ou [[13-directives/serveralias|ServerAlias]] au niveau du serveur virtuel qui correspond le mieux aux caractéristiques de la connexion entrante.

Cette directive permet aussi de rechercher une correspondance entre le nom d'hôte de la requête et les noms d'hôte spécifiés au sein de la balise ouvrante [[13-directives/virtualhost|<VirtualHost>]]. Il s'agit cependant d'un mécanisme de configuration relativement obscur qui agit comme une directive [[13-directives/serveralias|ServerAlias]] supplémentaire.

Cette directive n'a aucun effet dans les serveurs virtuels qui ne sont pas des serveurs par défaut. La valeur héritée de la configuration globale du serveur ou le serveur virtuel par défaut pour l'adresse IP/port de la connexion sous-jacente déterminent la valeur effective.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
