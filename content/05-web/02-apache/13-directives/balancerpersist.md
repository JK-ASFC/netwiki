---
title: "BalancerPersist"
description: "Directive Apache BalancerPersist (mod_proxy) — Tente de conserver les changements effectués par le gestionnaire de répartition de charge après un redémarrage du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Tente de conserver les changements effectués par le gestionnaire de répartition de charge après un redémarrage du serveur. |
| **Syntaxe** | `BalancerPersist On\|Off` |
| **Valeur par défaut** | `BalancerPersist Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | BalancerPersist n'est disponible qu'à partir de la version 2.4.4 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de conserver le contenu de l'espace mémoire partagé associé aux répartiteurs de charge et à leurs membres après un redémarrage du serveur. Ces modifications locales ne sont ainsi pas perdues lors des transitions d'état dues à un redémarrage.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
