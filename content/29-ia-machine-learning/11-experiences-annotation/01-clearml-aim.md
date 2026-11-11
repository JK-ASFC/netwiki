---
title: ClearML et Aim
description: Suivi d'expériences et MLOps auto-hébergés — ClearML (Apache 2.0 : serveur Docker Compose avec interface 8080, API 8008 et fichiers 8081, Elasticsearch, MongoDB, Redis ; SDK Task.init, clearml-init, agents et files d'exécution clearml-agent, jeux de données versionnés clearml-data, pipelines, service de modèles) et Aim (Apache 2.0 : journalisation légère, aim init, aim up port 43800, interface de comparaison, serveur distant aim server, intégrations PyTorch Lightning, Hugging Face, XGBoost) ; comparaison avec MLflow.
tags: [clearml, aim, suivi d'expériences, mlops, experiment tracking, agents, python]
icon: tag
---

Le suivi d'expériences enregistre, pour chaque entraînement, **le code, les paramètres, les métriques, les artefacts et l'environnement**, afin de comparer les essais et de reproduire le meilleur. [[28-data-analytique/07-science-donnees/02-mlflow|MLflow]] est l'outil le plus répandu ; ClearML et Aim en sont deux alternatives libres.

## ClearML

**ClearML** est une suite MLOps complète : suivi d'expériences, **exécution à distance** sur des machines GPU via des **agents**, versionnage de jeux de données, pipelines et service de modèles.

```bash
# Serveur (Linux, 8 Go de RAM minimum)
sudo mkdir -p /opt/clearml/{data,logs,config}
curl -o /opt/clearml/docker-compose.yml https://raw.githubusercontent.com/clearml/clearml-server/master/docker/docker-compose.yml
sudo sysctl -w vm.max_map_count=262144                   # Elasticsearch
cd /opt/clearml && docker compose up -d
```

| Port | Service |
| --- | --- |
| 8080 | Interface web |
| 8008 | API |
| 8081 | Serveur de fichiers (artefacts, modèles) |

Par défaut, l'inscription est ouverte et sans mot de passe : définir des comptes fixes dans `/opt/clearml/config/apiserver.conf` (`auth.fixed_users`) ou brancher un SSO, et publier derrière HTTPS.

```bash
python3 -m pip install clearml
clearml-init                         # colle les identifiants générés dans l'interface (Settings → Workspace)
```

```python
from clearml import Task
tache = Task.init(project_name="escalade-tickets", task_name="catboost-v3")
tache.connect({"learning_rate": 0.05, "iterations": 1000})     # paramètres modifiables depuis l'interface
journal = tache.get_logger()
journal.report_scalar("f1", "validation", value=0.87, iteration=1)
# Les métriques de PyTorch, TensorBoard, Matplotlib, scikit-learn… sont capturées automatiquement
```

```bash
# Machine GPU : agent qui exécute les tâches mises en file
python3 -m pip install clearml-agent
clearml-agent init
clearml-agent daemon --queue gpu --docker nvidia/cuda:12.6.3-runtime-ubuntu24.04 --detached
# Jeux de données versionnés
clearml-data create --project escalade-tickets --name tickets-2026-11
clearml-data add --files donnees/ ; clearml-data close
```

Depuis l'interface, on **clone** une expérience, modifie un paramètre et la **met en file** : un agent la rejoue sur un GPU libre.

## Aim

**Aim** est un outil de suivi **léger** centré sur la visualisation : il stocke les exécutions dans un dépôt local `.aim` et offre une interface très rapide pour comparer des milliers de courbes.

```bash
python3 -m pip install aim
aim init                                        # crée le dépôt .aim
aim up --host 127.0.0.1 --port 43800            # interface web
aim server --repo /srv/aim --port 53800         # serveur distant de suivi
```

```python
from aim import Run
run = Run(repo="aim://serveur-aim:53800", experiment="escalade")   # ou dépôt local par défaut
run["hparams"] = {"lr": 0.05, "profondeur": 6}
for epoque in range(10):
    run.track(perte, name="perte", epoch=epoque, context={"subset": "train"})
```

Intégrations prêtes pour PyTorch Lightning, Hugging Face Transformers, Keras, XGBoost, LightGBM et Optuna. Aim n'a pas de gestion des utilisateurs : le protéger par le réseau ou un proxy.

## Comparatif

| Critère | MLflow | ClearML | Aim |
| --- | --- | --- | --- |
| Suivi d'expériences | Oui | Oui (capture automatique poussée) | Oui (visualisation rapide) |
| Registre de modèles | Oui | Oui | Non |
| Exécution à distance (agents, files) | Non | **Oui** | Non |
| Données versionnées | Non | clearml-data | Non |
| Infrastructure | Légère | Lourde (Elasticsearch, MongoDB) | Très légère |

Voir aussi : [[02-label-studio-cvat-fiftyone|Label Studio, CVAT et FiftyOne]]. Commandes : [[90-aide-memoire|aide-mémoire]].
