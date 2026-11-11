---
title: llama.cpp, KoboldCpp et LocalAI — aide-mémoire
description: Ports et commandes de llama.cpp (llama-cli -hf, llama-server, llama-bench, llama-quantize, conversion), KoboldCpp (options GPU et contexte) et LocalAI (Docker, models install, appel de l'API OpenAI).
tags: [aide-mémoire, llama.cpp, koboldcpp, localai, gguf, llm]
icon: terminal
---

Explications : [[01-llama-cpp|llama.cpp]] · [[02-koboldcpp-localai|KoboldCpp et LocalAI]].

| Outil | Port | API |
| --- | --- | --- |
| llama-server | 8080 | OpenAI (`/v1/…`), `/health`, interface web |
| KoboldCpp | 5001 | OpenAI, Kobold, interface KoboldAI Lite |
| LocalAI | 8080 | OpenAI (texte, plongements, images, audio) |
| Ollama (rappel) | 11434 | Ollama et OpenAI |

```bash
# llama.cpp
llama-cli -hf ggml-org/gemma-3-4b-it-GGUF:Q4_K_M
llama-server -m modele.gguf --host 127.0.0.1 --port 8080 -ngl 99 -c 16384 --parallel 4 --api-key "$CLE"
llama-bench -m modele.gguf -ngl 99
python3 convert_hf_to_gguf.py /chemin/modele-hf --outfile modele-f16.gguf --outtype f16
llama-quantize modele-f16.gguf modele-Q4_K_M.gguf Q4_K_M

# KoboldCpp
./koboldcpp --model modele.gguf --usecuda --gpulayers 99 --contextsize 8192 --port 5001

# LocalAI
docker run -d -p 8080:8080 -v /srv/localai/models:/models -e API_KEY="$CLE" localai/localai:latest
docker exec -it localai local-ai models list

# Appel générique d'une API compatible OpenAI
curl http://127.0.0.1:8080/v1/chat/completions -H "Authorization: Bearer $CLE" -H 'Content-Type: application/json' \
  -d '{"model":"assistant","messages":[{"role":"user","content":"Bonjour"}]}'

# GPU
nvidia-smi ; watch -n1 nvidia-smi ; rocm-smi
```
