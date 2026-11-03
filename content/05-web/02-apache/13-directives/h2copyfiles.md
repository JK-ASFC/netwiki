---
title: "H2CopyFiles"
description: "Directive Apache H2CopyFiles (mod_http2) — Contrôle la gestion des fichiers dans les réponses. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle la gestion des fichiers dans les réponses |
| **Syntaxe** | `H2CopyFiles on\|off` |
| **Valeur par défaut** | `H2CopyFiles off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.24 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir la manière de gérer les contenus de fichiers dans les réponses. Lorsqu'elle est à `off` (sa valeur par défaut), les descripteurs de fichiers sont transmis par le processus de traitement de la requête vers la connexion principale en utilisant le système habituel de mise en réserve d'Apache pour gérer le durée de vie du fichier.

Lorsqu'elle est à `on`, le contenu du fichier est recopier pendant le traitement de la requête et ces données mises en tampon sont transmises vers la connexion principale, ce qui s'avère avantageux lorsqu'un module tiers injecte dans la réponse des fichiers possédant des durées de vie différentes.

Un exemple de ces modules tiers : `mod_wsgi` qui peut injecter des descripteurs de fichiers dans la réponse. Ces fichiers sont fermés lorsque Python estime que le traitement est terminé, alors que [[12-modules/mod_http2|mod_http2]] est probablement encore loin d'en avoir fini avec eux.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
