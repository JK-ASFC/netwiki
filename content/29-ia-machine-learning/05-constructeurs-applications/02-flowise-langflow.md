---
title: Flowise et Langflow
description: Constructeurs visuels de flux LLM — Flowise (Node.js, Apache 2.0 : Chatflows et Agentflows, nœuds LangChain et LlamaIndex, npx flowise start, Docker, port 3000, identifiants, base SQLite ou PostgreSQL, variables et identifiants chiffrés, API de prédiction, widget) et Langflow (Python, MIT : composants, flux, Playground, export JSON, API et serveur MCP, uv pip install langflow, Docker, port 7860, authentification LANGFLOW_AUTO_LOGIN, base PostgreSQL) ; sécurité (exécution de code) et comparaison avec Dify.
tags: [flowise, langflow, llm, low-code, agents, rag, langchain, flux visuels]
icon: blocks
---

**Flowise** et **Langflow** assemblent des applications LLM en reliant des **nœuds** sur une toile : modèle, invite, mémoire, chargeur de documents, découpeur, base vectorielle, outil, agent. Le flux devient ensuite une **API**. Ils sont plus proches du code que [[01-dify|Dify]] et conviennent aux développeurs qui prototypent vite.

## Flowise

```bash
npx flowise start                                   # Node.js 18 ou plus ; http://localhost:3000
# Docker
docker run -d --name flowise -p 3000:3000 -v /srv/flowise:/root/.flowise flowiseai/flowise
```

```bash .env
PORT=3000
DATABASE_TYPE=postgres
DATABASE_HOST=db
DATABASE_NAME=flowise
DATABASE_USER=flowise
DATABASE_PASSWORD=…
SECRETKEY_PATH=/root/.flowise
LOG_LEVEL=info
```

- **Chatflows** (chaînes, RAG) et **Agentflows** (agents, multi-agents, boucles, validation humaine).
- **Identifiants** (clés d'API) stockés chiffrés ; **variables** réutilisables dans les flux.
- Au premier accès, création du compte administrateur ; gestion des utilisateurs et espaces de travail selon la version.
- Le **document store** gère ingestion, découpage et mise à jour des bases vectorielles indépendamment des flux.

```bash
curl -X POST http://localhost:3000/api/v1/prediction/<id-du-flux> \
  -H "Authorization: Bearer <clé-api-flowise>" -H 'Content-Type: application/json' \
  -d '{"question":"Comment réinitialiser un mot de passe Active Directory ?"}'
```

Un **widget** JavaScript intègre le chatbot à un site interne.

## Langflow

```bash
uv pip install langflow                # Python 3.10 à 3.13 ; ou pip install langflow
uv run langflow run --host 127.0.0.1 --port 7860
# Docker
docker run -d --name langflow -p 7860:7860 langflowai/langflow:latest
```

```bash .env
LANGFLOW_DATABASE_URL=postgresql://langflow:…@db:5432/langflow
LANGFLOW_CONFIG_DIR=/var/lib/langflow
LANGFLOW_AUTO_LOGIN=false
LANGFLOW_SUPERUSER=admin
LANGFLOW_SUPERUSER_PASSWORD=…
LANGFLOW_SECRET_KEY=<clé aléatoire>
```

- **Composants** Python modifiables directement dans l'interface (on peut écrire son propre composant).
- **Playground** pour tester un flux, export/import en **JSON** (versionnable dans Git).
- Chaque flux est appelable par **API** et peut être exposé comme **outil MCP** à d'autres agents.

```bash
curl -X POST "http://127.0.0.1:7860/api/v1/run/<id-du-flux>" \
  -H "x-api-key: <clé-api-langflow>" -H 'Content-Type: application/json' \
  -d '{"input_value":"Bonjour","input_type":"chat","output_type":"chat"}'
```

## Sécurité

> [!WARNING]
> Ces outils permettent d'**exécuter du code** (nœuds Python ou JavaScript personnalisés) sur le serveur, et des failles critiques permettant l'exécution de code à distance sans authentification ont déjà été corrigées dans les deux projets. Ne **jamais** les exposer sur Internet, tenir la version à jour, activer l'authentification (`LANGFLOW_AUTO_LOGIN=false`, compte Flowise) et les isoler dans un conteneur sans accès au réseau interne superflu.

## Comparatif

| Critère | Dify | Flowise | Langflow |
| --- | --- | --- | --- |
| Langage | Python + Next.js | Node.js (TypeScript) | Python |
| Public | Équipes métier et développeurs | Développeurs JS | Développeurs Python |
| Points forts | Plate-forme complète (journaux, annotations, RAG) | Agentflows, document store, léger | Composants personnalisables, MCP |
| Licence | Apache 2.0 modifiée | Apache 2.0 | MIT |

Commandes : [[90-aide-memoire|aide-mémoire]].
