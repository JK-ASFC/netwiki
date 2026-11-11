---
title: ComfyUI
description: ComfyUI, interface de génération d'images par graphe de nœuds (GPL) — notions de diffusion (modèle, VAE, encodeur de texte, échantillonneur, LoRA, ControlNet), matériel requis, installation (version de bureau, portable Windows, manuelle avec PyTorch), arborescence models/, ComfyUI-Manager et nœuds personnalisés, workflows JSON intégrés aux PNG, API et file d'attente, options --listen, --lowvram, port 8188 ; licences des modèles et sécurité des nœuds tiers.
tags: [comfyui, stable diffusion, sdxl, flux, génération d'images, diffusion, gpu, workflow]
icon: image
---

**ComfyUI** construit la génération d'images comme un **graphe** : chaque étape (charger le modèle, encoder le texte, échantillonner, décoder) est un nœud relié aux autres. C'est l'outil le plus souple et souvent le premier à prendre en charge les nouveaux modèles (SDXL, SD 3.5, Flux, vidéo, 3D, audio).

## Notions

| Élément | Rôle |
| --- | --- |
| **Checkpoint** (modèle) | Réseau de diffusion : SD 1.5, SDXL, SD 3.5, Flux… (`.safetensors`) |
| Encodeur de texte (CLIP, T5) | Transforme l'invite en vecteurs |
| **VAE** | Passe de l'espace latent à l'image |
| Échantillonneur et planificateur | Algorithme et nombre d'étapes (20–30 en général), CFG (fidélité à l'invite) |
| **LoRA** | Petit fichier qui ajoute un style, un personnage, un produit |
| **ControlNet** | Contraint la composition (pose, contours, profondeur) |
| Img2img, inpainting | Partir d'une image, ne régénérer qu'une zone |

## Matériel

| Modèle | Mémoire vidéo conseillée |
| --- | --- |
| SD 1.5 | 4–6 Go |
| SDXL | 8–12 Go |
| Flux (versions quantifiées FP8/GGUF) | 12–16 Go, 24 Go pour la pleine précision |

NVIDIA est le mieux pris en charge ; AMD via ROCm (Linux) ou DirectML, Apple Silicon via MPS (plus lent).

## Installation

```bash
# Version de bureau (Windows, macOS) ou archive portable Windows (7z avec Python embarqué) : site du projet
# Installation manuelle (Linux)
git clone https://github.com/comfyanonymous/ComfyUI && cd ComfyUI
python3 -m venv .venv && . .venv/bin/activate
python3 -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
python3 -m pip install -r requirements.txt
python3 main.py --listen 127.0.0.1 --port 8188
# Options : --lowvram, --novram, --cpu, --preview-method auto, --output-directory /srv/comfy/sorties
```

```text
ComfyUI/models/
├── checkpoints/     modèles complets (.safetensors)
├── diffusion_models/  modèles de diffusion seuls (Flux…)
├── text_encoders/   CLIP, T5
├── vae/
├── loras/
├── controlnet/
└── upscale_models/
```

Un fichier `extra_model_paths.yaml` permet de partager les dossiers de modèles avec d'autres interfaces (AUTOMATIC1111, InvokeAI).

## Workflows, nœuds personnalisés et API

- Un **workflow** s'enregistre en JSON et est aussi **intégré dans les PNG** générés : glisser une image dans l'interface recharge le graphe qui l'a produite.
- **ComfyUI-Manager** installe et met à jour les nœuds personnalisés et les modèles manquants d'un workflow.
- L'interface fonctionne par **file d'attente** ; l'API permet d'automatiser :

```bash
# Exporter le workflow au format API (menu Workflow → Export (API)), puis :
curl -X POST http://127.0.0.1:8188/prompt -H 'Content-Type: application/json' -d "{\"prompt\": $(cat workflow_api.json)}"
curl http://127.0.0.1:8188/queue
curl http://127.0.0.1:8188/history | jq 'keys | length'
```

## Sécurité et licences

> [!WARNING]
> Les **nœuds personnalisés** sont du code Python exécuté sans isolation : des nœuds malveillants ont déjà volé des identifiants. N'installer que des nœuds connus et maintenus, de préférence dans un conteneur ou une machine dédiée.

- Ne télécharger que des modèles au format **safetensors** (les `.ckpt` peuvent contenir du code).
- `--listen 0.0.0.0` expose une interface **sans authentification** : passer par un proxy authentifié.
- Respecter les **licences des modèles** (SD 1.5/SDXL : OpenRAIL ; SD 3.5 et Flux : licences spécifiques, certaines non commerciales) et les règles d'usage (pas de deepfakes de personnes réelles, droits d'auteur, mentions « image générée par IA » selon la réglementation).

Voir aussi : [[02-automatic1111-invokeai-fooocus|AUTOMATIC1111, InvokeAI et Fooocus]]. Commandes : [[90-aide-memoire|aide-mémoire]].
