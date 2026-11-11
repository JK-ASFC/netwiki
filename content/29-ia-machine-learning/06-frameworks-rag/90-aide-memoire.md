---
title: RAG — aide-mémoire
description: Paquets Python de LangChain, LlamaIndex, Haystack et quivr-core, modèles de plongement locaux avec Ollama, installation et API de RAGFlow, réglages de découpage et de récupération.
tags: [aide-mémoire, rag, langchain, llamaindex, haystack, ragflow, quivr]
icon: terminal
---

Explications : [[01-langchain-llamaindex-haystack|LangChain, LlamaIndex et Haystack]] · [[02-ragflow-quivr|RAGFlow et Quivr]].

| Réglage | Valeur de départ |
| --- | --- |
| Taille des morceaux | 500–1 000 jetons |
| Chevauchement | 10–20 % |
| Morceaux récupérés (k) | 5–8, puis reclassement vers 3–5 |
| Température du LLM | 0 à 0,3 |
| Plongements (français) | bge-m3, multilingual-e5, nomic-embed-text |

```bash
# Paquets
python3 -m pip install langchain langchain-ollama langchain-community langchain-text-splitters langchain-chroma
python3 -m pip install llama-index llama-index-llms-ollama llama-index-embeddings-ollama
python3 -m pip install haystack-ai ollama-haystack
python3 -m pip install quivr-core

# Modèles locaux
ollama pull nomic-embed-text ; ollama pull bge-m3 ; ollama pull qwen2.5:7b
curl http://localhost:11434/api/embed -d '{"model":"nomic-embed-text","input":"test"}'

# RAGFlow
sudo sysctl -w vm.max_map_count=262144
cd ragflow/docker && docker compose -f docker-compose.yml up -d && docker logs -f ragflow-server
curl -X POST http://serveur/api/v1/chats/<id>/completions -H "Authorization: Bearer ragflow-…" \
  -H 'Content-Type: application/json' -d '{"question":"…","stream":false}'
```
