---
title: "H2MaxStreamErrors"
description: "Directive Apache H2MaxStreamErrors (mod_http2) — Nombre maximal toléré d'erreurs dues au client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximal toléré d'erreurs dues au client |
| **Syntaxe** | `H2MaxStreamErrors n` |
| **Valeur par défaut** | `H2MaxStreamErrors 8` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.5.1 du serveur HTTP Apache. |

## Utilisation

La directive `H2MaxStreamErrors` permet de définir le nombre maximal toléré d'erreurs de flux HTTP/2 causées par le client. Si cette limite est dépassée, la connexion sera fermée. Les erreurs de flux sont des violations du protocole sur un flux HTTP/2 individuel pour lesquelles la spécification du protocole n'exige pas de fermeture de la connexion, mais qui peuvent être un signe d'activité malveillante de la part du client.

Définissez cette directive à 0 pour vous prémunir contre les clients qui provoquent des erreurs.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
