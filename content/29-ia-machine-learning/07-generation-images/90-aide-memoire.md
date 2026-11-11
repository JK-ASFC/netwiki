---
title: Génération d'images — aide-mémoire
description: Ports, dossiers de modèles et commandes de ComfyUI (main.py, API prompt et queue), AUTOMATIC1111 (webui.sh, arguments, API txt2img), InvokeAI (Docker, invokeai.yaml) et Fooocus (entry_with_update.py).
tags: [aide-mémoire, comfyui, automatic1111, invokeai, fooocus, stable diffusion]
icon: terminal
---

Explications : [[01-comfyui|ComfyUI]] · [[02-automatic1111-invokeai-fooocus|AUTOMATIC1111, InvokeAI et Fooocus]].

| Interface | Port | Modèles |
| --- | --- | --- |
| ComfyUI | 8188 | `models/checkpoints`, `loras`, `vae`, `controlnet` |
| AUTOMATIC1111 / Forge | 7860 | `models/Stable-diffusion`, `models/Lora` |
| InvokeAI | 9090 | Gestionnaire de modèles (dossier `models` de la racine Invoke) |
| Fooocus | 7865 | `models/checkpoints`, `models/loras` |

```bash
# ComfyUI
python3 main.py --listen 127.0.0.1 --port 8188 --lowvram
curl -X POST http://127.0.0.1:8188/prompt -H 'Content-Type: application/json' -d "{\"prompt\": $(cat workflow_api.json)}"
curl http://127.0.0.1:8188/queue

# AUTOMATIC1111
./webui.sh --api --xformers --medvram --gradio-auth admin:'…'
curl -s -X POST http://127.0.0.1:7860/sdapi/v1/txt2img -H 'Content-Type: application/json' \
  -d '{"prompt":"…","steps":25}' | jq -r '.images[0]' | base64 -d > image.png

# InvokeAI
docker run -d --gpus all -p 9090:9090 -v /srv/invokeai:/invokeai ghcr.io/invoke-ai/invokeai

# Fooocus
python3 entry_with_update.py --listen

# Vérifier un fichier de modèle avant usage
sha256sum modele.safetensors
```
