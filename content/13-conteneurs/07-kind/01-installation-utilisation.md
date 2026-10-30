---
title: Installation et utilisation
description: Kind (Kubernetes IN Docker) — clusters Kubernetes dont les nœuds sont des conteneurs Docker ou Podman, installation, fichier de configuration (plusieurs nœuds, version, ports exposés, plages réseau, miroirs), chargement d'images locales, Ingress, utilisation en intégration continue et dépannage.
tags: [kind, kubernetes, docker, tests, ci, local]
icon: layers
---

**Kind** exécute chaque nœud Kubernetes dans un **conteneur** Docker (ou Podman). Création en une trentaine de secondes, plusieurs clusters en parallèle, multi-nœuds : il est conçu pour **tester** Kubernetes lui-même et pour les chaînes d'**intégration continue**, et sert aussi en développement local.

## Installation

| Système | Installation |
| --- | --- |
| Windows | `winget install Kubernetes.kind` (Docker Desktop requis) |
| macOS | `brew install kind` |
| Linux | `curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.29.0/kind-linux-amd64 && sudo install kind /usr/local/bin/` |
| Avec Go | `go install sigs.k8s.io/kind@v0.29.0` |

## Créer un cluster

```bash
kind create cluster --name dev
kubectl cluster-info --context kind-dev
kind get clusters
kind delete cluster --name dev
```

## Fichier de configuration

```yaml kind-config.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: labo
networking:
  podSubnet: "172.24.0.0/16"
  serviceSubnet: "172.25.0.0/16"
  # disableDefaultCNI: true        # pour installer Calico ou Cilium
nodes:
  - role: control-plane
    image: kindest/node:v1.33.1      # version de Kubernetes (image correspondant à la version de kind)
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"
    extraPortMappings:
      - { containerPort: 80, hostPort: 80, protocol: TCP }
      - { containerPort: 443, hostPort: 443, protocol: TCP }
  - role: worker
  - role: worker
containerdConfigPatches:
  - |-
    [plugins."io.containerd.grpc.v1.cri".registry]
      config_path = "/etc/containerd/certs.d"
```

```bash
kind create cluster --config kind-config.yaml
```

`extraPortMappings` publie les ports 80/443 du nœud de contrôle sur le poste : un Ingress controller (ingress-nginx dans sa variante « kind ») y devient accessible via `http://localhost`.

## Images locales

```bash
docker build -t inventaire:dev .
kind load docker-image inventaire:dev --name labo        # copie l'image dans tous les nœuds
kind load image-archive inventaire.tar --name labo
```

Utilisez un tag explicite (pas `latest`) et `imagePullPolicy: IfNotPresent`.

## Intégration continue

```yaml .gitlab-ci.yml (extrait)
tests-k8s:
  image: docker:27
  services: [ docker:27-dind ]
  variables: { DOCKER_TLS_CERTDIR: "" }
  script:
    - apk add --no-cache curl kubectl
    - curl -Lo /usr/local/bin/kind https://kind.sigs.k8s.io/dl/v0.29.0/kind-linux-amd64 && chmod +x /usr/local/bin/kind
    - kind create cluster --wait 120s
    - kubectl apply -k deploiement/test
    - kubectl rollout status deploy/inventaire --timeout=120s
```

Sur GitHub Actions, l'action `helm/kind-action` crée le cluster en une ligne.

## Kind ou Minikube ?

| Critère | Kind | [[06-minikube/01-installation-utilisation\|Minikube]] |
| --- | --- | --- |
| Nœuds | Conteneurs | Conteneur ou VM |
| Démarrage | Très rapide | Rapide |
| Modules prêts à l'emploi | Non (installation manuelle) | Oui (`addons`) |
| Usage typique | CI, tests de charts/opérateurs, multi-clusters | Développement, formation |

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `failed to create cluster: … port is already allocated` | Port de l'hôte occupé (`extraPortMappings`) | Libérer le port ou en choisir un autre |
| Pods `ImagePullBackOff` pour une image locale | Image non chargée dans les nœuds | `kind load docker-image` |
| Cluster lent ou instable | Ressources de Docker Desktop insuffisantes | Augmenter CPU/mémoire de Docker Desktop |
| Trop de fichiers ouverts (inotify) avec plusieurs clusters | Limites du noyau | `fs.inotify.max_user_watches=524288`, `max_user_instances=512` |
| Accès aux registres internes impossible | AC d'entreprise inconnue des nœuds | Monter l'AC (`extraMounts`) et la configuration `certs.d` |
