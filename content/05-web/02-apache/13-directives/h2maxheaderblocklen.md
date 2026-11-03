---
title: "H2MaxHeaderBlockLen"
description: "Directive Apache H2MaxHeaderBlockLen (mod_http2) — Taille maximale des en-têtes d'une réponse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille maximale des en-têtes d'une réponse |
| **Syntaxe** | `H2MaxHeaderBlockLen n` |
| **Valeur par défaut** | `H2MaxHeaderBlockLen 0` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.64 du serveur HTTP Apache. |

## Utilisation

La directive `H2MaxHeaderBlockLen` permet de définir la taille maximale globale des en-têtes d'une réponse. Définir cette directive à 0 implique une taille maximale de 64 ko dans nghttp2, ce qui correspond à la valeur par défaut.

Les réponses dont la somme des tailles de tous les en-têtes est supérieure à la valeur de cette directive ne seront pas traitées et provoqueront une réinitialisation du flux.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
