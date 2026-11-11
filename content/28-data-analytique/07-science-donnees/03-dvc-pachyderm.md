---
title: DVC et Pachyderm
description: Versionner données et pipelines d'apprentissage automatique — DVC (fichiers .dvc dans Git, cache, stockages distants S3, SSH, WebDAV, dvc add, push, pull, checkout, pipelines dvc.yaml, dvc repro, paramètres, métriques et expériences) et Pachyderm (dépôts de données versionnés, pipelines conteneurisés déclenchés par les données sur Kubernetes, lignage complet, pachctl, état du projet depuis son rachat) ; comparaison avec lakeFS.
tags: [dvc, pachyderm, versionnage de données, mlops, pipelines, git, kubernetes]
icon: flask-conical
---

## DVC (Data Version Control)

**DVC** (Apache 2.0) étend **Git** aux gros fichiers : jeux de données, modèles. Git ne stocke qu'un petit fichier `.dvc` (empreinte, taille) ; le contenu va dans un **cache** local et un **stockage distant** (S3, MinIO, SSH, Azure, GCS, WebDAV, dossier partagé).

```bash
python3 -m pip install "dvc[s3]"          # ou pipx install dvc ; extras ssh, azure, gs…
git init && dvc init
dvc remote add -d stockage s3://dvc-projet/cache
dvc remote modify stockage endpointurl https://minio.exemple.fr
dvc remote modify --local stockage access_key_id dvc          # --local : jamais versionné
dvc remote modify --local stockage secret_access_key '…'

dvc add donnees/ventes.parquet            # crée donnees/ventes.parquet.dvc et l'ignore dans Git
git add donnees/ventes.parquet.dvc donnees/.gitignore && git commit -m "Données de novembre"
dvc push                                   # envoie les données au stockage distant

git clone … && dvc pull                    # récupère la version correspondant au commit
git checkout v1.2 && dvc checkout          # revenir aux données d'une ancienne version
dvc status ; dvc diff v1.1 v1.2
```

### Pipelines

```yaml dvc.yaml
stages:
  preparer:
    cmd: python3 src/preparer.py donnees/ventes.parquet donnees/prepare.parquet
    deps: [ src/preparer.py, donnees/ventes.parquet ]
    outs: [ donnees/prepare.parquet ]
  entrainer:
    cmd: python3 src/entrainer.py
    deps: [ src/entrainer.py, donnees/prepare.parquet ]
    params: [ entrainement.n_estimators ]
    outs: [ modeles/modele.pkl ]
    metrics: [ metriques.json: { cache: false } ]
```

```bash
dvc repro                                  # ne relance que les étapes dont les entrées ont changé
dvc dag                                    # graphe des étapes
dvc params diff ; dvc metrics show ; dvc metrics diff main
dvc exp run -S entrainement.n_estimators=400   # expérience sans commit
dvc exp show
```

## Pachyderm

**Pachyderm** fonctionne sur **Kubernetes** : des **dépôts de données** versionnés (comme Git, pour des fichiers) alimentent des **pipelines** conteneurisés qui se déclenchent automatiquement quand de nouvelles données arrivent, avec un **lignage** complet (quel résultat provient de quelles données et de quel code).

```bash
helm repo add pachyderm https://helm.pachyderm.com && helm repo update
helm install pachyderm pachyderm/pachyderm --namespace pachyderm --create-namespace --values valeurs.yaml
pachctl version
pachctl create repo images
pachctl put file images@master:/chat.png -f chat.png
pachctl create pipeline -f contours.json
pachctl list job ; pachctl list commit images@master
pachctl get file contours@master:/chat.png > resultat.png
```

```json contours.json
{
  "pipeline": { "name": "contours" },
  "input": { "pfs": { "repo": "images", "glob": "/*" } },
  "transform": { "image": "registre.exemple.fr/contours:1.0", "cmd": ["python3", "/contours.py"] }
}
```

> [!NOTE]
> Pachyderm a été racheté par Hewlett Packard Enterprise (2023) ; l'édition communauté reste disponible mais l'avenir du projet est à vérifier avant un nouveau déploiement.

## Choisir

| Critère | DVC | Pachyderm | [[04-lac-donnees/02-nessie-lakefs\|lakeFS]] |
| --- | --- | --- | --- |
| Infrastructure | Aucune (Git + stockage) | Grappe Kubernetes | Serveur passerelle S3 |
| Unité | Projet Git | Dépôts de données | Dépôt sur stockage objet |
| Pipelines | `dvc.yaml`, déclenchés à la main ou en CI | Automatiques, déclenchés par les données | Non (hooks) |
| Public | Data scientists, petites équipes | Plates-formes de données à grande échelle | Équipes data sur S3 |

Voir aussi : [[01-jupyterhub|JupyterHub]] · [[02-mlflow|MLflow]]. Commandes : [[90-aide-memoire|aide-mémoire]].
