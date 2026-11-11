---
title: vLLM et Text Generation Inference (TGI)
description: Serveurs d'inférence de LLM pour la production — vLLM (PagedAttention, traitement par lots continu, API compatible OpenAI, vllm serve, parallélisme tenseur et pipeline, quantification AWQ, GPTQ, FP8, cache de préfixe, LoRA, métriques Prometheus, Docker et Kubernetes, port 8000) et Hugging Face Text Generation Inference (TGI : image Docker, text-generation-launcher, Messages API, port 80, mode maintenance) ; dimensionnement GPU, jeton Hugging Face, sécurité et choix.
tags: [vllm, tgi, text generation inference, hugging face, llm, inférence, gpu, api openai, production]
icon: server
---

Pour servir un LLM à **de nombreux utilisateurs simultanés**, les moteurs de poste (Ollama, llama.cpp) atteignent vite leurs limites. **vLLM** et **TGI** sont conçus pour les **GPU de centre de données** : ils regroupent dynamiquement les requêtes (*continuous batching*) et gèrent finement la mémoire du cache KV, ce qui multiplie le débit.

## vLLM

**vLLM** (Apache 2.0) est devenu la référence libre. Son algorithme **PagedAttention** découpe le cache KV en pages, comme la mémoire virtuelle, pour servir plus de requêtes avec la même mémoire.

```bash
# Linux + GPU NVIDIA (CUDA) ; ROCm, TPU, CPU et autres via des variantes
python3 -m venv /opt/vllm && /opt/vllm/bin/pip install vllm
export HF_TOKEN=…                       # pour les modèles soumis à acceptation de licence
/opt/vllm/bin/vllm serve Qwen/Qwen2.5-7B-Instruct \
  --host 127.0.0.1 --port 8000 \
  --max-model-len 16384 --gpu-memory-utilization 0.90 \
  --api-key "$VLLM_CLE"

# Docker
docker run -d --gpus all --ipc=host -p 8000:8000 \
  -v /srv/hf-cache:/root/.cache/huggingface -e HF_TOKEN \
  vllm/vllm-openai:latest --model Qwen/Qwen2.5-7B-Instruct --api-key "$VLLM_CLE"
```

| Option | Effet |
| --- | --- |
| `--tensor-parallel-size N` | Répartit le modèle sur N GPU d'un même serveur |
| `--pipeline-parallel-size N` | Répartit les couches sur plusieurs serveurs |
| `--max-model-len` | Contexte maximal (réduit la mémoire réservée) |
| `--gpu-memory-utilization` | Part de la mémoire GPU utilisée (0,9 par défaut) |
| `--quantization` | `awq`, `gptq`, `fp8`… (souvent détecté automatiquement) |
| `--enable-prefix-caching` | Réutilise le calcul des débuts d'invite communs |
| `--enable-lora --lora-modules nom=chemin` | Sert des adaptateurs LoRA |
| `--served-model-name` | Nom présenté aux clients |

```bash
curl http://127.0.0.1:8000/v1/models -H "Authorization: Bearer $VLLM_CLE"
curl http://127.0.0.1:8000/v1/chat/completions -H "Authorization: Bearer $VLLM_CLE" -H 'Content-Type: application/json' \
  -d '{"model":"Qwen/Qwen2.5-7B-Instruct","messages":[{"role":"user","content":"Résume RFC 1918."}],"max_tokens":200}'
curl -s http://127.0.0.1:8000/metrics | grep -E 'vllm:num_requests_(running|waiting)|vllm:gpu_cache_usage'
```

Sur Kubernetes : la pile **vLLM production-stack** ou **KServe** (voir [[10-mlops-serving/01-bentoml-kserve-seldon|BentoML, KServe et Seldon]]) ajoutent routage, mise à l'échelle et cache distribué.

## Text Generation Inference (TGI)

**TGI** (Apache 2.0) est le serveur de Hugging Face (utilisé par ses points de terminaison d'inférence). Il est fourni sous forme d'**image Docker** ; on le rencontre sous les deux noms « Text Generation Inference » et « Hugging Face TGI ».

```bash
docker run -d --gpus all --shm-size 1g -p 8080:80 \
  -v /srv/tgi-data:/data -e HF_TOKEN \
  ghcr.io/huggingface/text-generation-inference:latest \
  --model-id mistralai/Mistral-7B-Instruct-v0.3 \
  --max-input-tokens 8000 --max-total-tokens 12000 --quantize bitsandbytes-nf4

curl http://127.0.0.1:8080/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"model":"tgi","messages":[{"role":"user","content":"Bonjour"}],"max_tokens":100}'
curl http://127.0.0.1:8080/health ; curl http://127.0.0.1:8080/info
```

- Le binaire interne s'appelle `text-generation-launcher` (`--help` liste toutes les options : `--num-shard` pour plusieurs GPU, `--quantize`, `--max-batch-prefill-tokens`…).
- Métriques Prometheus sur `/metrics`, traces OpenTelemetry.

> [!NOTE]
> Hugging Face a placé TGI en **mode maintenance** et oriente désormais vers vLLM ou SGLang pour les nouveaux déploiements. TGI reste pertinent pour les installations existantes.

## Dimensionnement

| Modèle | Mémoire des poids (FP16) | Exemple de GPU |
| --- | --- | --- |
| 7–8 B | ~16 Go | 1 × 24 Go (L4, RTX 4090) |
| 13–14 B | ~28 Go | 1 × 40–48 Go (A100 40, L40S) |
| 32–34 B | ~68 Go | 1 × 80 Go ou 2 × 48 Go |
| 70 B | ~140 Go | 2 × 80 Go (H100) ou quantification |

Prévoir en plus le cache KV, proportionnel au contexte et au nombre de requêtes simultanées. La quantification (AWQ, FP8) divise environ par deux ou quatre la mémoire des poids.

## Sécurité

- Exposer l'API derrière une passerelle (proxy HTTPS, authentification, quotas par utilisateur) ; une clé partagée ne suffit pas pour plusieurs équipes. Une passerelle comme LiteLLM peut centraliser clés, quotas et journalisation.
- Journaliser sans conserver le contenu des invites sensibles, ou en le chiffrant.
- Le jeton `HF_TOKEN` donne accès au compte Hugging Face : le stocker en secret, en lecture seule.

Voir aussi : [[02-transformers|Hugging Face Transformers]] · [[01-inference-locale/01-llama-cpp|llama.cpp]]. Commandes : [[90-aide-memoire|aide-mémoire]].
