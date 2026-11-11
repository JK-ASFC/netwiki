---
title: Dify
description: Dify, plate-forme de développement d'applications LLM — types d'applications (chatbot, agent, workflow, chatflow, génération de texte), base de connaissances RAG, fournisseurs de modèles (Ollama, vLLM, LocalAI, OpenAI-compatible), outils et plugins, journaux et annotations, API et intégration web ; installation Docker Compose (api, worker, web, PostgreSQL, Redis, base vectorielle Weaviate ou autres, sandbox, nginx), fichier .env, compte administrateur, mises à jour, licence et sécurité.
tags: [dify, llm, rag, agents, workflow, low-code, docker compose, applications ia]
icon: blocks
---

**Dify** permet de concevoir des applications IA dans une interface web : assistants conversationnels, agents avec outils, **workflows** visuels et bases de connaissances (RAG), puis de les publier en page web, widget ou **API**. Il convient aux équipes qui veulent industrialiser des usages sans tout développer.

> [!NOTE]
> Dify est publié sous une licence **dérivée d'Apache 2.0** avec des conditions supplémentaires (notamment sur l'exploitation multi-locataires en service et le retrait du logo). Lire la licence avant un usage commercial.

## Types d'applications

| Type | Usage |
| --- | --- |
| Chatbot | Assistant conversationnel avec invite système et connaissances |
| Agent | Le modèle choisit et appelle des outils (recherche, API, calcul) |
| **Workflow** | Graphe d'étapes (LLM, code, condition, requête HTTP, extraction) exécuté en lot ou via API |
| Chatflow | Workflow conversationnel avec mémoire |
| Génération de texte | Formulaire → texte (résumé, traduction, rédaction) |

## Installation

```bash
git clone https://github.com/langgenius/dify.git --branch "$(curl -s https://api.github.com/repos/langgenius/dify/releases/latest | jq -r .tag_name)"
cd dify/docker
cp .env.example .env              # modifier SECRET_KEY, mots de passe de la base et de Redis, domaine
docker compose up -d
docker compose ps
# Interface : http://serveur/install pour créer le compte administrateur
```

| Service | Rôle |
| --- | --- |
| `api`, `worker` | Backend Python, tâches asynchrones (indexation) |
| `web` | Interface Next.js |
| `db` (PostgreSQL), `redis` | Données, files |
| `weaviate` | Base vectorielle par défaut (Qdrant, Milvus, PGVector… via `VECTOR_STORE`) |
| `sandbox` | Exécution isolée du code des workflows |
| `ssrf_proxy` | Filtre les requêtes sortantes des outils |
| `nginx` | Point d'entrée HTTP/HTTPS (ports 80/443) |

Mise à jour : `git checkout <nouvelle-version>`, comparer `.env.example` avec votre `.env`, puis `docker compose down && docker compose pull && docker compose up -d` (les migrations s'appliquent au démarrage). Sauvegarder `volumes/` et la base avant.

## Modèles locaux

Dans **Réglages → Fournisseurs de modèles** : ajouter **Ollama** (`http://ollama:11434` ou `http://host.docker.internal:11434`), **LocalAI**, **Xinference** ou un fournisseur **OpenAI-API-compatible** (vLLM, llama-server) avec son URL et sa clé. Déclarer aussi un modèle de **plongement** et, si possible, de **reclassement** (*rerank*) pour la base de connaissances.

## Base de connaissances

1. Importer des documents (PDF, Word, Markdown, pages web, Notion).
2. Choisir le découpage (taille des morceaux, chevauchement, mode parent-enfant).
3. Indexation « haute qualité » (plongements) et recherche hybride (vecteur + mots-clés) avec reclassement.
4. Tester la récupération (*retrieval testing*) avant de relier la base à une application.

## Publication et API

```bash
curl -X POST https://dify.exemple.fr/v1/chat-messages \
  -H "Authorization: Bearer app-XXXXXXXX" -H 'Content-Type: application/json' \
  -d '{"inputs":{},"query":"Quelle est la procédure de changement de mot de passe ?","response_mode":"blocking","user":"alice"}'

curl -X POST https://dify.exemple.fr/v1/workflows/run \
  -H "Authorization: Bearer app-YYYYYYYY" -H 'Content-Type: application/json' \
  -d '{"inputs":{"ticket":"Imprimante du 2e étage hors ligne"},"response_mode":"blocking","user":"helpdesk"}'
```

Chaque application a sa clé (`app-…`) ; les **journaux** conservent questions, réponses et coûts, et les **annotations** permettent de fixer des réponses de référence.

## Sécurité

- HTTPS sur le nginx fourni (certificats dans `nginx/ssl`) ou derrière votre proxy ; modifier tous les mots de passe par défaut du `.env`.
- Conserver le `sandbox` et le `ssrf_proxy` : ils empêchent le code et les outils d'atteindre le réseau interne sans contrôle.
- Gérer les membres par espace de travail ; l'authentification unique (SSO) relève de l'édition Enterprise.

Voir aussi : [[02-flowise-langflow|Flowise et Langflow]] · [[06-frameworks-rag/01-langchain-llamaindex-haystack|LangChain, LlamaIndex et Haystack]]. Commandes : [[90-aide-memoire|aide-mémoire]].
