---
title: KoboldCpp et LocalAI
description: KoboldCpp (exécutable unique basé sur llama.cpp : interface KoboldAI Lite, API Kobold et OpenAI, port 5001, options GPU CUDA et Vulkan, contexte, génération d'images et transcription intégrées, fichiers .kcpps) et LocalAI (API compatible OpenAI auto-hébergée multi-moteurs : texte, plongements, images, transcription, synthèse vocale ; images Docker CPU et GPU, galerie de modèles, fichiers YAML de modèle, clés d'API, port 8080) ; comparaison avec Ollama.
tags: [koboldcpp, localai, llm, api openai, inférence locale, gguf, docker]
icon: cpu
---

## KoboldCpp

**KoboldCpp** (AGPL) emballe **llama.cpp** dans un **exécutable unique** avec une interface web (KoboldAI Lite) orientée écriture et jeu de rôle, mais aussi une API compatible **OpenAI**. Aucune installation : on télécharge le binaire adapté (CUDA, sans CUDA, macOS…) et on le lance.

```bash
# Linux
wget https://github.com/LostRuins/koboldcpp/releases/latest/download/koboldcpp-linux-x64 -O koboldcpp
chmod +x koboldcpp
./koboldcpp --model /srv/modeles/modele-Q4_K_M.gguf --usecuda --gpulayers 99 \
  --contextsize 8192 --host 127.0.0.1 --port 5001
# Windows : koboldcpp.exe (lancé sans argument, il ouvre une fenêtre de configuration)
```

| Accès | Adresse |
| --- | --- |
| Interface KoboldAI Lite | `http://127.0.0.1:5001` |
| API OpenAI | `http://127.0.0.1:5001/v1/chat/completions` |
| API Kobold | `http://127.0.0.1:5001/api/v1/generate` |

- Options GPU : `--usecuda`, `--usevulkan` (AMD, Intel), `--gpulayers N`.
- Fonctions intégrées optionnelles : génération d'images (modèle Stable Diffusion `--sdmodel`), transcription Whisper (`--whispermodel`), synthèse vocale.
- Les réglages s'enregistrent dans un fichier `.kcpps` réutilisable (`--config profil.kcpps`).
- `--password` protège l'API ; ne pas exposer le port sans proxy authentifié.

## LocalAI

**LocalAI** (MIT) est un **serveur d'API compatible OpenAI** auto-hébergé, qui orchestre plusieurs moteurs (llama.cpp, vLLM, transformers, whisper.cpp, Stable Diffusion, Piper…). Une application qui sait parler à l'API OpenAI peut ainsi utiliser des modèles locaux en changeant seulement l'URL.

| Point d'accès | Fonction |
| --- | --- |
| `/v1/chat/completions` | Dialogue |
| `/v1/embeddings` | Plongements (RAG) |
| `/v1/images/generations` | Images |
| `/v1/audio/transcriptions` | Transcription (Whisper) |
| `/v1/audio/speech` | Synthèse vocale |

```bash
# CPU
docker run -d --name localai -p 8080:8080 -v /srv/localai/models:/models \
  -e API_KEY="$LOCALAI_CLE" localai/localai:latest
# GPU NVIDIA : étiquette d'image « …-gpu-nvidia-cuda-12 » et --gpus all (voir la documentation du projet)

# Installer un modèle depuis la galerie, puis l'utiliser
docker exec -it localai local-ai models list
docker exec -it localai local-ai models install <nom-du-modele>
curl http://localhost:8080/v1/chat/completions -H "Authorization: Bearer $LOCALAI_CLE" \
  -H 'Content-Type: application/json' \
  -d '{"model":"<nom-du-modele>","messages":[{"role":"user","content":"Bonjour"}]}'
```

Un modèle personnalisé se décrit dans un fichier YAML du dossier des modèles :

```yaml /srv/localai/models/assistant.yaml
name: assistant
backend: llama-cpp
parameters:
  model: qwen-7b-instruct-Q4_K_M.gguf
  temperature: 0.3
context_size: 16384
gpu_layers: 99
```

L'interface web de LocalAI (même port) permet aussi de parcourir la galerie et de tester les modèles.

## Lequel choisir ?

| Besoin | Outil |
| --- | --- |
| Le plus simple pour un serveur ou un poste, avec catalogue de modèles | [[21-outils/05-ia-productivite/04-ollama-open-webui\|Ollama]] |
| Contrôle fin, performances, dernières fonctions | [[01-llama-cpp\|llama.cpp]] |
| Exécutable unique sans installation, écriture créative | KoboldCpp |
| Une seule API OpenAI pour texte, images, voix | LocalAI |
| Production multi-utilisateurs sur GPU de centre de données | [[02-serveurs-inference/01-vllm-tgi\|vLLM ou TGI]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
