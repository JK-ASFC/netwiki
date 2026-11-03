---
title: "LogIOTrackTTFB"
description: "Directive Apache LogIOTrackTTFB (mod_logio) — Permet d'enregistrer le délai avant le premier octet (time to first byte - TTFB). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_logio]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet d'enregistrer le délai avant le premier octet (time to first byte - TTFB) |
| **Syntaxe** | `LogIOTrackTTFB ON\|OFF` |
| **Valeur par défaut** | `LogIOTrackTTFB OFF` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_logio\|mod_logio]] |
| **Compatibilité** | Disponible à partir de la version 2.4.13 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir si ce module mesure le délai entre la lecture de la requête et l'écriture du premier octet des en-têtes de la réponse. La valeur obtenue peut être enregistrée dans le journal via le format `%^FB`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
