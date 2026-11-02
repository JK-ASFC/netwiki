---
title: Console web OKD
description: Console web d'OKD/OpenShift — perspectives Administrateur (vue d'ensemble du cluster, opérateurs, OperatorHub, nœuds, mises à jour, configuration des fournisseurs d'identité, supervision) et Développeur (+Add, topologie, builds, pipelines, observation), terminal web, avec emplacements de captures d'écran.
tags: [okd, openshift, console, interface graphique, captures]
icon: monitor
---

Accès : `https://console-openshift-console.apps.<cluster>.<domaine>`.

| Perspective | Écrans utiles |
| --- | --- |
| **Administrateur** | *Overview* (santé, capacité, alertes), *Operators → OperatorHub*, *Compute → Nodes*, *Administration → Cluster Settings* (mises à jour, configuration OAuth), *Observe* (métriques, alertes, tableaux de bord) |
| **Développeur** | *+Add* (depuis Git, image, Helm, catalogue), **Topology** (vue graphique des applications), *Builds*, *Pipelines* (Tekton), *Observe* |

<!-- CAPTURE: OKD — vue d'ensemble du cluster (perspective Administrateur) | _assets/okd-overview.png -->
<!-- CAPTURE: OKD — vue Topology (perspective Développeur) | _assets/okd-topology.png -->
<!-- CAPTURE: OKD — Cluster Settings, mise à jour | _assets/okd-mise-a-jour.png -->
