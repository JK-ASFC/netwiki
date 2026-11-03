---
title: "mod_lbmethod_bytraffic"
description: "Module Apache mod_lbmethod_bytraffic — Algorithme de planification avec répartition de charge en fonction d'un niveau de trafic pour le module mod_proxy_balancer. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_lbmethod_bytraffic]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Algorithme de planification avec répartition de charge en fonction d'un niveau de trafic pour le module mod\_proxy\_balancer |
| **Statut** | Extension |
| **Identificateur** | `lbmethod_bytraffic_module` |
| **Fichier source** | `mod_lbmethod_bytraffic.c` |
| **Compatibilité** | Dissocié de [[12-modules/mod_proxy_balancer\\|mod_proxy_balancer]] depuis la version 2.3 |

## Sommaire

Ce module ne fournit pas lui-même de directive de configuration. Il nécessite les services de [[12-modules/mod_proxy_balancer|mod_proxy_balancer]], et fournit la méthode de répartition de charge `bytraffic`.

## Algorithme de répartition en fonction d'un certain trafic

Activé via `lbmethod=bytraffic`, l'idée directrice de ce planificateur est similaire à celle de la méthode reposant sur le nombre de requêtes, avec les différences suivantes :

*lbfactor* représente la *quantité de trafic, en octets, que nous voulons voir traitée par le processus*. Il s'agit là aussi d'une valeur normalisée représentant la part de travail à effectuer par le processus, mais au lieu de se baser sur un nombre de requêtes, on prend en compte la quantité de trafic que ce processus a traité.

Si un répartiteur est configuré comme suit :

| worker | a | b | c |
| --- | --- | --- | --- |
| lbfactor | 1 | 2 | 1 |

Cela signifie que nous souhaitons que *b* traite 2 fois plus d'octets que *a* ou *c*. Cela n'entraîne pas nécessairement que *b* va traiter deux fois plus de requêtes, mais qu'il va traiter deux fois plus de trafic en termes d'entrées/sorties. A cet effet, les tailles de la requête et de sa réponse assocciée sont prises en compte par l'algorithme de sélection et d'évaluation du trafic.

Note : les octets en entrée sont évalués avec la même pondération que les octets en sortie.

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
