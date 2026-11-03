---
title: "H2PushDiarySize"
description: "Directive Apache H2PushDiarySize (mod_http2) — Taille du journal des Pushes H2. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille du journal des Pushes H2 |
| **Syntaxe** | `H2PushDiarySize n` |
| **Valeur par défaut** | `H2PushDiarySize 256` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.19 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir le nombre maximum de pushes qui seront enregistrés pour une connexion HTTP/2. Elle peut être placée dans une section [[13-directives/virtualhost|<VirtualHost>]] afin de définir le nombre de pushes pour le serveur virtuel considéré.

Le journal des pushes enregistre un condensé des ressources préchargées (leurs URLs) afin d'éviter les duplications de pushes pour une même connexion. Cependant, ces données ne sont pas conservées, et les clients qui ouvrent une nouvelle connexion se verront à nouveau affecter les mêmes pushes.

Si la taille maximale est atteinte, les nouvelles entrées remplacent les plus anciennes. Une entrée du journal nécessitant 8 octets, un journal de 256 entrées consomme 2 Ko de mémoire.

Si cette directive est définie à 0, le journal des pushes est désactivé.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
