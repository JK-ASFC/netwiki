---
title: K3s — aide-mémoire des commandes
description: Commandes K3s avec exemples — installation serveur et agents (script, options INSTALL_K3S_EXEC, jeton), haute disponibilité avec etcd intégré, kubeconfig, k3s kubectl/crictl/ctr, fichier de configuration, désactivation de Traefik ou ServiceLB, instantanés etcd (save, ls, restore), mise à jour, désinstallation, journaux.
tags: [aide-mémoire, k3s, kubernetes, etcd, rancher, edge]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|K3s]].

## Installation

```bash
# Premier serveur (etcd intégré pour la haute disponibilité)
curl -sfL https://get.k3s.io | sh -s - server --cluster-init --tls-san k3s.exemple.fr
sudo cat /var/lib/rancher/k3s/server/node-token
# Serveurs supplémentaires
curl -sfL https://get.k3s.io | K3S_TOKEN="$JETON" sh -s - server --server https://k3s1.exemple.fr:6443 --tls-san k3s.exemple.fr
# Agents (nœuds de travail)
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.exemple.fr:6443 K3S_TOKEN="$JETON" sh -
# Version précise
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.31.2+k3s1 sh -
```

```yaml
# /etc/rancher/k3s/config.yaml (lu au démarrage)
write-kubeconfig-mode: "0640"
tls-san:
  - k3s.exemple.fr
disable:
  - traefik
node-label:
  - "zone=paris"
```

## Utilisation

```bash
sudo k3s kubectl get nodes -o wide
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config && sudo chown "$USER" ~/.kube/config     # puis remplacer 127.0.0.1 par k3s.exemple.fr
sudo k3s crictl ps
sudo k3s ctr images ls | head
sudo k3s check-config
sudo systemctl status k3s            # agents : k3s-agent
sudo journalctl -u k3s -f
```

## Instantanés etcd

```bash
sudo k3s etcd-snapshot save --name avant-maj
sudo k3s etcd-snapshot ls
sudo k3s etcd-snapshot delete avant-maj-k3s1-1730275200
# Restauration (sur un serveur, les autres arrêtés)
sudo systemctl stop k3s
sudo k3s server --cluster-reset --cluster-reset-restore-path=/var/lib/rancher/k3s/server/db/snapshots/avant-maj-k3s1-1730275200
```

## Mise à jour et désinstallation

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=stable sh -s - server     # mettre à jour (mêmes options)
sudo /usr/local/bin/k3s-uninstall.sh          # serveur
sudo /usr/local/bin/k3s-agent-uninstall.sh    # agent
sudo /usr/local/bin/k3s-killall.sh            # arrêter tous les processus et conteneurs
```
