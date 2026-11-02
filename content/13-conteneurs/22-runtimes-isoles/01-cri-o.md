---
title: CRI-O
description: CRI-O — runtime de conteneurs léger dédié à Kubernetes (interface CRI, runc ou crun, images OCI), place par rapport à containerd et Docker, correspondance des versions avec Kubernetes, installation sur Debian/Ubuntu et RHEL/Rocky (dépôts pkgs.k8s.io), configuration (crio.conf.d, registres, cgroups systemd), intégration à kubeadm, crictl et dépannage.
tags: [cri-o, crio, kubernetes, runtime, cri, crictl, oci]
icon: box
---

**CRI-O** (CNCF, Apache 2.0) implémente uniquement l'**interface CRI** de Kubernetes : il télécharge les images OCI, crée les pods et lance les conteneurs avec un runtime bas niveau (**crun** ou **runc**). Pas de commande `docker build`, pas d'usage hors Kubernetes : c'est le runtime d'**OpenShift** et une alternative à [[03-containerd/01-presentation-utilisation|containerd]] pour [[04-kubernetes/01-presentation-architecture|Kubernetes]].

| Runtime | Usage |
| --- | --- |
| containerd | Généraliste (Docker, Kubernetes, nerdctl) — le plus répandu |
| **CRI-O** | Kubernetes uniquement, version alignée sur celle de Kubernetes (CRI-O 1.33 ↔ Kubernetes 1.33) |
| Docker Engine | Développement, conteneurs isolés ; plus utilisé directement par Kubernetes |

## Installation

Prérequis communs (comme pour tout nœud Kubernetes) :

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay && sudo modprobe br_netfilter
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
sudo sysctl --system
```

### Debian / Ubuntu

```bash
CRIO_VERSION=v1.33       # même mineure que Kubernetes
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/addons:/cri-o:/stable:/$CRIO_VERSION/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/cri-o-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://pkgs.k8s.io/addons:/cri-o:/stable:/$CRIO_VERSION/deb/ /" | \
  sudo tee /etc/apt/sources.list.d/cri-o.list
sudo apt update && sudo apt install cri-o
sudo systemctl enable --now crio
```

### RHEL / Rocky / Alma / Fedora

```bash
CRIO_VERSION=v1.33
cat <<EOF | sudo tee /etc/yum.repos.d/cri-o.repo
[cri-o]
name=CRI-O
baseurl=https://pkgs.k8s.io/addons:/cri-o:/stable:/$CRIO_VERSION/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/addons:/cri-o:/stable:/$CRIO_VERSION/rpm/repodata/repomd.xml.key
EOF
sudo dnf install -y cri-o && sudo systemctl enable --now crio
```

## Configuration

```toml /etc/crio/crio.conf.d/10-corp.conf
[crio.runtime]
cgroup_manager = "systemd"
default_runtime = "crun"

[crio.image]
pause_image = "registry.k8s.io/pause:3.10"
```

```toml /etc/containers/registries.conf.d/10-miroir.conf
[[registry]]
prefix = "docker.io"
location = "docker.io"
[[registry.mirror]]
location = "registry.corp.exemple.fr/dockerhub"
```

```bash
sudo systemctl restart crio
sudo crictl info | head -40
```

## Avec kubeadm

```bash
sudo kubeadm init --cri-socket=unix:///var/run/crio/crio.sock --pod-network-cidr=10.244.0.0/16
sudo kubeadm join … --cri-socket=unix:///var/run/crio/crio.sock
```

## Dépannage

| Symptôme | Cause et correction |
| --- | --- |
| Nœud `NotReady`, « no CNI configuration » | Plug-in réseau (Calico, Cilium, Flannel) non déployé |
| `ImagePullBackOff` | Registre ou miroir mal configuré, authentification : `crictl pull` pour tester |
| Pods redémarrés en boucle après mise à jour | Version de CRI-O ≠ version de Kubernetes, gestionnaire de cgroups différent du kubelet |

Journaux : `journalctl -u crio -f`. Commandes : [[90-aide-memoire|aide-mémoire]].
