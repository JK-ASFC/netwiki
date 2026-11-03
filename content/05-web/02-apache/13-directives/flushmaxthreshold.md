---
title: "FlushMaxThreshold"
description: "Directive Apache FlushMaxThreshold (core) — Seuil au-delà duquel les données en attente sont envoyées sur le réseau. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Seuil au-delà duquel les données en attente sont envoyées sur le réseau |
| **Syntaxe** | `FlushMaxThreshold number-of-bytes` |
| **Valeur par défaut** | `FlushMaxThreshold 65535` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.47 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le seuil maximal de données en attente d'envoi (en octets). Lorsque cette limite est dépassée, l'envoi des données sur le réseau est forcé en mode bloqué jusqu'à ce que leur quantité repasse en dessous du seuil spécifié.

La directive `FlushMaxThreshold` permet de limiter la consommation de mémoire. Lorsqu'elle est définie à `0` ou à une valeur trop petite, aucune donnée n'est mise en attente, mais dans le cas des MPMs threadés, il peut alors y avoir plus de threads occupés en attente du réseau, ce qui diminue d'autant le nombre de threads disponibles pour traiter les autres connexions simultanées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
