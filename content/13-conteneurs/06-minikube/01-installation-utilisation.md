---
title: Installation et utilisation
description: Minikube, cluster Kubernetes local pour le développement et la formation — pilotes (Docker, Hyper-V, VirtualBox, KVM, QEMU, vfkit), installation sous Windows, macOS et Linux, démarrage multi-nœuds et choix de version, modules (Ingress, metrics-server, tableau de bord, registre), accès aux services (tunnel, service), images locales, profils et dépannage.
tags: [minikube, kubernetes, local, développement, windows, macos, addons]
icon: laptop
---

**Minikube** crée un cluster Kubernetes **local** (dans un conteneur ou une machine virtuelle) sur un poste Windows, macOS ou Linux. Il sert à développer, tester des manifestes et des charts Helm, et à se former, avec des **modules** prêts à l'emploi.

## Installation

| Système | Installation |
| --- | --- |
| Windows | `winget install Kubernetes.minikube` |
| macOS | `brew install minikube` |
| Linux | `curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && sudo install minikube-linux-amd64 /usr/local/bin/minikube` |

## Pilotes

| Pilote | Plates-formes | Remarque |
| --- | --- | --- |
| **docker** (défaut si présent) | Toutes | Le plus simple (Docker Desktop, Docker Engine) |
| podman | Linux, macOS | Expérimental selon les versions |
| **hyperv** | Windows Pro/Entreprise | Console d'administration en mode administrateur, commutateur virtuel |
| virtualbox | Toutes | Hyperviseur tiers |
| kvm2 | Linux | Performant |
| qemu, vfkit | macOS | Macs Apple Silicon |

## Démarrer

```bash
minikube start --driver=docker --cpus=4 --memory=8g --kubernetes-version=v1.33.4
minikube start -p multi --nodes 3                 # cluster de 3 nœuds dans un profil distinct
minikube status
kubectl get nodes                                 # minikube configure le contexte kubectl
minikube kubectl -- get pods -A                   # kubectl fourni si absent du poste
```

## Modules

```bash
minikube addons list
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable dashboard && minikube dashboard
minikube addons enable registry
```

## Accéder aux applications

| Méthode | Commande |
| --- | --- |
| Service NodePort | `minikube service inventaire -n reseau --url` |
| Services LoadBalancer | `minikube tunnel` (dans un terminal dédié, droits administrateur) : attribue des IP externes |
| Ingress | Module `ingress` + `minikube ip` (ou `tunnel` avec le pilote docker sous Windows/macOS) et une entrée dans le fichier `hosts` |
| Redirection | `kubectl port-forward svc/inventaire 8000:80` |

## Images locales

```bash
minikube image build -t inventaire:dev .          # construire directement dans le cluster
minikube image load inventaire:dev                # charger une image du poste
eval $(minikube docker-env)                       # utiliser le démon Docker de minikube (pilote docker/VM)
```

Dans les manifestes, `imagePullPolicy: IfNotPresent` (ou `Never`) évite de chercher l'image dans un registre.

## Gestion

```bash
minikube stop
minikube delete                     # supprime le cluster du profil
minikube delete --all --purge       # tout supprimer
minikube profile list
minikube ssh                        # shell dans le nœud
minikube logs
```

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `Exiting due to PROVIDER_DOCKER_NOT_RUNNING` | Docker arrêté | Démarrer Docker Desktop / le service |
| Lenteur, pods évincés | Ressources insuffisantes | `--cpus`, `--memory` (recréer le cluster) |
| `minikube tunnel` sans effet | Droits insuffisants, tunnel fermé | Lancer en administrateur et laisser le terminal ouvert |
| Hyper-V : pas d'accès réseau | Commutateur virtuel | `--hyperv-virtual-switch "Commutateur externe"` |
| Proxy d'entreprise | Téléchargements bloqués | Variables `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY` (inclure `minikube ip` et `10.96.0.0/12`) au démarrage |
| Certificat d'entreprise (inspection TLS) | AC du proxy inconnue | Copier l'AC dans `~/.minikube/certs/` puis `minikube start --embed-certs` |

Pour des tests automatisés (CI) ou plusieurs clusters jetables, voir aussi [[07-kind/01-installation-utilisation|Kind]].
