---
title: Interfaces de chat — aide-mémoire
description: Ports, fichiers et commandes de LibreChat (Docker Compose, .env, librechat.yaml, gestion des comptes), AnythingLLM (Docker), text-generation-webui (start, --listen, --api, --gradio-auth) et SillyTavern (start.sh, config.yaml, liste blanche).
tags: [aide-mémoire, librechat, anythingllm, text-generation-webui, sillytavern]
icon: terminal
---

Explications : [[01-librechat-anythingllm|LibreChat et AnythingLLM]] · [[02-text-generation-webui-sillytavern|text-generation-webui et SillyTavern]].

| Interface | Port | Configuration |
| --- | --- | --- |
| LibreChat | 3080 | `.env`, `librechat.yaml` |
| AnythingLLM | 3001 | Interface d'administration, `.env` du stockage |
| text-generation-webui | 7860 (interface), 5000 (API) | `user_data/CMD_FLAGS.txt` |
| SillyTavern | 8000 | `config.yaml` |
| Open WebUI (rappel) | 8080 (3000 souvent publié) | Interface d'administration |

```bash
# LibreChat
docker compose up -d ; docker compose logs -f api
docker compose exec api npm run create-user
docker compose exec api npm run list-users

# AnythingLLM
docker run -d -p 3001:3001 --cap-add SYS_ADMIN -v /srv/anythingllm:/app/server/storage \
  -v /srv/anythingllm/.env:/app/server/.env -e STORAGE_DIR=/app/server/storage mintplexlabs/anythingllm

# text-generation-webui
./start_linux.sh --listen --api --gradio-auth admin:'…'

# SillyTavern
./start.sh

# Tester le moteur derrière l'interface
curl -s http://127.0.0.1:11434/api/tags      # Ollama
curl -s http://127.0.0.1:8080/v1/models      # serveur compatible OpenAI
```
