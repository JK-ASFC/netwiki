---
title: Tableau de bord Ceph
description: Ceph Dashboard (module MGR, port 8443) — état du cluster, hôtes, OSD, pools, images RBD, CephFS, Object Gateway, supervision intégrée (Prometheus, Grafana, Alertmanager déployés par cephadm), utilisateurs et rôles, mise à jour ; et interface Ceph de Proxmox VE. Emplacements de captures d'écran.
tags: [ceph dashboard, interface graphique, grafana, proxmox, captures]
icon: monitor
---

Accès : `https://<mgr-actif>:8443` (URL et mot de passe affichés par `cephadm bootstrap`). Créer des comptes nominatifs : `ceph dashboard ac-user-create jk -i mdp.txt administrator`.

| Menu | Contenu |
| --- | --- |
| **Dashboard** | Santé, capacité, débit, IOPS, PG |
| **Cluster → Hosts / OSDs / Services** | Nœuds, disques, démons (ajout, maintenance, marquer out) |
| **Pools** | Création, réplication ou EC, quotas, règles CRUSH |
| **Block → Images** | RBD, instantanés, miroir |
| **File Systems** | CephFS, clients, sous-volumes |
| **Object Gateway** | Utilisateurs, buckets S3 |
| **Observability** | Graphiques Grafana intégrés, alertes |
| Administration | Utilisateurs, mises à jour, télémétrie |

<!-- CAPTURE: Ceph Dashboard — page d'accueil (santé et capacité) | _assets/ceph-dashboard.png -->
<!-- CAPTURE: Ceph Dashboard — liste des OSD | _assets/ceph-osd.png -->
<!-- CAPTURE: Proxmox VE — Datacenter → Ceph | _assets/proxmox-ceph.png -->
