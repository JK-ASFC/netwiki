---
title: OpenCV
description: OpenCV, bibliothèque de vision par ordinateur (Apache 2.0) — installation (opencv-python, contrib, headless, paquets système, compilation avec CUDA), lecture d'images, de vidéos et de flux RTSP de caméras, traitements (couleurs, flou, seuils, contours, détection de mouvement), module DNN pour exécuter des modèles ONNX (YOLO), QR codes, enregistrement, exemples d'exploitation (vidéosurveillance, lecture de compteurs) et performances.
tags: [opencv, vision par ordinateur, python, rtsp, caméra, détection, dnn, onnx]
icon: scan-eye
---

**OpenCV** est la bibliothèque de référence pour le **traitement d'images et de vidéos** : plus de 2 500 algorithmes, en C++ avec des interfaces Python, Java et JavaScript. Elle sert à lire des caméras IP, détecter du mouvement, lire des QR codes, préparer des images pour un modèle ou exécuter un réseau de neurones.

## Installation

| Paquet pip | Contenu |
| --- | --- |
| `opencv-python` | Modules principaux + interface graphique (`imshow`) |
| `opencv-contrib-python` | + modules supplémentaires (suivi, ArUco étendu, SIFT…) |
| `opencv-python-headless` | Sans interface graphique : **serveurs et conteneurs** |

```bash
python3 -m pip install opencv-python-headless numpy
sudo apt install python3-opencv libopencv-dev          # paquets système (version souvent plus ancienne)
python3 -c "import cv2; print(cv2.__version__); print(cv2.getBuildInformation())" | head -40
```

Le support **CUDA** (module `cv2.cuda`) exige une compilation depuis les sources avec `-DWITH_CUDA=ON` et les modules contrib.

## Images

```python
import cv2

img = cv2.imread("photo.jpg")                         # BGR, et non RGB
gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
flou = cv2.GaussianBlur(gris, (5, 5), 0)
bords = cv2.Canny(flou, 50, 150)
contours, _ = cv2.findContours(bords, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
for c in contours:
    if cv2.contourArea(c) > 500:
        x, y, w, h = cv2.boundingRect(c)
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
cv2.imwrite("resultat.jpg", img)

texte, points, _ = cv2.QRCodeDetector().detectAndDecode(img)   # lecture de QR code
```

## Vidéo et caméras IP

```python
import cv2, time

flux = cv2.VideoCapture("rtsp://lecture:motdepasse@10.0.50.21:554/stream1", cv2.CAP_FFMPEG)
fond = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=32)
while True:
    ok, image = flux.read()
    if not ok:
        time.sleep(2); flux.open("rtsp://…"); continue        # reconnexion
    masque = fond.apply(cv2.resize(image, (640, 360)))
    if cv2.countNonZero(masque) > 5000:
        cv2.imwrite(f"mouvement-{int(time.time())}.jpg", image)
```

- Préférer le **sous-flux** basse résolution de la caméra pour l'analyse, le flux principal pour l'enregistrement.
- Pour TCP plutôt qu'UDP en RTSP : variable `OPENCV_FFMPEG_CAPTURE_OPTIONS="rtsp_transport;tcp"`.
- Ne pas mettre d'identifiants de caméra en clair dans le code : variables d'environnement ou coffre de secrets.

## Module DNN

Le module `cv2.dnn` exécute des réseaux exportés en **ONNX** (détection d'objets YOLO, classification, reconnaissance de visages), sur CPU, OpenCL ou CUDA.

```python
net = cv2.dnn.readNetFromONNX("yolo11n.onnx")
blob = cv2.dnn.blobFromImage(img, 1 / 255.0, (640, 640), swapRB=True)
net.setInput(blob)
sorties = net.forward()            # à décoder selon le format du modèle (boîtes, scores, classes)
```

Pour des performances maximales, [[09-ml-classique-inference/02-onnx-runtime-openvino|ONNX Runtime ou OpenVINO]] sont souvent plus rapides que le module DNN.

## Usages en exploitation

| Cas | Technique |
| --- | --- |
| Détection de mouvement sur caméras | Soustraction de fond, seuil de surface |
| Comptage de personnes ou véhicules | Modèle de détection (YOLO) + suivi |
| Lecture de QR codes ou codes-barres d'inventaire | `QRCodeDetector`, `barcode_BarcodeDetector` |
| Contrôle d'un écran ou d'un voyant | Région d'intérêt + couleur dominante |
| Floutage de visages ou de plaques (RGPD) | Détection puis `GaussianBlur` sur la zone |

Pour une vidéosurveillance complète prête à l'emploi (Frigate, ZoneMinder…), voir les pages dédiées du wiki ; OpenCV sert pour les besoins spécifiques.

Voir aussi : [[01-pytorch-tensorflow-jax|PyTorch, TensorFlow et JAX]] · [[11-experiences-annotation/02-label-studio-cvat-fiftyone|annotation d'images]]. Commandes : [[90-aide-memoire|aide-mémoire]].
