---
title: MLflow
description: MLflow, plate-forme libre du cycle de vie de l'apprentissage automatique — suivi d'expériences (paramètres, métriques, artefacts, autolog), serveur de suivi (base PostgreSQL, stockage d'artefacts S3 ou MinIO, proxy d'artefacts, port 5000), registre de modèles (versions, alias), service de modèles (mlflow models serve, conteneurs), suivi des applications LLM, authentification de base et déploiement derrière un proxy.
tags: [mlflow, mlops, apprentissage automatique, machine learning, registre de modèles, expériences, python]
icon: flask-conical
---

**MLflow** (Apache 2.0, Linux Foundation) note tout ce qui concerne un entraînement de modèle — **paramètres**, **métriques**, **artefacts** (graphiques, modèle sérialisé) — puis gère les modèles retenus dans un **registre** et les sert par API.

## Suivi d'expériences

```python
import mlflow
from sklearn.ensemble import RandomForestClassifier

mlflow.set_tracking_uri("https://mlflow.exemple.fr")
mlflow.set_experiment("detection-fraude")
mlflow.sklearn.autolog()                     # journalise automatiquement paramètres, métriques et modèle

with mlflow.start_run(run_name="rf-200"):
    modele = RandomForestClassifier(n_estimators=200).fit(X_train, y_train)
    mlflow.log_metric("auc_test", auc(y_test, modele.predict_proba(X_test)[:, 1]))
    mlflow.log_artifact("matrice_confusion.png")
    mlflow.sklearn.log_model(modele, name="modele", registered_model_name="fraude")
```

L'interface web compare les exécutions (tableaux, courbes, différences de paramètres).

## Serveur de suivi

| Élément | Choix conseillé en production |
| --- | --- |
| Métadonnées (*backend store*) | **PostgreSQL** ou MySQL (SQLite seulement pour l'essai) |
| Artefacts | Stockage objet **S3 / MinIO**, Azure Blob, GCS, ou partage NFS |
| Accès aux artefacts | Via le serveur (`--serve-artifacts`) : les clients n'ont pas besoin des clés S3 |

```bash
python3 -m pip install mlflow psycopg2-binary boto3
export MLFLOW_S3_ENDPOINT_URL=https://minio.exemple.fr
export AWS_ACCESS_KEY_ID=mlflow AWS_SECRET_ACCESS_KEY='…'
mlflow server --host 127.0.0.1 --port 5000 \
  --backend-store-uri postgresql://mlflow:…@db/mlflow \
  --artifacts-destination s3://mlflow-artefacts \
  --serve-artifacts
mlflow db upgrade postgresql://mlflow:…@db/mlflow       # après une mise à jour de version
```

## Registre et service de modèles

```python
from mlflow import MlflowClient
client = MlflowClient()
client.set_registered_model_alias("fraude", "production", version=7)
modele = mlflow.pyfunc.load_model("models:/fraude@production")
```

```bash
mlflow models serve -m "models:/fraude@production" --port 5001 --env-manager local
curl -X POST localhost:5001/invocations -H 'Content-Type: application/json' -d '{"dataframe_records": [{"montant": 950, "pays": "FR"}]}'
mlflow models build-docker -m "models:/fraude@production" -n fraude:7   # image de service
```

MLflow suit aussi les **applications LLM** (traces des appels, évaluation des réponses, invites versionnées).

## Sécurité

> [!WARNING]
> Par défaut, le serveur MLflow **n'a aucune authentification** et quiconque l'atteint peut lire et supprimer expériences et modèles. L'écouter sur `127.0.0.1` derrière un proxy HTTPS avec authentification (OIDC, oauth2-proxy), ou activer l'authentification intégrée.

```bash
mlflow server --app-name basic-auth --host 127.0.0.1 --port 5000   # comptes et permissions par expérience ; changer le compte admin par défaut
```

Voir aussi : [[01-jupyterhub|JupyterHub]] · [[03-dvc-pachyderm|DVC et Pachyderm]]. Commandes : [[90-aide-memoire|aide-mémoire]].
