---
title: "KeptBodySize"
description: "Directive Apache KeptBodySize (mod_request) — Conserve le corps de la requête à concurrence de la taille maximale spécifiée, pour une utilisation éventuelle par des filtres comme mod_include. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_request]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Conserve le corps de la requête à concurrence de la taille maximale spécifiée, pour une utilisation éventuelle par des filtres comme mod\_include. |
| **Syntaxe** | `KeptBodySize taille maximale en octets` |
| **Valeur par défaut** | `KeptBodySize 0` |
| **Contexte** | répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_request\|mod_request]] |

## Utilisation

Dans une situation normale, les gestionnaires de requête tels que le gestionnaire par défaut des fichiers statiques suppriment le corps de la requête s'il n'est pas nécessaire au gestionnaire de requête. Il en résulte que les filtres comme mod\_include sont limités à des requêtes `GET` lors de l'inclusion d'autres URLs en tant que sous-requêtes, et ceci même si la requête originale était une requête `POST`, car le corps de la requête a été supprimé et n'est donc plus disponible une fois le traitement du filtre mis en oeuvre.

Lorsque l'argument de cette directive a une valeur supérieure à zéro, les gestionnaires de requête qui suppriment habituellement les corps de requête vont alors définir ces corps de requête, à concurrence de la taille maximale spécifiée, pour être éventuellement utilisés par des filtres. Dans le cas du filtre mod\_include, une tentative de requête `POST` pour un fichier shtml statique se traduira par des sous-requêtes `POST`, et non par des sous-requêtes `GET` comme avant.

Cette fonctionnalité permet de découper des pages web complexes et des applications web en petits éléments individuels, et de combiner ces éléments avec la structure de la page web sous-jacente en utilisant [[12-modules/mod_include|mod_include]]. Les éléments peuvent se présenter sous la forme de programmes CGI, de langages de scripts, ou d'URLs issues d'un mandataire inverse dans l'espace d'URL d'un autre serveur en utilisant [[12-modules/mod_proxy|mod_proxy]].

> [!NOTE]
> Chaque requête dont le corps est ainsi défini doit être enregistrée temporairement en mémoire vive jusqu'à la fin du traitement de la requête. Il faut donc s'assurer que la mémoire RAM du serveur est suffisante pour pouvoir supporter la charge induite. L'utilisation de cette directive doit être limitée à certaines portions de votre espace d'URL bien précises qui le nécessitent, et en spécifiant comme taille maximale une valeur la plus petite possible, mais tout de même suffisante pour un corps de requête.

Si la taille de la requête envoyée par le client dépasse la taille maximale autorisée par cette directive, le serveur renverra l'erreur `413 Request Entity Too Large`.

## Voir aussi

- [[12-modules/mod_include|mod_include]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
