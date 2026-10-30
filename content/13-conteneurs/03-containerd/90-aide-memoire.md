---
title: containerd — aide-mémoire des commandes
description: Commandes containerd avec exemples — service et configuration (containerd config default, SystemdCgroup, miroirs de registres), nerdctl (syntaxe Docker), ctr (espaces de noms, images, conteneurs, tâches, instantanés), crictl pour Kubernetes (pods, conteneurs, images, journaux, inspection), nettoyage et dépannage.
tags: [aide-mémoire, containerd, nerdctl, ctr, crictl, kubernetes]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-utilisation|containerd]].

## Service et configuration

```bash
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml     # Kubernetes avec systemd
sudo systemctl restart containerd
containerd --version
sudo journalctl -u containerd -f
```

## nerdctl (compatible Docker)

```bash
sudo nerdctl run -d --name web -p 8080:80 nginx:1.27
sudo nerdctl ps
sudo nerdctl logs web
sudo nerdctl compose up -d
sudo nerdctl --namespace k8s.io images          # images utilisées par Kubernetes
```

## ctr (outil bas niveau)

```bash
sudo ctr namespaces ls
sudo ctr -n k8s.io images ls | head
sudo ctr images pull docker.io/library/alpine:3.20
sudo ctr run --rm -t docker.io/library/alpine:3.20 test sh
sudo ctr containers ls
sudo ctr tasks ls
sudo ctr -n k8s.io images import image-hors-ligne.tar        # charger une image sans registre
sudo ctr -n k8s.io images export alpine.tar docker.io/library/alpine:3.20
sudo ctr snapshots ls | head
```

## crictl (Kubernetes)

```bash
sudo crictl --runtime-endpoint unix:///run/containerd/containerd.sock info | head
sudo crictl pods
sudo crictl ps -a
sudo crictl logs <id-conteneur>
sudo crictl inspect <id-conteneur> | jq '.info.runtimeSpec.process.args'
sudo crictl exec -it <id-conteneur> sh
sudo crictl images
sudo crictl pull registry.k8s.io/pause:3.10
sudo crictl rmi --prune                             # images inutilisées
sudo crictl stats
```

```yaml
# /etc/crictl.yaml
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 10
```

## Miroir de registre

```toml
# /etc/containerd/certs.d/docker.io/hosts.toml
server = "https://registry-1.docker.io"
[host."https://miroir.exemple.fr"]
  capabilities = ["pull", "resolve"]
```

(Dans `config.toml` : `config_path = "/etc/containerd/certs.d"` sous la section du registre CRI.)
