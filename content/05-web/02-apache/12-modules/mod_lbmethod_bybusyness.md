---
title: "mod_lbmethod_bybusyness"
description: "Module Apache mod_lbmethod_bybusyness — Algorithme de planification avec répartition de charge de l'attribution des requêtes en attente pour le module mod_proxy_balancer. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_lbmethod_bybusyness]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Algorithme de planification avec répartition de charge de l'attribution des requêtes en attente pour le module mod\_proxy\_balancer |
| **Statut** | Extension |
| **Identificateur** | `lbmethod_bybusyness_module` |
| **Fichier source** | `mod_lbmethod_bybusyness.c` |
| **Compatibilité** | Dissocié de [[12-modules/mod_proxy_balancer\\|mod_proxy_balancer]] depuis la version 2.3 |

## Sommaire

Ce module ne fournit pas lui-même de directive de configuration. Il nécessite les services de [[12-modules/mod_proxy_balancer|mod_proxy_balancer]], et fournit la méthode de répartition de charge `bybusyness`.

## Algorithme d'attribution des requêtes en attente

Activé via `lbmethod=bybusyness`, ce planificateur surveille le nombre de requêtes assignées à chaque processus worker à l'instant présent. Une nouvelle requête est automatiquement assignée au processus worker auquel est assigné le plus petit nombre de requêtes. Ceci s'avère utile dans le cas où les processus worker mettent en file d'attente les requêtes entrantes indépendamment d'Apache, et permet de s'assurer que la longueur des files reste raisonnable, et qu'une requête est toujours assignée au processus worker qui sera à même de la servir le plus rapidement et avec une latence réduite.

Si plusieurs processus worker s'avèrent les moins chargés, le choix d'un de ces derniers est effectué à partir des statistiques (et des estimations de charges) qu'utilise la méthode de décompte des requêtes. Au fil du temps, la distribution des tâches finit par ressembler à celle de `byrequests` (tel qu'implémenté par [[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]]).

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
