---
title: "ReadBufferSize"
description: "Directive Apache ReadBufferSize (core) — Taille des tampons utilisés pour lire les données. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille des tampons utilisés pour lire les données |
| **Syntaxe** | `ReadBufferSize bytes` |
| **Valeur par défaut** | `ReadBufferSize 8192` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.5 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir la taille (en octets) du tampon mémoire utilisé pour lire des données depuis le réseau ou un fichier.

Un tampon de grande taille peut améliorer les performances pour les grandes quantités de données, mais consomme d'avantage de mémoire par connexion. La taille minimale du tampon est de *1024* octets.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
