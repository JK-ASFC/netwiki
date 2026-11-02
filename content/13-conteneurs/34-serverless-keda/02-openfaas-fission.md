---
title: OpenFaaS et Fission
description: Fonctions serverless sur Kubernetes — OpenFaaS (Community Edition sous licence restreinte et Pro, faasd sans Kubernetes, passerelle, modèles de fonctions, faas-cli new/up/invoke, NATS pour l'asynchrone, interface) et Fission (Apache 2.0 : environnements par langage, pool de pods préchauffés, déclencheurs HTTP, minuterie, files de messages, fission CLI), installation Helm, cas d'usage (webhooks, automatisations, traitements ponctuels) et limites.
tags: [openfaas, faasd, fission, serverless, fonctions, kubernetes]
icon: info
---

| | **OpenFaaS** | **Fission** |
| --- | --- | --- |
| Licence | Community Edition (usage non commercial ou limité) ; **Pro** payant ; faasd sous licence MIT | Apache 2.0 |
| Modèle | Une fonction = une image conteneur (modèles par langage) | Code source chargé dans des pods d'environnement préchauffés |
| Sans Kubernetes | **faasd** (containerd sur une VM) | Non |
| Déclencheurs | HTTP, asynchrone (NATS), cron, Kafka (Pro) | HTTP, minuterie, files (Kafka, NATS…), Kubernetes |

> [!WARNING]
> Vérifiez la licence d'OpenFaaS Community Edition avant tout usage en entreprise : elle limite l'usage commercial et certaines fonctions sont réservées à l'édition Pro.

## OpenFaaS (Helm)

```bash
helm repo add openfaas https://openfaas.github.io/faas-netes/ && helm repo update
kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml
helm upgrade --install openfaas openfaas/openfaas -n openfaas
curl -sSL https://cli.openfaas.com | sudo sh                 # faas-cli
kubectl -n openfaas port-forward svc/gateway 8080:8080 &
PASSWORD=$(kubectl -n openfaas get secret basic-auth -o jsonpath='{.data.basic-auth-password}' | base64 -d)
echo -n $PASSWORD | faas-cli login --username admin --password-stdin
faas-cli new --lang python3-http purge-cache && faas-cli up -f purge-cache.yml   # construit, pousse et déploie
echo '{"url":"/images"}' | faas-cli invoke purge-cache
```

## Fission

```bash
helm repo add fission-charts https://fission.github.io/fission-charts/ && helm repo update
helm install fission fission-charts/fission-all -n fission --create-namespace
fission env create --name python --image ghcr.io/fission/python-env
fission function create --name bonjour --env python --code bonjour.py
fission route create --method GET --url /bonjour --function bonjour
fission timer create --name nettoyage --function bonjour --cron "@every 1h"
fission function test --name bonjour
```

Suite : [[03-keda|KEDA]] · [[90-aide-memoire|aide-mémoire]].
