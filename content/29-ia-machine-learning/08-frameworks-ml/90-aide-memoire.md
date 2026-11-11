---
title: PyTorch, TensorFlow, JAX et OpenCV — aide-mémoire
description: Vérifier le GPU (nvidia-smi, conteneurs), installer et tester PyTorch, TensorFlow, JAX et OpenCV, lancer un entraînement distribué (torchrun) et TensorBoard.
tags: [aide-mémoire, pytorch, tensorflow, jax, opencv, gpu, cuda]
icon: terminal
---

Explications : [[01-pytorch-tensorflow-jax|PyTorch, TensorFlow et JAX]] · [[02-opencv|OpenCV]].

```bash
# GPU
nvidia-smi ; nvidia-smi --query-gpu=name,memory.used,memory.total,utilization.gpu --format=csv -l 2
rocm-smi                                             # AMD
docker run --rm --gpus all nvidia/cuda:12.6.3-base-ubuntu24.04 nvidia-smi

# PyTorch
python3 -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126
python3 -c "import torch; print(torch.cuda.is_available(), torch.cuda.device_count())"
torchrun --nproc_per_node=4 entrainement.py

# TensorFlow
python3 -m pip install "tensorflow[and-cuda]"
python3 -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"
tensorboard --logdir journaux --host 127.0.0.1 --port 6006

# JAX
python3 -m pip install "jax[cuda12]" ; python3 -c "import jax; print(jax.devices())"
export XLA_PYTHON_CLIENT_PREALLOCATE=false

# OpenCV
python3 -m pip install opencv-python-headless
python3 -c "import cv2; print(cv2.__version__)"
export OPENCV_FFMPEG_CAPTURE_OPTIONS="rtsp_transport;tcp"
```

| Erreur fréquente | Piste |
| --- | --- |
| `CUDA out of memory` | Réduire la taille de lot, précision mixte, accumulation de gradients |
| `torch.cuda.is_available()` faux | Variante CPU installée, pilote trop ancien, conteneur sans `--gpus` |
| TensorFlow ne voit pas le GPU sous Windows | Utiliser WSL2 |
| OpenCV `imshow` échoue sur un serveur | Utiliser la variante headless et `imwrite` |
