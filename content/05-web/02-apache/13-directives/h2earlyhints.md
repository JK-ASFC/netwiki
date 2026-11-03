---
title: "H2EarlyHints"
description: "Directive Apache H2EarlyHints (mod_http2) — Contrôle l'envoi de codes d'état 103. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle l'envoi de codes d'état 103 |
| **Syntaxe** | `H2EarlyHints on\|off` |
| **Valeur par défaut** | `H2EarlyHints off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.24 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir si les réponses intermédiaires contenant un code d'état HTTP 103 doivent être envoyées au client ou non. Par défaut ce n'est actuellement pas le cas car certains clients ont encore des problèmes avec les réponses intermédiaires inattendues.

Lorsque cette directive est définie à `on`, les ressources PUSHées définie par la directive [[13-directives/h2pushresource|H2PushResource]] déclenchent une réponse intermédiaire 103 avant la réponse finale. Cette réponse 103 comporte des en-têtes `Link` qui provoquent le `préchargement` des ressources considérées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
