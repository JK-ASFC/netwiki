---
title: BentoML, KServe, Seldon, Ray et Kubeflow — aide-mémoire
description: Ports et commandes de BentoML (serve, build, containerize), KServe (InferenceService, kubectl), MLServer, Ray (start, status, job submit, KubeRay) et Kubeflow (manifests, port-forward, compilation KFP).
tags: [aide-mémoire, bentoml, kserve, seldon, mlserver, ray, kubeflow]
icon: terminal
---

Explications : [[01-bentoml-kserve-seldon|BentoML, KServe et Seldon Core]] · [[02-ray-kubeflow|Ray et Kubeflow]].

| Outil | Port |
| --- | --- |
| BentoML | 3000 |
| MLServer | 8080 REST, 8081 gRPC |
| Ray | 6379 GCS, 8265 tableau de bord et API de tâches, 10001 client |
| Kubeflow | Passerelle Istio (80/443) |

```bash
# BentoML
bentoml serve service:Classe --port 3000
bentoml build ; bentoml list ; bentoml containerize nom:latest -t registre/nom:1.0

# KServe
kubectl apply -f isvc.yaml ; kubectl get inferenceservices -A
kubectl describe inferenceservice NOM -n ml
kubectl logs -n ml -l serving.kserve.io/inferenceservice=NOM -c kserve-container

# MLServer
mlserver start .

# Ray
ray start --head --port=6379 --dashboard-host=127.0.0.1 ; ray start --address=TETE:6379
ray status ; ray job submit --address http://127.0.0.1:8265 --working-dir . -- python3 script.py
ray job list --address http://127.0.0.1:8265 ; ray stop
helm repo add kuberay https://ray-project.github.io/kuberay-helm/ && helm install kuberay-operator kuberay/kuberay-operator

# Kubeflow
kustomize build example | kubectl apply --server-side --force-conflicts -f -
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80
python3 pipeline.py        # compile pipeline.yaml (kfp)
```
