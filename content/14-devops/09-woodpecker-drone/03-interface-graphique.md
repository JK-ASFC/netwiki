---
title: Interface graphique
description: Interface web de Woodpecker CI (et Drone) — connexion par la forge, activation des dépôts, liste des pipelines, journaux d'étapes en direct, secrets, crons, réglages du dépôt (trusted, protégé, délai), administration (agents, utilisateurs, files), avec emplacements de captures d'écran.
tags: [woodpecker, drone, interface graphique, ci, captures]
icon: monitor
---

Connexion avec le compte de la forge, puis **Ajouter un dépôt** pour l'activer (un webhook est créé automatiquement).

| Écran | Contenu |
| --- | --- |
| **Dépôts** | Dépôts activés, dernier état |
| **Pipelines** | Historique, déclencheur, durée, relancer, annuler, déclencher manuellement |
| Pipeline | Étapes, **journaux en direct**, approbation des PR |
| Réglages du dépôt | Secrets, registres, **crons**, badges, options *trusted* et *protected*, délai maximal |
| Administration | Agents, utilisateurs, organisations, files d'attente, secrets globaux |

<!-- CAPTURE: Woodpecker — liste des pipelines d'un dépôt | _assets/woodpecker-pipelines.png -->
<!-- CAPTURE: Woodpecker — journaux d'une étape | _assets/woodpecker-journaux.png -->
<!-- CAPTURE: Woodpecker — réglages du dépôt et secrets | _assets/woodpecker-secrets.png -->
