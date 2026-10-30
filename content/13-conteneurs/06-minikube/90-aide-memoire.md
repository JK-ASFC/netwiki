---
title: Minikube — aide-mémoire des commandes
description: Commandes Minikube avec exemples — démarrage (pilotes docker, hyperv, virtualbox, qemu ; ressources ; version de Kubernetes ; plusieurs nœuds), profils, extensions (ingress, metrics-server, dashboard, registry), accès aux services (service, tunnel), images locales (image load, docker-env), montage de dossiers, SSH, arrêt, suppression et dépannage.
tags: [aide-mémoire, minikube, kubernetes, laboratoire, développement]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-utilisation|Minikube]].

## Démarrage et profils

```bash
minikube start --driver=docker --cpus=4 --memory=8g --kubernetes-version=v1.31.2
minikube start -p labo --nodes 3 --driver=docker
minikube start --driver=hyperv --hyperv-virtual-switch "Commutateur externe"     # Windows
minikube profile list
minikube profile labo
minikube status
minikube kubectl -- get pods -A
minikube ip
```

## Extensions

```bash
minikube addons list
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable registry
minikube dashboard --url
```

## Accéder aux services

```bash
kubectl create deployment web --image=nginx:1.27 && kubectl expose deployment web --type=NodePort --port=80
minikube service web --url
minikube tunnel                              # adresses pour les services LoadBalancer (laisser ouvert)
kubectl port-forward svc/web 8080:80
```

## Images locales et fichiers

```bash
minikube image build -t app:dev .
minikube image load app:dev
minikube image ls | grep app
eval "$(minikube docker-env)"                # utiliser le démon Docker de Minikube (Linux/macOS)
minikube docker-env | Invoke-Expression      # PowerShell
minikube mount "$PWD/donnees:/donnees"
minikube cp ./fichier.txt /home/docker/fichier.txt
minikube ssh
```

## Arrêt et nettoyage

```bash
minikube stop
minikube pause && minikube unpause
minikube delete -p labo
minikube delete --all --purge
minikube logs --file=minikube.log            # pour le dépannage
```
