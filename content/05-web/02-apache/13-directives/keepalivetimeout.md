---
title: "KeepAliveTimeout"
description: "Directive Apache KeepAliveTimeout (core) — Durée pendant laquelle le serveur va attendre une requête avant de fermer une connexion persistante. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée pendant laquelle le serveur va attendre une requête avant de fermer une connexion persistante |
| **Syntaxe** | `KeepAliveTimeout nombre[ms]` |
| **Valeur par défaut** | `KeepAliveTimeout 5` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Le nombre de secondes pendant lesquelles Apache httpd va attendre une requête avant de fermer la connexion. Le délai peut être défini en millisecondes en suffixant sa valeur par ms. La valeur du délai spécifiée par la directive [[13-directives/timeout|Timeout]] s'applique dès qu'une requête a été reçue.

Donner une valeur trop élévée à `KeepAliveTimeout` peut induire des problèmes de performances sur les serveurs fortement chargés. Plus le délai est élévé, plus nombreux seront les processus serveur en attente de requêtes de la part de clients inactifs.

Si la directive `KeepAliveTimeout` n'est **pas** définie pour un serveur virtuel à base de nom, c'est la valeur de la paire adresse IP/port du serveur virtuel qui correspond le mieux qui sera utilisée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
