---
title: GPT4All, Jan, PrivateGPT et Khoj — aide-mémoire
description: Ports des API locales (GPT4All 4891, Jan 1337, PrivateGPT 8001, Khoj 42110), installation et commandes de PrivateGPT (profils, ingestion, chat avec contexte) et de Khoj (Docker Compose).
tags: [aide-mémoire, gpt4all, jan, privategpt, khoj, rag]
icon: terminal
---

Explications : [[01-gpt4all-jan|GPT4All et Jan]] · [[02-privategpt-khoj|PrivateGPT et Khoj]].

| Application | Port local | Remarque |
| --- | --- | --- |
| GPT4All | 4891 | API à activer dans les réglages |
| Jan | 1337 | Serveur local à démarrer, clé d'API |
| LM Studio (rappel) | 1234 | Propriétaire |
| PrivateGPT | 8001 | Interface Gradio et API |
| Khoj | 42110 | Interface, `/server/admin` |

```bash
# GPT4All et Jan
flatpak install flathub io.gpt4all.gpt4all
sudo apt install ./jan_*_amd64.deb
curl http://localhost:4891/v1/models ; curl -H "Authorization: Bearer $CLE" http://127.0.0.1:1337/v1/models

# PrivateGPT
poetry install --extras "ui llms-ollama embeddings-ollama vector-stores-qdrant"
PGPT_PROFILES=ollama make run
curl -F "file=@doc.pdf" http://localhost:8001/v1/ingest/file
curl http://localhost:8001/v1/ingest/list
curl http://localhost:8001/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Question"}],"use_context":true,"include_sources":true}'

# Khoj
cd ~/.khoj && docker compose up -d && docker compose logs -f
```
