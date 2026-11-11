---
title: JupyterHub, MLflow, DVC et Pachyderm — aide-mémoire
description: Commandes de JupyterHub (tljh-config, Helm, jupyterhub), MLflow (mlflow server, db upgrade, models serve, build-docker), DVC (init, remote, add, push, pull, checkout, repro, metrics, exp) et Pachyderm (pachctl repo, file, pipeline, job).
tags: [aide-mémoire, jupyterhub, mlflow, dvc, pachyderm, mlops]
icon: terminal
---

Explications : [[01-jupyterhub|JupyterHub]] · [[02-mlflow|MLflow]] · [[03-dvc-pachyderm|DVC et Pachyderm]].

| Outil | Port |
| --- | --- |
| JupyterHub | 8000 proxy (public), 8081 hub (interne) |
| MLflow | 5000 serveur de suivi, 5001 service de modèle (exemple) |
| Pachyderm | Selon le chart Helm (console et API pachd) |

```bash
# JupyterHub
sudo tljh-config show ; sudo tljh-config set limits.memory 4G ; sudo tljh-config reload
helm upgrade --install jhub jupyterhub/jupyterhub -n jhub --values config.yaml
jupyterhub -f /etc/jupyterhub/jupyterhub_config.py

# MLflow
mlflow server --host 127.0.0.1 --port 5000 --backend-store-uri postgresql://… --artifacts-destination s3://… --serve-artifacts
mlflow db upgrade postgresql://…
mlflow models serve -m "models:/fraude@production" --port 5001
mlflow models build-docker -m "models:/fraude@production" -n fraude:7

# DVC
dvc init ; dvc remote add -d stockage s3://bucket/cache
dvc add donnees/f.parquet ; dvc push ; dvc pull ; dvc checkout
dvc status ; dvc repro ; dvc dag ; dvc metrics diff main ; dvc exp show

# Pachyderm
pachctl create repo donnees ; pachctl put file donnees@master:/f.csv -f f.csv
pachctl create pipeline -f pipeline.json ; pachctl list job ; pachctl list commit donnees@master
```
