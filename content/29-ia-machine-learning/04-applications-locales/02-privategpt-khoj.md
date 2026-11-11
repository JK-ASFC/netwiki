---
title: PrivateGPT et Khoj
description: PrivateGPT (Zylon, Apache 2.0 : RAG local prêt pour la production, API compatible OpenAI étendue, ingestion de documents, profils settings-*.yaml, moteurs Ollama, llama.cpp ou vLLM, bases vectorielles Qdrant, Chroma, PGVector, interface Gradio port 8001, installation Poetry ou Docker) et Khoj (assistant personnel AGPL : recherche et discussion sur ses notes, PDF, Obsidian, Notion, Emacs ; agents, automatisations planifiées, Docker Compose, port 42110, modèles locaux ou en ligne, comptes) ; comparaison des approches RAG locales.
tags: [privategpt, khoj, rag, llm local, recherche sémantique, assistant personnel, documents]
icon: laptop
---

## PrivateGPT

**PrivateGPT** (Apache 2.0) est un **service RAG** local : on ingère des documents, puis on interroge un LLM qui répond **à partir de ces documents** sans qu'aucune donnée ne sorte. Il expose une **API** (compatible OpenAI, étendue avec ingestion et recherche) et une interface Gradio de test.

| Brique | Options |
| --- | --- |
| LLM | Ollama (le plus simple), llama.cpp, vLLM ou API OpenAI-compatible, services cloud |
| Plongements | Ollama, Hugging Face local, OpenAI… |
| Base vectorielle | Qdrant (par défaut), Chroma, PGVector, ClickHouse |
| Interface | Gradio, port **8001** |

```bash
git clone https://github.com/zylon-ai/private-gpt && cd private-gpt
poetry install --extras "ui llms-ollama embeddings-ollama vector-stores-qdrant"
ollama pull llama3.1:8b && ollama pull nomic-embed-text
PGPT_PROFILES=ollama make run           # charge settings.yaml puis settings-ollama.yaml
# Docker : docker compose --profile ollama-cpu up (profils CPU / CUDA dans le dépôt)
```

```yaml settings-ollama.yaml
llm: { mode: ollama, max_new_tokens: 512, context_window: 8192 }
embedding: { mode: ollama }
ollama:
  llm_model: llama3.1:8b
  embedding_model: nomic-embed-text
  api_base: http://localhost:11434
vectorstore: { database: qdrant }
qdrant: { path: local_data/private_gpt/qdrant }
```

```bash
curl -F "file=@procedure-pra.pdf" http://localhost:8001/v1/ingest/file
curl http://localhost:8001/v1/ingest/list
curl http://localhost:8001/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Quel est le RTO du site de Lyon ?"}],"use_context":true,"include_sources":true}'
```

PrivateGPT n'a **pas de gestion d'utilisateurs** : c'est une brique à placer derrière une application ou un proxy authentifié.

## Khoj

**Khoj** (AGPL) est un **assistant personnel** : il indexe vos notes et documents (Markdown, Org-mode, PDF, Word, Obsidian, Notion, GitHub) et répond en les citant ; il sait aussi chercher sur le web et lancer des **automatisations** planifiées (résumé quotidien, veille).

```bash
mkdir ~/.khoj && cd ~/.khoj
wget https://raw.githubusercontent.com/khoj-ai/khoj/master/docker-compose.yml
# Éditer : KHOJ_ADMIN_EMAIL, KHOJ_ADMIN_PASSWORD, KHOJ_DJANGO_SECRET_KEY, et l'URL d'Ollama ou d'un service compatible OpenAI
docker compose up -d
# Interface : http://localhost:42110 ; administration : http://localhost:42110/server/admin
```

- Clients : navigateur, application de bureau (synchronise des dossiers), greffons **Obsidian** et **Emacs**, WhatsApp.
- Modèles : locaux via Ollama ou llama.cpp (configurés dans l'administration comme « chat model » OpenAI-compatible) ou fournisseurs en ligne.
- **Agents** personnalisés (instructions, outils, base de connaissances propre).
- Mode multi-utilisateurs avec comptes ; un service hébergé existe, mais l'auto-hébergement garde les données chez soi.

## Quelle approche RAG locale ?

| Besoin | Outil |
| --- | --- |
| Poste individuel, dossiers locaux, sans serveur | [[01-gpt4all-jan\|GPT4All LocalDocs]] |
| API RAG à intégrer dans une application interne | PrivateGPT |
| Assistant personnel sur ses notes, avec automatisations | Khoj |
| Base documentaire d'équipe avec interface | [[03-interfaces-chat/01-librechat-anythingllm\|AnythingLLM]], Open WebUI, [[06-frameworks-rag/02-ragflow-quivr\|RAGFlow]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
