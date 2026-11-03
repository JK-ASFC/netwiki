---
title: "MDBaseServer"
description: "Directive Apache MDBaseServer (mod_md) — Définit si le serveur global peut être géré ou seulement les serveurs virtuels. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit si le serveur global peut être géré ou seulement les serveurs virtuels. |
| **Syntaxe** | `MDBaseServer on\|off` |
| **Valeur par défaut** | `MDBaseServer off` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir si le serveur global, autrement dit la partie du serveur située en dehors de tout serveur virtuel, doit être géré par mod\_md ou non. Par défaut il ne le sera pas car cela provoquerait des effets de bord générateurs de confusion. Il est donc recommandé de définir des serveurs virtuels pour tous les domaines gérés, et d'exclure des domaines gérés le serveur global (serveur par défaut).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
