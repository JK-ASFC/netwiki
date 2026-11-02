---
title: Interfaces graphiques
description: Interfaces du stockage Kubernetes — Longhorn UI (tableau de bord, volumes, nœuds, sauvegardes, tâches récurrentes, réglages) et tableau de bord Ceph déployé par Rook, accès par port-forward ou Ingress protégé ; OpenEBS sans interface (kubectl et plug-in). Emplacements de captures d'écran.
tags: [longhorn, rook, ceph dashboard, interface graphique, kubernetes, captures]
icon: monitor
---

## Longhorn UI

```bash
kubectl -n longhorn-system port-forward svc/longhorn-frontend 8080:80     # http://localhost:8080
```

L'interface n'a **pas d'authentification** : en Ingress, la protéger (authentification basique, [[18-oauth2-proxy-dex/01-oauth2-proxy|OAuth2 Proxy]]).

| Écran | Contenu |
| --- | --- |
| **Dashboard** | Volumes sains/dégradés, capacité, nœuds |
| **Volume** | Répliques, instantanés, sauvegardes, expansion, attachement |
| **Node** | Disques, capacité réservée, planification |
| **Backup** | Sauvegardes sur S3/NFS, restauration |
| Recurring Job, Setting | Planifications, réglages globaux |

<!-- CAPTURE: Longhorn — tableau de bord | _assets/longhorn-dashboard.png -->
<!-- CAPTURE: Longhorn — détail d'un volume et de ses répliques | _assets/longhorn-volume.png -->

## Ceph (Rook)

```bash
kubectl -n rook-ceph port-forward svc/rook-ceph-mgr-dashboard 8443:8443   # https://localhost:8443, compte admin
```

Même tableau de bord que [[24-ceph/03-interface-graphique|Ceph]].
