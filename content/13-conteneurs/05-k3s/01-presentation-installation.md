---
title: Présentation et installation
description: K3s, distribution Kubernetes légère et certifiée — composants intégrés (containerd, Flannel, CoreDNS, Traefik, ServiceLB, local-path, base SQLite ou etcd), cas d'usage (périphérie, sites distants, laboratoires), installation d'un serveur et d'agents, configuration par config.yaml, cluster hautement disponible avec etcd intégré, et accès kubectl.
tags: [k3s, kubernetes, edge, installation, etcd, traefik, haute disponibilité]
icon: info
---

**K3s** (Rancher/SUSE, projet CNCF) est un Kubernetes **certifié** emballé dans un **binaire unique** d'environ 70 Mo : installation en une commande, faible consommation (512 Mo de RAM suffisent pour un nœud), architectures x86_64 et ARM. Il convient aux sites distants, à la périphérie (*edge*), aux laboratoires et aux petits clusters de production.

## Composants intégrés

| Composant | Rôle | Désactivable |
| --- | --- | --- |
| containerd | Runtime | — |
| **Flannel** (VXLAN) | CNI | `--flannel-backend=none` (pour installer Calico/Cilium) |
| CoreDNS | DNS du cluster | `--disable coredns` |
| **Traefik** | Ingress controller | `--disable traefik` |
| **ServiceLB** (Klipper) | Services `LoadBalancer` sur les IP des nœuds | `--disable servicelb` (pour MetalLB) |
| **local-path-provisioner** | Volumes persistants sur le disque local | `--disable local-storage` |
| Base de données | SQLite (nœud unique), **etcd intégré** (HA), ou MySQL/PostgreSQL externes | — |
| metrics-server | `kubectl top` | `--disable metrics-server` |

| Port | Usage |
| --- | --- |
| 6443 | API Kubernetes |
| 8472/UDP | Flannel VXLAN |
| 10250 | kubelet |
| 2379-2380 | etcd intégré (serveurs) |

## Nœud unique

```bash
curl -sfL https://get.k3s.io | sh -
sudo k3s kubectl get nodes
sudo cat /etc/rancher/k3s/k3s.yaml       # kubeconfig (adresse 127.0.0.1 à remplacer pour un accès distant)
```

## Configuration par fichier

```yaml /etc/rancher/k3s/config.yaml (serveur)
write-kubeconfig-mode: "0640"
tls-san:
  - k3s-api.corp.exemple.fr
  - 10.0.50.10
cluster-cidr: 172.22.0.0/16
service-cidr: 172.23.0.0/16
cluster-dns: 172.23.0.10
disable:
  - servicelb
node-label:
  - site=lyon
secrets-encryption: true
```

Les plages `cluster-cidr` / `service-cidr` remplacent les valeurs par défaut (`10.42.0.0/16`, `10.43.0.0/16`) pour éviter les conflits avec le réseau de l'entreprise.

## Cluster hautement disponible (etcd intégré)

```bash
# Premier serveur
curl -sfL https://get.k3s.io | K3S_TOKEN='JetonSecretLong' sh -s - server --cluster-init
# Serveurs 2 et 3
curl -sfL https://get.k3s.io | K3S_TOKEN='JetonSecretLong' sh -s - server --server https://k3s1.corp.exemple.fr:6443
# Agents (nœuds de travail)
curl -sfL https://get.k3s.io | K3S_URL=https://k3s-api.corp.exemple.fr:6443 K3S_TOKEN='JetonSecretLong' sh -
```

Placez une adresse fixe devant les serveurs (VIP keepalived, kube-vip, équilibreur, DNS à plusieurs enregistrements) et ajoutez-la à `tls-san`. Prévoyez **3 serveurs** (nombre impair) pour le quorum etcd.

## Version figée

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.33.4+k3s1 sh -
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=stable sh -
```

## Accès kubectl depuis un poste

```bash
scp k3s1:/etc/rancher/k3s/k3s.yaml ~/.kube/k3s-lyon.yaml
sed -i 's/127.0.0.1/k3s-api.corp.exemple.fr/' ~/.kube/k3s-lyon.yaml
export KUBECONFIG=~/.kube/k3s-lyon.yaml && kubectl get nodes
```

Windows et macOS ne sont pas des hôtes K3s : utilisez une VM Linux (Multipass, Rancher Desktop qui embarque K3s, WSL 2).

## Suite

[[02-exploitation|Exploitation, mises à jour et dépannage]]
