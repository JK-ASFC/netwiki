---
title: llama.cpp
description: llama.cpp, moteur d'inférence de LLM en C/C++ (MIT) — format GGUF et quantification (Q4_K_M, Q5_K_M, Q8_0), accélération CUDA, ROCm/HIP, Vulkan, Metal et SYCL, compilation CMake et binaires, llama-cli, llama-server (API compatible OpenAI, interface web, port 8080), téléchargement depuis Hugging Face, déchargement de couches sur GPU, taille de contexte, cache KV, requêtes parallèles, conversion et quantification de modèles, service systemd et sécurité.
tags: [llama.cpp, llm, gguf, quantification, inférence, cuda, vulkan, metal, api openai]
icon: cpu
---

**llama.cpp** exécute des modèles de langage ouverts (Llama, Mistral, Qwen, Gemma, DeepSeek, Phi…) avec très peu de dépendances, sur **CPU** comme sur **GPU** (NVIDIA, AMD, Intel, Apple). C'est le moteur sur lequel reposent Ollama, LM Studio, KoboldCpp, GPT4All et Jan. Il introduit le format de fichier **GGUF**.

## GGUF et quantification

Un modèle GGUF est un **fichier unique** contenant les poids et les métadonnées (gabarit de dialogue, vocabulaire). La **quantification** réduit la précision des poids pour diminuer la mémoire nécessaire.

| Quantification | Bits par poids (env.) | Qualité | Mémoire d'un modèle 8 B |
| --- | --- | --- | --- |
| `Q8_0` | 8,5 | Quasi identique à l'original | ~8,5 Go |
| `Q6_K` | 6,6 | Très bonne | ~6,6 Go |
| `Q5_K_M` | 5,7 | Très bonne | ~5,7 Go |
| `Q4_K_M` | 4,8 | Bon compromis (le plus courant) | ~4,9 Go |
| `Q3_K_M`, `IQ3`… | 3–4 | Dégradation visible | ~4 Go |

Ajouter la mémoire du **contexte** (cache KV), qui croît avec la longueur de contexte et le nombre de requêtes simultanées.

## Installation

```bash
# Binaires précompilés : page des versions GitHub (CPU, CUDA, Vulkan, Metal…)
brew install llama.cpp                       # macOS / Linux
# Windows : archive ZIP des versions GitHub (llama-…-bin-win-cuda-…zip ou -vulkan-…)

# Compilation
git clone https://github.com/ggml-org/llama.cpp && cd llama.cpp
cmake -B build -DGGML_CUDA=ON                # ou -DGGML_VULKAN=ON, -DGGML_HIP=ON, (Metal actif par défaut sur macOS)
cmake --build build --config Release -j
ls build/bin/                                # llama-cli, llama-server, llama-quantize, llama-bench…

# Image Docker (serveur, CUDA)
docker run --gpus all -p 8080:8080 -v /srv/modeles:/models ghcr.io/ggml-org/llama.cpp:server-cuda \
  -m /models/modele-Q4_K_M.gguf --host 0.0.0.0 --port 8080 -ngl 99
```

## Utilisation

```bash
# Télécharger depuis Hugging Face et discuter (dépôt:quantification)
llama-cli -hf ggml-org/gemma-3-4b-it-GGUF:Q4_K_M

# Serveur avec API compatible OpenAI et interface web
llama-server -m /srv/modeles/qwen-7b-instruct-Q4_K_M.gguf \
  --host 127.0.0.1 --port 8080 \
  -ngl 99 -c 16384 --parallel 4 --api-key "$LLAMA_CLE"

curl http://127.0.0.1:8080/v1/chat/completions -H "Authorization: Bearer $LLAMA_CLE" \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Explique OSPF en trois phrases."}]}'
curl http://127.0.0.1:8080/health

llama-bench -m modele.gguf -ngl 99          # mesure de débit (jetons par seconde)
```

| Option | Effet |
| --- | --- |
| `-ngl N` | Nombre de couches déchargées sur le GPU (`99` = toutes) |
| `-c N` | Taille du contexte (en jetons), partagée entre les requêtes parallèles |
| `--parallel N` | Nombre de requêtes servies simultanément |
| `-t N` | Fils d'exécution CPU |
| `-fa` | *Flash attention* (moins de mémoire, plus rapide selon le matériel) |
| `--embeddings` | Expose `/v1/embeddings` pour un modèle de plongement (RAG) |

Si le modèle ne tient pas entièrement en mémoire vidéo, baisser `-ngl` : le reste s'exécute sur le CPU (plus lent).

## Convertir et quantifier

```bash
python3 -m pip install -r requirements.txt
python3 convert_hf_to_gguf.py /srv/hf/Mon-Modele --outfile mon-modele-f16.gguf --outtype f16
build/bin/llama-quantize mon-modele-f16.gguf mon-modele-Q4_K_M.gguf Q4_K_M
```

## Service et sécurité

```ini /etc/systemd/system/llama-server.service
[Unit]
Description=llama.cpp server
After=network-online.target

[Service]
User=llama
EnvironmentFile=/etc/llama/env
ExecStart=/usr/local/bin/llama-server -m /srv/modeles/modele.gguf --host 127.0.0.1 --port 8080 -ngl 99 -c 16384 --parallel 4 --api-key ${LLAMA_CLE}
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

- Écouter sur `127.0.0.1` et publier derrière un proxy HTTPS avec authentification ; `--api-key` seul ne remplace pas un contrôle d'accès.
- Ne télécharger que des modèles de sources fiables et respecter leur **licence** (certaines interdisent des usages commerciaux ou imposent des conditions).

Voir aussi : [[02-koboldcpp-localai|KoboldCpp et LocalAI]] · [[21-outils/05-ia-productivite/04-ollama-open-webui|Ollama et Open WebUI]] · [[02-serveurs-inference/01-vllm-tgi|vLLM et TGI]]. Commandes : [[90-aide-memoire|aide-mémoire]].
