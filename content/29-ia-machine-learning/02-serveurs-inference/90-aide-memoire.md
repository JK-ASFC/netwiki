---
title: vLLM, TGI et Transformers — aide-mémoire
description: Commandes de vLLM (vllm serve, Docker, options de parallélisme et de mémoire, métriques), TGI (Docker, health, info) et de l'écosystème Hugging Face (hf auth, hf download, variables HF_HOME et HF_HUB_OFFLINE).
tags: [aide-mémoire, vllm, tgi, transformers, hugging face]
icon: terminal
---

Explications : [[01-vllm-tgi|vLLM et TGI]] · [[02-transformers|Hugging Face Transformers]].

| Serveur | Port par défaut | Santé / métriques |
| --- | --- | --- |
| vLLM | 8000 | `/health`, `/metrics` |
| TGI | 80 dans le conteneur | `/health`, `/info`, `/metrics` |

```bash
# vLLM
vllm serve ORG/MODELE --host 127.0.0.1 --port 8000 --max-model-len 16384 --api-key "$CLE"
vllm serve ORG/MODELE --tensor-parallel-size 2 --gpu-memory-utilization 0.9 --enable-prefix-caching
docker run -d --gpus all --ipc=host -p 8000:8000 -v /srv/hf-cache:/root/.cache/huggingface -e HF_TOKEN vllm/vllm-openai:latest --model ORG/MODELE
curl -s localhost:8000/v1/models -H "Authorization: Bearer $CLE"
curl -s localhost:8000/metrics | grep vllm:num_requests

# TGI
docker run -d --gpus all --shm-size 1g -p 8080:80 -v /srv/tgi-data:/data -e HF_TOKEN \
  ghcr.io/huggingface/text-generation-inference:latest --model-id ORG/MODELE
curl localhost:8080/health ; curl localhost:8080/info

# Hugging Face
hf auth login ; hf auth whoami
hf download ORG/MODELE --local-dir /srv/modeles/MODELE
export HF_HOME=/srv/hf-cache HF_HUB_OFFLINE=1
python3 -c "import torch; print(torch.cuda.is_available(), torch.cuda.device_count())"
```
