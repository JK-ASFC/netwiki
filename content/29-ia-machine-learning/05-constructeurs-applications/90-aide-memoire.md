---
title: Dify, Flowise et Langflow — aide-mémoire
description: Ports, installation, mises à jour et appels d'API de Dify (Docker Compose, chat-messages, workflows/run), Flowise (npx, Docker, prediction) et Langflow (uv, Docker, run).
tags: [aide-mémoire, dify, flowise, langflow]
icon: terminal
---

Explications : [[01-dify|Dify]] · [[02-flowise-langflow|Flowise et Langflow]].

| Outil | Port | Données |
| --- | --- | --- |
| Dify | 80/443 (nginx) | PostgreSQL, Redis, base vectorielle, `docker/volumes/` |
| Flowise | 3000 | `~/.flowise` (SQLite) ou PostgreSQL |
| Langflow | 7860 | `LANGFLOW_CONFIG_DIR` (SQLite) ou PostgreSQL |

```bash
# Dify
cd dify/docker && cp .env.example .env && docker compose up -d
docker compose ps ; docker compose logs -f api worker
docker compose down && git checkout <version> && docker compose pull && docker compose up -d
curl -X POST https://dify/v1/chat-messages -H "Authorization: Bearer app-…" -H 'Content-Type: application/json' \
  -d '{"inputs":{},"query":"…","response_mode":"blocking","user":"u1"}'

# Flowise
npx flowise start
docker run -d -p 3000:3000 -v /srv/flowise:/root/.flowise flowiseai/flowise
curl -X POST http://localhost:3000/api/v1/prediction/<id> -H "Authorization: Bearer <clé>" -H 'Content-Type: application/json' -d '{"question":"…"}'

# Langflow
uv pip install langflow && uv run langflow run --host 127.0.0.1 --port 7860
docker run -d -p 7860:7860 langflowai/langflow:latest
curl -X POST http://127.0.0.1:7860/api/v1/run/<id> -H "x-api-key: <clé>" -H 'Content-Type: application/json' \
  -d '{"input_value":"…","input_type":"chat","output_type":"chat"}'
```
