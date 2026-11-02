---
title: Interfaces graphiques
description: Interfaces web de Buildbot (port 8010 : Home, Builds, Builders, Workers, Waterfall, Console, Grid, Force) et de GoCD (port 8153 : Dashboard, Value Stream Map, Agents, Admin, Materials, Environments), avec emplacements de captures d'écran.
tags: [buildbot, gocd, interface graphique, ci, captures]
icon: monitor
---

## Buildbot (`http://<maître>:8010`)

| Vue | Contenu |
| --- | --- |
| **Builds → Builders** | Constructeurs, dernières constructions, bouton de construction forcée |
| **Waterfall / Grid / Console** | Historique par constructeur, par révision, par changement |
| **Workers** | Workers connectés, constructions en cours |
| Settings | Préférences d'affichage |

<!-- CAPTURE: Buildbot — vue Waterfall | _assets/buildbot-waterfall.png -->
<!-- CAPTURE: Buildbot — détail d'une construction et de ses étapes | _assets/buildbot-construction.png -->

## GoCD (`https://<serveur>:8153/go`)

| Menu | Contenu |
| --- | --- |
| **Dashboard** | Pipelines par groupe, état de chaque étape, déclenchement manuel |
| **Value Stream Map** | Chaîne complète d'une révision, des matériaux à la production |
| **Agents** | Agents, ressources, environnements, activation |
| Admin | Pipelines, dépôts de configuration, sécurité, sauvegarde, greffons |

<!-- CAPTURE: GoCD — tableau de bord des pipelines | _assets/gocd-dashboard.png -->
<!-- CAPTURE: GoCD — carte de flux de valeur | _assets/gocd-vsm.png -->
