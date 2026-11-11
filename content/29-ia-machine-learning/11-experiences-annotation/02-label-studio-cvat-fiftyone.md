---
title: Label Studio, CVAT et FiftyOne
description: Préparer des données d'entraînement — Label Studio (HumanSignal, Apache 2.0 : annotation de textes, images, audio, vidéo, séries temporelles ; configuration XML des interfaces, projets, export JSON, COCO, YOLO, pré-annotation par backend ML, PostgreSQL, port 8080, stockage S3), CVAT (MIT : annotation vision boîtes, polygones, squelettes, suivi vidéo, annotation automatique avec Nuclio, Docker Compose port 8080, superutilisateur, formats d'export) et FiftyOne (Voxel51 : explorer, filtrer et évaluer des jeux d'images, doublons, erreurs d'étiquettes, application port 5151) ; organisation d'une campagne d'annotation.
tags: [label studio, cvat, fiftyone, annotation, étiquetage, vision par ordinateur, jeux de données]
icon: tag
---

La qualité d'un modèle dépend d'abord de celle de ses **données étiquetées**. Ces outils organisent l'annotation par une équipe, contrôlent la qualité et exportent dans les formats attendus par les frameworks.

## Label Studio

**Label Studio** (édition communautaire Apache 2.0) annote **tous types de données** : textes (classification, entités nommées), images, audio (transcription, segments), vidéo, séries temporelles, dialogues pour l'évaluation de LLM.

```bash
python3 -m pip install label-studio && label-studio start --port 8080
# Docker avec PostgreSQL
docker run -d --name label-studio -p 8080:8080 -v /srv/label-studio:/label-studio/data \
  -e DJANGO_DB=default -e POSTGRE_HOST=db -e POSTGRE_NAME=labelstudio -e POSTGRE_USER=ls -e POSTGRE_PASSWORD='…' -e POSTGRE_PORT=5432 \
  heartexlabs/label-studio:latest
```

L'interface d'annotation se décrit en **XML** :

```xml
<View>
  <Text name="ticket" value="$texte"/>
  <Choices name="categorie" toName="ticket" choice="single" showInline="true">
    <Choice value="Réseau"/><Choice value="Poste de travail"/><Choice value="Messagerie"/><Choice value="Accès"/>
  </Choices>
  <Labels name="entites" toName="ticket">
    <Label value="Équipement" background="#f59e0b"/><Label value="Site" background="#3b82f6"/>
  </Labels>
</View>
```

- Import CSV, JSON, fichiers ou **stockage S3/MinIO, GCS, Azure** synchronisé.
- Export JSON, CSV, **COCO**, **YOLO**, Pascal VOC, CoNLL…
- **Backend ML** : un modèle pré-annote les tâches, l'humain corrige (apprentissage actif).
- Inscription : `LABEL_STUDIO_DISABLE_SIGNUP_WITHOUT_LINK=true` pour n'accepter que les invitations.

## CVAT

**CVAT** (MIT) est spécialisé en **vision** : boîtes, polygones, masques, points, **squelettes** (poses), cuboïdes 3D, et **interpolation** des objets entre images d'une vidéo.

```bash
git clone https://github.com/cvat-ai/cvat && cd cvat
export CVAT_HOST=cvat.exemple.fr
docker compose up -d
docker exec -it cvat_server bash -ic 'python3 ~/manage.py createsuperuser'
# Interface : http://serveur:8080
```

- Organisation en **projets**, **tâches** et **lots de travail** (*jobs*) attribués aux annotateurs, avec étapes de validation.
- **Annotation automatique** : modèles (YOLO, SAM, détection de visages) déployés comme fonctions serverless **Nuclio** (`docker compose -f docker-compose.yml -f components/serverless/docker-compose.serverless.yml up -d`).
- Export COCO, YOLO, Pascal VOC, Cityscapes, MOT, Datumaro…

## FiftyOne

**FiftyOne** (Voxel51, Apache 2.0) n'est pas un outil d'annotation mais d'**exploration** : visualiser un jeu d'images et ses étiquettes, filtrer, repérer **doublons**, **erreurs d'étiquetage** et cas difficiles, évaluer les prédictions d'un modèle.

```bash
python3 -m pip install fiftyone
```

```python
import fiftyone as fo, fiftyone.brain as fob

jeu = fo.Dataset.from_dir("donnees/coco", dataset_type=fo.types.COCODetectionDataset, name="cameras")
fob.compute_uniqueness(jeu)                                   # repère les quasi-doublons
fob.compute_mistakenness(jeu, "predictions", label_field="ground_truth")   # étiquettes suspectes
vue = jeu.sort_by("mistakenness", reverse=True).limit(100)
session = fo.launch_app(vue, address="127.0.0.1", port=5151)
vue.export(export_dir="a-revoir", dataset_type=fo.types.CVATImageDataset)  # renvoi vers l'annotation
```

## Organiser une campagne d'annotation

1. **Guide d'annotation** écrit, avec exemples et cas limites ; le tester sur 50 éléments.
2. **Double annotation** d'un échantillon pour mesurer l'accord entre annotateurs.
3. **Pré-annotation** par un modèle pour accélérer, toujours revue par un humain.
4. Contrôle qualité avec FiftyOne avant chaque entraînement.
5. **Données personnelles** : minimiser (flouter visages et plaques), restreindre l'accès, tracer qui voit quoi.

Voir aussi : [[01-clearml-aim|ClearML et Aim]] · [[08-frameworks-ml/02-opencv|OpenCV]]. Commandes : [[90-aide-memoire|aide-mémoire]].
