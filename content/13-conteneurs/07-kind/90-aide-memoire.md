---
title: kind — aide-mémoire des commandes
description: Commandes kind (Kubernetes in Docker) avec exemples — création de grappes (nom, image de nœud, fichier de configuration multi-nœuds, ports exposés, ingress), contextes kubectl, chargement d'images locales, export des journaux, kubeconfig, suppression, usage en intégration continue.
tags: [aide-mémoire, kind, kubernetes, docker, intégration continue]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-utilisation|kind]].

## Grappes

```bash
kind create cluster
kind create cluster --name labo --image kindest/node:v1.31.2
kind create cluster --name multi --config kind-multi.yaml --wait 120s
kind get clusters
kind get nodes --name multi
kubectl cluster-info --context kind-multi
kind delete cluster --name labo
kind delete clusters --all
```

```yaml
# kind-multi.yaml : 1 plan de contrôle, 2 nœuds, ports 80/443 pour un ingress
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
      - containerPort: 443
        hostPort: 443
  - role: worker
  - role: worker
networking:
  podSubnet: "10.244.0.0/16"
```

## Images et journaux

```bash
docker build -t app:dev .
kind load docker-image app:dev --name multi           # l'image doit utiliser imagePullPolicy: IfNotPresent
kind load image-archive app-dev.tar --name multi
kind export logs ./journaux-kind --name multi
kind get kubeconfig --name multi > kubeconfig-multi.yaml
docker exec -it multi-control-plane crictl ps         # chaque nœud est un conteneur
```
