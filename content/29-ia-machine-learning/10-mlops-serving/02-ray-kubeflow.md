---
title: Ray et Kubeflow
description: Ray (Anyscale, Apache 2.0 : calcul distribué Python avec tâches et acteurs, Ray Data, Train, Tune, Serve, grappe ray start, tableau de bord port 8265, soumission de tâches, KubeRay sur Kubernetes) et Kubeflow (plate-forme ML sur Kubernetes : Pipelines KFP, Notebooks, Katib, Training Operator, KServe, Model Registry, profils et espaces de noms, installation avec manifests et kustomize, accès par Istio et Dex) ; exploitation et choix.
tags: [ray, kuberay, ray serve, kubeflow, kubeflow pipelines, katib, mlops, kubernetes, calcul distribué]
icon: rocket
---

## Ray

**Ray** permet de répartir du code Python sur une **grappe** de machines (CPU et GPU) avec très peu de changements. Il sert aussi de base à des bibliothèques d'IA : préparation de données, entraînement distribué, recherche d'hyperparamètres et service de modèles. vLLM l'utilise pour répartir un modèle sur plusieurs serveurs.

| Bibliothèque | Rôle |
| --- | --- |
| Ray Core | Tâches (`@ray.remote`) et acteurs (objets à état distants) |
| **Ray Data** | Chargement et transformation distribués |
| **Ray Train** | Entraînement distribué (PyTorch, XGBoost…) |
| **Ray Tune** | Recherche d'hyperparamètres |
| **Ray Serve** | Service de modèles composables, mise à l'échelle automatique |

```bash
python3 -m pip install "ray[default,data,train,tune,serve]"
ray start --head --port=6379 --dashboard-host=127.0.0.1           # nœud principal ; tableau de bord :8265
ray start --address=10.0.0.10:6379                                 # sur chaque nœud de travail
ray status
ray job submit --address http://127.0.0.1:8265 --working-dir . -- python3 traitement.py
ray stop
```

```python
import ray
ray.init(address="auto")

@ray.remote(num_cpus=1)
def analyser(fichier):
    import pandas as pd
    return pd.read_parquet(fichier)["octets"].sum()

totaux = ray.get([analyser.remote(f) for f in fichiers])     # exécuté en parallèle sur la grappe
```

Sur Kubernetes, **KubeRay** fournit les ressources `RayCluster`, `RayJob` et `RayService` (Helm `kuberay-operator`).

> [!WARNING]
> Le tableau de bord et l'API de soumission de tâches de Ray **n'ont pas d'authentification** : quiconque y accède peut exécuter du code sur la grappe (des attaques réelles ont exploité des grappes exposées). Les garder sur un réseau privé, derrière un proxy authentifié.

## Kubeflow

**Kubeflow** est une **plate-forme ML complète sur Kubernetes**, composée de projets utilisables ensemble ou séparément.

| Composant | Rôle |
| --- | --- |
| **Kubeflow Pipelines** (KFP) | Pipelines ML en Python, exécutés en conteneurs, avec suivi des artefacts |
| Notebooks | Serveurs JupyterLab, VS Code ou RStudio par utilisateur |
| **Katib** | Recherche d'hyperparamètres et AutoML |
| Training Operator / Trainer | Entraînement distribué (PyTorch, TensorFlow, MPI, XGBoost) |
| **KServe** | Service de modèles (voir [[01-bentoml-kserve-seldon\|KServe]]) |
| Model Registry | Registre de modèles et métadonnées |
| Profils | Multi-utilisateurs : un espace de noms par équipe |

```bash
# Installation de référence (grappe dédiée conseillée : ressources importantes)
git clone https://github.com/kubeflow/manifests.git && cd manifests
git checkout <version>
while ! kustomize build example | kubectl apply --server-side --force-conflicts -f -; do echo "Nouvel essai…"; sleep 20; done
kubectl get pods -A | grep -v Running
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80   # accès local ; changer l'utilisateur et le mot de passe Dex par défaut
```

```python
from kfp import dsl, compiler

@dsl.component(base_image="python:3.12", packages_to_install=["pandas", "scikit-learn"])
def entrainer(donnees: str) -> float:
    ...
    return 0.91

@dsl.pipeline(name="escalade")
def pipeline(donnees: str = "s3://lac/tickets.parquet"):
    entrainer(donnees=donnees)

compiler.Compiler().compile(pipeline, "pipeline.yaml")   # à importer dans l'interface ou via le client KFP
```

Kubeflow est puissant mais **lourd à exploiter** (Istio, Dex, Knative, cert-manager, nombreux contrôleurs) : on n'installe souvent que les briques nécessaires (KFP seul, KServe seul) ou une distribution packagée.

## Choisir

| Besoin | Outil |
| --- | --- |
| Paralléliser du Python, entraîner ou servir sur plusieurs GPU | Ray |
| Plate-forme ML multi-équipes sur Kubernetes | Kubeflow |
| Orchestration de pipelines de données et ML sans Kubernetes | Airflow, Dagster, Prefect, ou [[28-data-analytique/07-science-donnees/02-mlflow\|MLflow]] pour le suivi |

Commandes : [[90-aide-memoire|aide-mémoire]].
