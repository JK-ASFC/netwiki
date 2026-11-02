---
title: MicroK8s
description: MicroK8s (Canonical) — Kubernetes conforme et complet empaqueté en snap : installation Ubuntu et autres Linux (snap), Windows et macOS (installeur avec VM Multipass), groupe microk8s, modules (addons : dns, hostpath-storage, ingress, metallb, cert-manager, observability, registry, rbac, gpu), cluster haute disponibilité (add-node, join, dqlite), kubectl intégré, mises à jour par canaux snap, réglages (args des services), sauvegarde et cas d'usage (laboratoire, edge, CI).
tags: [microk8s, kubernetes, canonical, snap, edge, haute disponibilité]
icon: info
---

**MicroK8s** installe un Kubernetes conforme en une commande, avec un système de **modules** pour ajouter DNS, stockage, ingress, MetalLB ou supervision. Au-delà de trois nœuds, il passe automatiquement en **haute disponibilité** (base **dqlite** répliquée). Comparable à [[05-k3s/01-presentation-installation|K3s]], il est plus « complet » par défaut et intégré à l'écosystème Ubuntu.

## Installation

| Système | Commande |
| --- | --- |
| Ubuntu et Linux avec snapd | `sudo snap install microk8s --classic --channel=1.32/stable` |
| Windows | Installeur MicroK8s (crée une VM via Multipass) |
| macOS | `brew install ubuntu/microk8s/microk8s && microk8s install` |

```bash
sudo usermod -aG microk8s $USER && newgrp microk8s
microk8s status --wait-ready
microk8s kubectl get nodes
alias kubectl='microk8s kubectl'                # ou : microk8s config > ~/.kube/config
microk8s enable dns hostpath-storage ingress metallb:10.0.20.200-10.0.20.220 cert-manager rbac
microk8s enable observability                   # Prometheus, Grafana, Loki
```

## Cluster haute disponibilité

```bash
microk8s add-node                               # sur le premier nœud : affiche la commande de jonction
microk8s join 10.0.20.31:25000/<jeton>/<hash>   # sur chaque nouveau nœud
microk8s status | grep high-availability
```

Mises à jour : canaux snap (`sudo snap refresh microk8s --channel=1.33/stable`, un nœud à la fois). Réglages des composants : fichiers de `/var/snap/microk8s/current/args/` (`kube-apiserver`, `kubelet`…), puis `microk8s stop && microk8s start`.

Suite : [[02-k0s|k0s]] · [[90-aide-memoire|aide-mémoire]].
