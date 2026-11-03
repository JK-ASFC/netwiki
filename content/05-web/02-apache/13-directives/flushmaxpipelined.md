---
title: "FlushMaxPipelined"
description: "Directive Apache FlushMaxPipelined (core) — Nombre maximal de réponses en attente (pipelined) au-delà duquel elles sont envoyées sur le réseau. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre maximal de réponses en attente (pipelined) au-delà duquel elles sont envoyées sur le réseau |
| **Syntaxe** | `FlushMaxPipelined number` |
| **Valeur par défaut** | `FlushMaxPipelined 5` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.47 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le nombre maximal de réponses "pipelinées" qui restent en attente tant que des requêtes "pipelinées" sont reçues. Lorsque cette limite est dépassée, l'envoi des réponses sur le réseau est forcé en mode bloqué jusqu'à ce que leur nombre repasse en dessous de la limite.

La directive `FlushMaxPipelined` permet de limiter la consommation de mémoire. Lorsqu'elle est définie à `0`, le pipelining est désactivé, et lorsqu'elle est définie à `-1`, il n'y a plus de limite (mais la directive [[13-directives/flushmaxthreshold|FlushMaxThreshold]] s'applique quand-même).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
