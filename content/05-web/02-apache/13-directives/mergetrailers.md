---
title: "MergeTrailers"
description: "Directive Apache MergeTrailers (core) — Détermine si les données supplémentaires (trailers) sont fusionnées avec les en-têtes. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine si les données supplémentaires (trailers) sont fusionnées avec les en-têtes |
| **Syntaxe** | `MergeTrailers [on\|off]` |
| **Valeur par défaut** | `MergeTrailers off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir de la version 2.4.11 du serveur HTTP Apache |

## Utilisation

Cette directive permet de contrôler la fusion des données HTTP supplémentaires (trailers) avec la représentation interne des en-têtes. Cette fusion intervient lorsque le corps de la requête a été entièrement reçu, bien longtemps après que la majeure partie du traitement des en-têtes ait une chance de pouvoir examiner ou modifier les en-têtes de la requête.

Cette option a été introduite dans un souci de compatibilité avec les versions antérieures à 2.4.11, où les données supplémentaires étaient systématiquement fusionnées avec les en-têtes de la requête.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
