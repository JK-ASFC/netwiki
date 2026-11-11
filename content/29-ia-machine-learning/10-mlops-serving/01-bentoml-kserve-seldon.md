---
title: BentoML, KServe et Seldon Core
description: Servir des modèles en production — BentoML (Apache 2.0 : service Python décoré, bentoml serve, build et containerize, traitement par lots adaptatif, port 3000), KServe (projet CNCF : InferenceService, runtimes Triton, TorchServe, MLServer, Hugging Face et vLLM, mise à l'échelle à zéro avec Knative, déploiement brut, canari, stockage S3 et PVC, protocole d'inférence v2) et Seldon Core 2 (MLServer, pipelines, expériences, licence BSL) ; observabilité, sécurité et choix.
tags: [bentoml, kserve, seldon core, mlserver, model serving, kubernetes, mlops, inférence]
icon: rocket
---

Servir un modèle, c'est l'exposer en **API** fiable : chargement, prétraitement, regroupement des requêtes (*batching*), mise à l'échelle, versions, supervision.

## BentoML

**BentoML** (Apache 2.0) transforme du code Python en **service d'inférence**, puis en **image de conteneur**, sans dépendre de Kubernetes.

```bash
python3 -m pip install bentoml scikit-learn joblib
```

```python service.py
import bentoml, joblib, numpy as np

@bentoml.service(resources={"cpu": "2"}, traffic={"timeout": 30})
class Escalade:
    def __init__(self):
        self.modele = joblib.load("escalade.joblib")

    @bentoml.api(batchable=True, max_batch_size=64, max_latency_ms=50)
    def predire(self, lignes: list[dict]) -> list[float]:
        import pandas as pd
        return self.modele.predict_proba(pd.DataFrame(lignes))[:, 1].tolist()
```

```yaml bentofile.yaml
service: "service:Escalade"
include: [ "service.py", "escalade.joblib" ]
python:
  packages: [ scikit-learn, pandas, joblib ]
```

```bash
bentoml serve service:Escalade --port 3000              # http://localhost:3000 (documentation Swagger)
curl -X POST http://localhost:3000/predire -H 'Content-Type: application/json' \
  -d '{"lignes":[{"categorie":"réseau","priorite":"P2","site":"Lyon","delai_h":5,"nb_relances":2}]}'
bentoml build ; bentoml list
bentoml containerize escalade:latest -t registre.exemple.fr/escalade:1.0
```

Le **traitement par lots adaptatif** regroupe les requêtes simultanées pour exploiter le GPU. BentoML sert aussi des LLM (avec vLLM en interne) et propose une offre cloud optionnelle.

## KServe

**KServe** (CNCF) est le standard de service de modèles sur **Kubernetes** : une ressource `InferenceService` décrit le modèle, KServe crée les pods, le routage et la mise à l'échelle.

```bash
# Prérequis : Kubernetes, cert-manager ; Knative + Istio pour le mode serverless (ou mode « RawDeployment » sans Knative)
kubectl apply --server-side -f https://github.com/kserve/kserve/releases/download/<version>/kserve.yaml
kubectl apply --server-side -f https://github.com/kserve/kserve/releases/download/<version>/kserve-cluster-resources.yaml
```

```yaml escalade-isvc.yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: escalade
  namespace: ml
spec:
  predictor:
    minReplicas: 1
    maxReplicas: 5
    model:
      modelFormat: { name: sklearn }
      storageUri: s3://modeles/escalade/v3/
      resources: { requests: { cpu: "1", memory: 2Gi }, limits: { cpu: "2", memory: 4Gi } }
```

```bash
kubectl apply -f escalade-isvc.yaml
kubectl -n ml get inferenceservices
curl -H "Host: escalade.ml.exemple.fr" http://<passerelle>/v1/models/escalade:predict -d '{"instances": [[…]]}'
```

| Fonction | Détail |
| --- | --- |
| Runtimes | scikit-learn, XGBoost, LightGBM, ONNX, TensorFlow, PyTorch (TorchServe), **Triton**, **MLServer**, **Hugging Face** (avec vLLM pour les LLM) |
| Échelle à zéro | Mode serverless (Knative) : pas de pod sans trafic |
| Déploiement progressif | `canaryTrafficPercent` pour basculer une nouvelle version |
| Chaînage | `InferenceGraph` (étapes, routage, ensembles) |
| Protocoles | v1 (TensorFlow Serving), **Open Inference Protocol (v2)**, API OpenAI pour les LLM |

Les identifiants S3 se fournissent par un *ServiceAccount* et un *Secret* annotés.

## Seldon Core

**Seldon Core 2** déploie modèles et **pipelines** sur Kubernetes avec Kafka pour les flux entre étapes, des **expériences** (tests A/B, miroir de trafic) et s'appuie sur **MLServer** (serveur Python libre, compatible protocole v2) et Triton.

> [!NOTE]
> Seldon Core est passé sous **Business Source License** : l'usage en production nécessite une licence commerciale au-delà de certaines conditions. **MLServer** reste sous Apache 2.0 et peut s'utiliser seul ou dans KServe.

```bash
python3 -m pip install mlserver mlserver-sklearn
mlserver start .          # lit model-settings.json : nom, implémentation, chemin du modèle ; ports 8080 (REST) et 8081 (gRPC)
```

## Observabilité et sécurité

- Métriques Prometheus (latence, débit, erreurs) et journaux des prédictions pour détecter la **dérive** (Evidently, NannyML).
- Authentification devant l'API (passerelle, mTLS dans le maillage de services), quotas.
- Images reproductibles et analysées ; modèles chargés depuis un stockage en lecture seule, avec versions immuables.

## Choisir

| Besoin | Outil |
| --- | --- |
| Service Python simple, conteneur, sans Kubernetes | BentoML |
| Plate-forme multi-modèles standard sur Kubernetes | KServe |
| Pipelines complexes et expériences, licence commerciale acceptée | Seldon Core 2 |
| LLM sur GPU | [[02-serveurs-inference/01-vllm-tgi\|vLLM]] (seul ou dans KServe) |

Voir aussi : [[02-ray-kubeflow|Ray et Kubeflow]] · [[09-ml-classique-inference/02-onnx-runtime-openvino|ONNX Runtime et OpenVINO]]. Commandes : [[90-aide-memoire|aide-mémoire]].
