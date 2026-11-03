---
title: "QualifyRedirectURL"
description: "Directive Apache QualifyRedirectURL (core) — Vérifie si la variable d'environnement REDIRECT_URL est pleinement qualifiée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Vérifie si la variable d'environnement REDIRECT\_URL est pleinement qualifiée |
| **Syntaxe** | `QualifyRedirectURL On\|Off` |
| **Valeur par défaut** | `QualifyRedirectURL Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Directive supportée à partir de la version 2.4.18 du serveur HTTP Apache. Jusqu'à la version 2.4.17, le serveur se comportait comme si la directive QualifyRedirectURL était définie à On. |

## Utilisation

Cette directive permet de s'assurer que le serveur vérifiera que la variable d'environnement REDIRECT\_URL est bien pleinement qualifiée. Par défaut, cette variable contient l'URL textuellement demandée par le client, par exemple "/index.html". Avec `QualifyRedirectURL ON`, la même requête affectera à la variable REDIRECT\_URL une valeur du style "http://www.example.com/index.html".

Même si cette directive n'est pas définie, lorsqu'une requête est soumise avec une URL pleinement qualifiée, la variable REDIRECT\_URL contiendra quand-même une URL pleinement qualifiée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
