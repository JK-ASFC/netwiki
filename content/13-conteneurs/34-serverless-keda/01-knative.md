---
title: Knative
description: Knative (CNCF) — plate-forme serverless sur Kubernetes : Serving (Service, Revision, Route, mise à l'échelle à zéro, répartition du trafic entre révisions, déploiement progressif) et Eventing (Broker, Trigger, sources d'événements, CloudEvents), installation (opérateur ou manifestes, couche réseau Kourier, Istio ou Contour), configuration du domaine et TLS, CLI kn (service create/update, revision, traffic), et usages.
tags: [knative, serverless, kubernetes, scale to zero, cloudevents, kn]
icon: info
---

**Knative Serving** déploie un conteneur HTTP comme un **service** qui monte en charge selon le trafic, **jusqu'à zéro** quand il n'est pas utilisé, avec des **révisions** immuables et une répartition du trafic (déploiements progressifs, tests A/B). **Knative Eventing** relie des producteurs et consommateurs d'événements au format **CloudEvents**.

## Installation (manifestes, Serving + Kourier)

```bash
V=knative-v1.17.0     # version courante : https://github.com/knative/serving/releases
kubectl apply -f https://github.com/knative/serving/releases/download/$V/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/$V/serving-core.yaml
kubectl apply -f https://github.com/knative-extensions/net-kourier/releases/download/$V/kourier.yaml
kubectl patch configmap/config-network -n knative-serving --type merge -p '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
kubectl patch configmap/config-domain -n knative-serving --type merge -p '{"data":{"apps.corp.exemple.fr":""}}'
```

Kourier obtient une IP via un service `LoadBalancer` ([[37-ingress-certificats-dns/02-metallb-externaldns|MetalLB]] sur site) ; enregistrement DNS générique `*.apps.corp.exemple.fr`. CLI **kn** : `brew install knative/client/kn`, binaire Windows/Linux.

## Utilisation

```bash
kn service create bonjour --image ghcr.io/knative/helloworld-go:latest --env TARGET=Corp --scale-min 0 --scale-max 10
kn service list ; curl http://bonjour.default.apps.corp.exemple.fr
kn service update bonjour --env TARGET=Corp-v2 --traffic bonjour-00001=90 --traffic @latest=10   # 10 % sur la nouvelle révision
kn revision list
```

Un service mis à l'échelle zéro introduit une **latence de démarrage à froid** : `--scale-min 1` pour les services sensibles.

Suite : [[02-openfaas-fission|OpenFaaS et Fission]] · [[03-keda|KEDA]] · [[90-aide-memoire|aide-mémoire]].
