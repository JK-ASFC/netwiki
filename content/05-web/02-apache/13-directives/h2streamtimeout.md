---
title: "H2StreamTimeout"
description: "Directive Apache H2StreamTimeout (mod_http2) — Temps d'attente maximum lors de l'envoi/réception de données pour le traitement d'un flux. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Temps d'attente maximum lors de l'envoi/réception de données pour le traitement d'un flux |
| **Syntaxe** | `H2StreamTimeout time-interval[s]` |
| **Valeur par défaut** | `La valeur de la directive Timeout` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.55 du serveur HTTP Apache. |

## Utilisation

`H2StreamTimeout` permet de spécifier le temps maximum pendant lequel un flux en cours de traitement attendra pour l'envoi/réception de ses données.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
