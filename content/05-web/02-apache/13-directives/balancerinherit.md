---
title: "BalancerInherit"
description: "Directive Apache BalancerInherit (mod_proxy) — Héritage des membres du groupes de répartition de charge du mandataire définis au niveau du serveur principal. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Héritage des membres du groupes de répartition de charge du mandataire définis au niveau du serveur principal |
| **Syntaxe** | `BalancerInherit On\|Off` |
| **Valeur par défaut** | `BalancerInherit On` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Disponible à partir de la version 2.4.5 du serveur HTTP Apache. |

## Utilisation

Cette directive permet d'attribuer au serveur virtuel courant l'héritage des membres de groupes de répartition de charge définis au niveau du serveur principal. Elle ne doit pas être activée si vous utilisez la fonctionnalité de modifications dynamiques du gestionnaire de répartition de charge (Balancer Manager) pour éviter des problèmes et des comportements inattendus.

Les définitions au niveau du serveur principal constituent les définitions par défaut au niveau des serveurs virtuels.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
