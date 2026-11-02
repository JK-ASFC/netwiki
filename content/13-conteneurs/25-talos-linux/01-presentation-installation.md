---
title: Présentation, installation et exploitation
description: Talos Linux (Sidero Labs, MPL 2.0) — système d'exploitation immuable, minimal et sécurisé pour Kubernetes, sans SSH ni shell, piloté par API : architecture (machined, apid, configuration déclarative), Image Factory et extensions système, installation (ISO, PXE, images cloud et VM, Proxmox, bare metal), talosctl gen config, apply-config, bootstrap, kubeconfig, mises à jour du système et de Kubernetes, correctifs de configuration (patches), sauvegarde etcd, Omni (gestion SaaS) et dépannage (dmesg, logs, dashboard).
tags: [talos linux, kubernetes, immuable, talosctl, sidero, sécurité]
icon: info
---

**Talos Linux** ne contient que ce qu'il faut pour faire tourner Kubernetes : **pas de SSH, pas de shell, pas de gestionnaire de paquets**. Toute l'administration passe par l'**API** et la commande **talosctl**, à partir d'un fichier de configuration déclaratif. Résultat : une surface d'attaque minimale et des nœuds parfaitement reproductibles.

## Installation

1. Obtenir une image (ISO, image cloud, PXE) depuis l'**Image Factory** (`factory.talos.dev`), en ajoutant si besoin des **extensions système** (agent QEMU, microcode, iSCSI pour Longhorn, pilotes).
2. Démarrer les nœuds : ils attendent leur configuration en **mode maintenance**.
3. Générer et appliquer la configuration :

```bash
curl -sL https://talos.dev/install | sh          # talosctl (Linux, macOS) ; Windows : binaire talosctl-windows-amd64.exe
talosctl gen config prod https://10.0.20.60:6443 --output-dir ./prod     # VIP ou répartiteur de l'API
talosctl apply-config --insecure --nodes 10.0.20.61 --file prod/controlplane.yaml
talosctl apply-config --insecure --nodes 10.0.20.71 --file prod/worker.yaml
export TALOSCONFIG=./prod/talosconfig
talosctl config endpoint 10.0.20.61 10.0.20.62 10.0.20.63 && talosctl config node 10.0.20.61
talosctl bootstrap                               # une seule fois, sur un nœud du plan de contrôle
talosctl kubeconfig ./kubeconfig && kubectl --kubeconfig ./kubeconfig get nodes
```

Personnaliser avec des **patches** (`--config-patch @vip.yaml`) : IP virtuelle partagée du plan de contrôle, disque d'installation, nom d'hôte, CNI (Cilium), registres miroirs.

## Exploitation

```bash
talosctl dashboard                               # tableau de bord en terminal
talosctl -n 10.0.20.71 logs kubelet ; talosctl -n 10.0.20.71 dmesg ; talosctl -n 10.0.20.71 services
talosctl -n 10.0.20.71 upgrade --image factory.talos.dev/installer/<schematic>:v1.9.5    # mise à jour du système, nœud par nœud
talosctl -n 10.0.20.61 upgrade-k8s --to 1.32.3                                           # mise à jour de Kubernetes
talosctl -n 10.0.20.61 etcd snapshot /sauv/etcd-$(date +%F).db
talosctl -n 10.0.20.71 reset --graceful                                                  # remettre un nœud à zéro
```

Conserver précieusement `talosconfig` et les fichiers de configuration (ils contiennent les secrets du cluster). **Omni** (service de Sidero Labs, ou auto-hébergé sous licence) gère des flottes de clusters Talos.

Commandes : [[90-aide-memoire|aide-mémoire]].
