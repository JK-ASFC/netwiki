---
title: "BalancerGrowth"
description: "Directive Apache BalancerGrowth (mod_proxy) — Nombre de membres supplémentaires pouvant être ajoutés après la configuration initiale. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre de membres supplémentaires pouvant être ajoutés après la configuration initiale |
| **Syntaxe** | `BalancerGrowth #` |
| **Valeur par défaut** | `BalancerGrowth 5` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | BalancerGrowth est disponible depuis la version 2.3.13 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir le nombre de membres pouvant être ajoutés au groupe de répartition de charge préconfiguré d'un serveur virtuel. Elle n'est active que si le groupe a été préconfiguré avec un membre au minimum.

La valeur doit être entre 0 et 1000.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
