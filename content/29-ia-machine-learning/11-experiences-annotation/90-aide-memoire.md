---
title: ClearML, Aim, Label Studio, CVAT et FiftyOne — aide-mémoire
description: Ports et commandes de ClearML (serveur, clearml-init, clearml-agent, clearml-data), Aim (init, up, server), Label Studio (start, Docker), CVAT (docker compose, createsuperuser, Nuclio) et FiftyOne (application).
tags: [aide-mémoire, clearml, aim, label studio, cvat, fiftyone]
icon: terminal
---

Explications : [[01-clearml-aim|ClearML et Aim]] · [[02-label-studio-cvat-fiftyone|Label Studio, CVAT et FiftyOne]].

| Outil | Ports |
| --- | --- |
| ClearML | 8080 interface, 8008 API, 8081 fichiers |
| Aim | 43800 interface, 53800 serveur de suivi |
| Label Studio | 8080 |
| CVAT | 8080 |
| FiftyOne | 5151 |

```bash
# ClearML
cd /opt/clearml && docker compose up -d
clearml-init
clearml-agent daemon --queue gpu --docker --detached ; clearml-agent list
clearml-data create --project P --name N ; clearml-data add --files dossier/ ; clearml-data close
clearml-data list --project P

# Aim
aim init ; aim up --host 127.0.0.1 --port 43800 ; aim server --repo /srv/aim --port 53800

# Label Studio
label-studio start --port 8080
label-studio reset_password --username admin@exemple.fr

# CVAT
docker compose up -d ; docker exec -it cvat_server bash -ic 'python3 ~/manage.py createsuperuser'

# FiftyOne
python3 -c "import fiftyone as fo; fo.launch_app(fo.load_dataset('cameras'), address='127.0.0.1', port=5151).wait()"
```

| Format d'export | Utilisé par |
| --- | --- |
| COCO (JSON) | Detectron2, MMDetection, la plupart des frameworks |
| YOLO (TXT) | Ultralytics YOLO |
| Pascal VOC (XML) | Outils historiques |
| JSON / CSV Label Studio | Textes, classification, NER |
