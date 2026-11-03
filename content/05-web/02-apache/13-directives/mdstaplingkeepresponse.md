---
title: "MDStaplingKeepResponse"
description: "Directive Apache MDStaplingKeepResponse (mod_md) — Contrôle la durée au bout de laquelle les anciennes réponses doivent être supprimées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle la durée au bout de laquelle les anciennes réponses doivent être supprimées. |
| **Syntaxe** | `MDStaplingKeepResponse duration` |
| **Valeur par défaut** | `MDStaplingKeepResponse 7d` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.42 du serveur HTTP Apache |

## Utilisation

Cette directive permet de spécifier la durée au bout de laquelle les données OCSP utilisées pour l'agrafage doivent être supprimées du magasin. Par défaut, ces informations sont supprimées lors d'un restart/reload du serveur si elles ont plus de sept jours. Ceci permet de limiter la taille du magasin lorsque les certificats sont renouvelés et/ou reconfigurés fréquemment.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
