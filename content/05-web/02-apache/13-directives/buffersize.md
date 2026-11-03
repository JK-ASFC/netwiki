---
title: "BufferSize"
description: "Directive Apache BufferSize (mod_buffer) — Taille maximale en octets du filtre par tampon. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_buffer]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille maximale en octets du filtre par tampon |
| **Syntaxe** | `BufferSize entier` |
| **Valeur par défaut** | `BufferSize 131072` |
| **Contexte** | répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_buffer\|mod_buffer]] |

## Utilisation

La directive [[13-directives/buffersize|BufferSize]] permet de spécifier la quantité de données en octets qui sera mise en tampon avant d'être lue depuis ou écrite vers chaque requête. La valeur par défaut est 128 ko.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
