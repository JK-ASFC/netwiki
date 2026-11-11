---
title: PyTorch, TensorFlow et JAX
description: Les trois grands frameworks d'apprentissage profond — préparer un poste ou serveur GPU (pilote NVIDIA, CUDA, cuDNN, ROCm pour AMD, MPS sur Apple Silicon, conteneurs NVIDIA), PyTorch (installation par variante CUDA, tenseurs, entraînement, torch.compile, DataLoader, torchrun et DDP, sauvegarde), TensorFlow et Keras (tensorflow[and-cuda], tf.data, SavedModel, TensorBoard), JAX (jit, grad, vmap, Flax) ; vérifications, gestion de la mémoire GPU et choix.
tags: [pytorch, tensorflow, keras, jax, deep learning, gpu, cuda, rocm, python]
icon: brain
---

## Préparer le GPU

| Matériel | Pile logicielle |
| --- | --- |
| NVIDIA | Pilote propriétaire + bibliothèques **CUDA** et **cuDNN** (fournies par les paquets pip de PyTorch et TensorFlow : seul le pilote est à installer sur le système) |
| AMD | **ROCm** (cartes Instinct et Radeon prises en charge, Linux) |
| Apple Silicon | **MPS** (Metal) pour PyTorch, `tensorflow-metal`, JAX expérimental |
| Intel | Extensions XPU / oneAPI |

```bash
# Ubuntu : pilote NVIDIA
sudo ubuntu-drivers install ; sudo reboot
nvidia-smi                                     # version du pilote et version CUDA maximale prise en charge

# Conteneurs avec GPU
sudo apt install nvidia-container-toolkit && sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker
docker run --rm --gpus all nvidia/cuda:12.6.3-base-ubuntu24.04 nvidia-smi
```

Travailler dans un **environnement virtuel** par projet (`python3 -m venv`, `uv`, conda) : les versions des frameworks et de CUDA doivent être cohérentes.

## PyTorch

Le framework le plus utilisé en recherche et pour les LLM (Transformers, vLLM s'appuient dessus). Licence BSD.

```bash
# Choisir la commande sur pytorch.org selon le système et la version CUDA / ROCm
python3 -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu126
python3 -m pip install torch torchvision                       # CPU ou macOS (MPS inclus)
python3 -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0) if torch.cuda.is_available() else '-')"
```

```python
import torch, torch.nn as nn

appareil = "cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
modele = nn.Sequential(nn.Linear(20, 64), nn.ReLU(), nn.Linear(64, 2)).to(appareil)
optim = torch.optim.AdamW(modele.parameters(), lr=1e-3)
perte_fn = nn.CrossEntropyLoss()

for x, y in chargeur:                       # torch.utils.data.DataLoader
    x, y = x.to(appareil), y.to(appareil)
    optim.zero_grad()
    perte = perte_fn(modele(x), y)
    perte.backward()
    optim.step()

torch.save(modele.state_dict(), "modele.pt")
modele = torch.compile(modele)              # accélère l'exécution (PyTorch 2.x)
```

- Plusieurs GPU : `torchrun --nproc_per_node=4 entrainement.py` avec **DDP** (`DistributedDataParallel`) ; FSDP pour les très gros modèles.
- Précision mixte : `torch.autocast("cuda", dtype=torch.bfloat16)` divise la mémoire et accélère sur les GPU récents.
- Mémoire : `torch.cuda.memory_summary()`, `torch.cuda.empty_cache()` ; l'erreur `CUDA out of memory` se résout en réduisant la taille de lot ou avec l'accumulation de gradients.

## TensorFlow et Keras

Framework de Google (Apache 2.0), très présent en production et sur mobile (TensorFlow Lite / LiteRT). **Keras 3** est l'API haut niveau, capable de fonctionner aussi sur PyTorch ou JAX.

```bash
python3 -m pip install "tensorflow[and-cuda]"       # Linux avec GPU NVIDIA ; « tensorflow » seul pour le CPU
python3 -c "import tensorflow as tf; print(tf.__version__, tf.config.list_physical_devices('GPU'))"
```

```python
import keras
modele = keras.Sequential([keras.Input((20,)), keras.layers.Dense(64, activation="relu"), keras.layers.Dense(2)])
modele.compile(optimizer="adam", loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=["accuracy"])
modele.fit(x_train, y_train, epochs=10, validation_split=0.2,
           callbacks=[keras.callbacks.TensorBoard(log_dir="journaux")])
modele.save("modele.keras")
```

```bash
tensorboard --logdir journaux --host 127.0.0.1 --port 6006     # courbes d'entraînement
```

Sous Windows, le GPU n'est plus pris en charge nativement par TensorFlow : passer par **WSL2**. Le service de modèles se fait avec **TensorFlow Serving** (format SavedModel) ou en convertissant vers ONNX.

## JAX

**JAX** (Apache 2.0, Google) combine une API proche de NumPy avec la compilation **XLA** et des transformations de fonctions. Très utilisé en recherche et sur **TPU**.

```bash
python3 -m pip install "jax[cuda12]"        # « jax » seul pour le CPU
python3 -c "import jax; print(jax.devices())"
```

```python
import jax, jax.numpy as jnp

def perte(w, x, y):
    return jnp.mean((x @ w - y) ** 2)

gradient = jax.jit(jax.grad(perte))         # dérivation automatique + compilation
w = jnp.zeros(3)
for _ in range(100):
    w = w - 0.1 * gradient(w, x, y)
lots = jax.vmap(lambda v: v * 2)(jnp.arange(6).reshape(3, 2))   # vectorisation automatique
```

Les réseaux de neurones s'écrivent avec **Flax** (NNX) et les optimiseurs avec **Optax**. JAX réserve par défaut 75 % de la mémoire GPU : `XLA_PYTHON_CLIENT_PREALLOCATE=false` pour partager le GPU.

## Choisir

| Critère | PyTorch | TensorFlow / Keras | JAX |
| --- | --- | --- | --- |
| Usage principal | Recherche, LLM, vision | Production historique, mobile | Recherche, TPU, calcul scientifique |
| Écosystème | Le plus vaste (Hugging Face) | TF Serving, LiteRT, TFX | Flax, Optax, Equinox |
| Windows natif avec GPU | Oui | Non (WSL2) | Non (WSL2) |

Voir aussi : [[02-opencv|OpenCV]] · [[02-serveurs-inference/02-transformers|Hugging Face Transformers]] · [[09-ml-classique-inference/02-onnx-runtime-openvino|ONNX Runtime et OpenVINO]]. Commandes : [[90-aide-memoire|aide-mémoire]].
