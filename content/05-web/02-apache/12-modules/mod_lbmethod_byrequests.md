---
title: "mod_lbmethod_byrequests"
description: "Module Apache mod_lbmethod_byrequests — Algorithme de planification avec répartition de charge du traitement des requêtes pour le module mod_proxy_balancer. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_lbmethod_byrequests]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Algorithme de planification avec répartition de charge du traitement des requêtes pour le module mod\_proxy\_balancer |
| **Statut** | Extension |
| **Identificateur** | `lbmethod_byrequests_module` |
| **Fichier source** | `mod_lbmethod_byrequests.c` |
| **Compatibilité** | Dissocié de [[12-modules/mod_proxy_balancer\\|mod_proxy_balancer]] dans la version 2.3 |

## Sommaire

Ce module ne fournit pas lui-même de directive de configuration. Il nécessite les services de [[12-modules/mod_proxy_balancer|mod_proxy_balancer]], et fournit la méthode de répartition de charge `byrequests`.

## Algorithme d'attribution des requêtes

Activé via `lbmethod=byrequests`, ce planificateur a été conçu dans le but de distribuer les requêtes à tous les processus worker afin qu'ils traitent tous le nombre de requêtes pour lequel ils ont été configurés. Il fonctionne de la manière suivante :

*lbfactor* correspond à la *quantité de travail que nous attendons de ce processus worker*, ou en d'autres termes son *quota de travail*. C'est une valeur normalisée représentant leur part du travail à accomplir.

*lbstatus* représente *combien il est urgent que ce processus worker travaille pour remplir son quota de travail*.

Le *worker* est un membre du dispositif de répartition de charge, en général un serveur distant traitant un des protocoles supportés.

On distribue à chaque processus worker son quota de travail, puis on regarde celui qui a le plus besoin de travailler (le plus grand lbstatus). Ce processus est alors sélectionné pour travailler, et son lbstatus diminué de l'ensemble des quotas de travail que nous avons distribués à tous les processus. La somme de tous les lbstatus n'est ainsi pas modifiée, et nous pouvons distribuer les requêtes selon nos souhaits.

Si certains processus workers sont désactivés, les autres feront l'objet d'une planification normale.

```
for each worker in workers worker lbstatus += worker lbfactor total factor += worker lbfactor if worker lbstatus > candidate lbstatus candidate = worker candidate lbstatus -= total factor
```

Si un répartiteur de charge est configuré comme suit :

| worker | a | b | c | d |
| --- | --- | --- | --- | --- |
| lbfactor | 25 | 25 | 25 | 25 |
| lbstatus | 0 | 0 | 0 | 0 |

Et si *b* est désactivé, la planification suivante est mise en oeuvre :

| worker | a | b | c | d |
| --- | --- | --- | --- | --- |
| lbstatus | *-50* | 0 | 25 | 25 |
| lbstatus | -25 | 0 | *-25* | 50 |
| lbstatus | 0 | 0 | 0 | *0* |
| (repeat) |   |   |   |   |

C'est à dire la chronologie suivante : *a* *c* *d* *a* *c* *d* *a* *c* *d* ... Veuillez noter que :

| worker | a | b | c | d |
| --- | --- | --- | --- | --- |
| lbfactor | 25 | 25 | 25 | 25 |

A le même effet que :

| worker | a | b | c | d |
| --- | --- | --- | --- | --- |
| lbfactor | 1 | 1 | 1 | 1 |

Ceci est dû au fait que toutes les valeurs de *lbfactor* sont normalisées et évaluées en fonction des autres. Avec :

| worker | a | b | c |
| --- | --- | --- | --- |
| lbfactor | 1 | 4 | 1 |

le processus *b* va, en moyenne, se voir assigner 4 fois plus de requêtes que *a* et *c*.

La configuration suivante, asymétrique, fonctionne comme on peut s'y attendre :

| worker | a | b |
| --- | --- | --- |
| lbfactor | 70 | 30 |
|   |   |   |
| lbstatus | *-30* | 30 |
| lbstatus | 40 | *-40* |
| lbstatus | *10* | -10 |
| lbstatus | *-20* | 20 |
| lbstatus | *-50* | 50 |
| lbstatus | 20 | *-20* |
| lbstatus | *-10* | 10 |
| lbstatus | *-40* | 40 |
| lbstatus | 30 | *-30* |
| lbstatus | *0* | 0 |
| (repeat) |   |   |

Après 10 distributions, la planification se répète et 7 *a* sont sélectionnés avec 3 *b* intercalés.

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
