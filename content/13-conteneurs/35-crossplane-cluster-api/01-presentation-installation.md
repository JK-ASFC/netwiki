---
title: Présentation, installation et utilisation
description: Crossplane et Cluster API — gérer l'infrastructure par l'API Kubernetes : Crossplane (CNCF : providers AWS, Azure, GCP, Helm, Kubernetes, Terraform ; managed resources ; compositions et XRD pour créer des API de plate-forme ; fonctions de composition ; installation Helm ; ProviderConfig et identifiants) et Cluster API (cycle de vie déclaratif des clusters : cluster de gestion, providers d'infrastructure vSphere, Proxmox, OpenStack, AWS, Metal3, clusterctl init/generate/move, MachineDeployment, mises à jour progressives), et comparaison avec Terraform.
tags: [crossplane, cluster api, capi, kubernetes, iac, plate-forme]
icon: info
---

Ces deux projets prolongent la logique déclarative de Kubernetes **au-delà des conteneurs** : l'état voulu de l'infrastructure est décrit en ressources Kubernetes et des contrôleurs le réconcilient en permanence (contrairement à [[04-terraform/01-presentation-installation|Terraform]], qui applique un plan ponctuellement).

## Crossplane

```bash
helm repo add crossplane-stable https://charts.crossplane.io/stable && helm repo update
helm install crossplane crossplane-stable/crossplane -n crossplane-system --create-namespace
```

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata: { name: provider-helm }
spec: { package: xpkg.upbound.io/crossplane-contrib/provider-helm:v0.20.0 }   # version courante : marketplace.upbound.io
```

| Notion | Rôle |
| --- | --- |
| **Provider** | Pilote une API externe (AWS, Azure, GCP, Helm, Kubernetes, Terraform, vSphere…) |
| **Managed Resource** | Une ressource externe (bucket, base, réseau) |
| **XRD + Composition** | Définir une API maison (« BaseDeDonnees » avec 3 paramètres) assemblant plusieurs ressources |
| Claim | Demande d'une équipe dans son namespace |

Usage typique : une **plate-forme interne** où les équipes demandent une base ou un bucket par un simple YAML validé, sans accès direct au cloud.

## Cluster API

```bash
# clusterctl : binaire des versions GitHub (Linux, macOS, Windows) ou brew install clusterctl
kind create cluster --name gestion                   # cluster de gestion temporaire (ou existant)
export VSPHERE_SERVER=vcenter.corp.exemple.fr VSPHERE_USERNAME=… VSPHERE_PASSWORD=…   # variables du provider
clusterctl init --infrastructure vsphere             # ou proxmox, openstack, aws, metal3…
clusterctl generate cluster prod-01 --kubernetes-version v1.32.3 --control-plane-machine-count 3 --worker-machine-count 4 > prod-01.yaml
kubectl apply -f prod-01.yaml
clusterctl describe cluster prod-01
clusterctl get kubeconfig prod-01 > prod-01.kubeconfig
clusterctl move --to-kubeconfig=gestion-definitive.kubeconfig     # rendre le cluster de gestion pérenne
```

Une mise à jour de version se fait en modifiant le `KubeadmControlPlane` et les `MachineDeployment` : les machines sont remplacées progressivement. Commandes : [[90-aide-memoire|aide-mémoire]].
