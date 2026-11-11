---
title: LibreChat et AnythingLLM
description: LibreChat (interface de chat multi-fournisseurs MIT : OpenAI, Anthropic, Google, Azure, Ollama, vLLM et tout point d'accès compatible OpenAI ; Docker Compose avec MongoDB, Meilisearch et RAG API, fichiers .env et librechat.yaml, comptes, LDAP, OIDC, agents, MCP, port 3080) et AnythingLLM (espaces de travail documentaires, RAG intégré avec LanceDB, fournisseurs LLM et de plongement, application de bureau ou Docker port 3001, mode multi-utilisateurs, widget intégrable, API) ; sécurité et choix face à Open WebUI.
tags: [librechat, anythingllm, interface chat, llm, rag, docker, multi-utilisateurs, oidc]
icon: messages-square
---

## LibreChat

**LibreChat** (MIT) offre une interface proche de ChatGPT qui se connecte à **de nombreux fournisseurs** à la fois : modèles locaux (Ollama, vLLM, LocalAI) et services en ligne (OpenAI, Anthropic, Google, Azure OpenAI, Mistral…). Chaque utilisateur choisit son modèle dans la conversation.

| Composant | Rôle |
| --- | --- |
| API + interface | Node.js, port **3080** |
| MongoDB | Utilisateurs, conversations |
| Meilisearch | Recherche dans l'historique |
| RAG API + pgvector | Discussion avec des fichiers déposés |

```bash
git clone https://github.com/danny-avila/LibreChat.git && cd LibreChat
cp .env.example .env                      # secrets : CREDS_KEY, CREDS_IV, JWT_SECRET, JWT_REFRESH_SECRET (à générer)
cp librechat.example.yaml librechat.yaml
docker compose up -d
docker compose logs -f api
```

```yaml librechat.yaml
version: 1.2.1
cache: true
endpoints:
  custom:
    - name: "Ollama"
      apiKey: "ollama"
      baseURL: "http://ollama:11434/v1/"
      models: { default: [ "qwen2.5:7b", "llama3.1:8b" ], fetch: true }
      titleConvo: true
    - name: "vLLM interne"
      apiKey: "${VLLM_CLE}"
      baseURL: "https://llm.exemple.fr/v1"
      models: { default: [ "Qwen/Qwen2.5-32B-Instruct" ] }
```

La clé `version` doit correspondre à une version de configuration prise en charge par votre version de LibreChat (voir `librechat.example.yaml`).

- Comptes locaux, **LDAP**, **OpenID Connect** (Keycloak, Entra ID), Google, GitHub ; `ALLOW_REGISTRATION=false` dans `.env` pour fermer les inscriptions publiques.
- **Agents** avec outils, serveurs **MCP**, exécution de code, recherche web, préréglages partagés.
- Gestion des comptes : `npm run create-user`, `npm run ban-user`, `npm run list-users` (dans le conteneur `api`).

## AnythingLLM

**AnythingLLM** (MIT) organise le travail en **espaces de travail** : on y dépose des documents (PDF, Word, pages web, dépôts Git, Confluence…) puis on discute avec eux. Tout est intégré : découpage, plongements, base vectorielle (**LanceDB** par défaut), dialogue.

```bash
# Application de bureau (Windows, macOS, Linux AppImage) : usage individuel
# Serveur Docker, multi-utilisateurs
export STORAGE_LOCATION=/srv/anythingllm && mkdir -p $STORAGE_LOCATION && touch "$STORAGE_LOCATION/.env"
docker run -d --name anythingllm -p 3001:3001 --cap-add SYS_ADMIN \
  -v ${STORAGE_LOCATION}:/app/server/storage \
  -v ${STORAGE_LOCATION}/.env:/app/server/.env \
  -e STORAGE_DIR="/app/server/storage" \
  mintplexlabs/anythingllm
```

| Réglage | Choix |
| --- | --- |
| Fournisseur LLM | Ollama, LM Studio, LocalAI, vLLM (OpenAI générique), OpenAI, Anthropic… |
| Plongements | Intégré (CPU), Ollama, OpenAI… |
| Base vectorielle | LanceDB (intégrée), PGVector, Qdrant, Chroma, Milvus, Weaviate… |
| Mode | Utilisateur unique (mot de passe) ou **multi-utilisateurs** (rôles admin, gestionnaire, utilisateur) |

Fonctions : agents (recherche web, SQL, résumé), **widget de discussion** intégrable à un site, API REST avec clés, journal des échanges.

## Sécurité commune

- Mettre l'interface derrière un **proxy HTTPS** et l'authentification de l'entreprise ; désactiver les inscriptions ouvertes.
- Les clés des fournisseurs en ligne sont stockées sur le serveur : restreindre l'accès à l'administration.
- Les documents déposés et l'historique contiennent des données sensibles : sauvegarde, chiffrement du disque, durée de conservation définie.
- Avec un fournisseur **en ligne**, les données sortent de l'infrastructure : réserver les données confidentielles aux modèles locaux.

## Choisir

| Besoin | Outil |
| --- | --- |
| Interface simple pour Ollama, RAG, outils | [[21-outils/05-ia-productivite/04-ollama-open-webui\|Open WebUI]] |
| Nombreux fournisseurs en ligne et locaux pour une organisation | LibreChat |
| Discuter avec une base documentaire, poste ou serveur | AnythingLLM |

Voir aussi : [[02-text-generation-webui-sillytavern|text-generation-webui et SillyTavern]] · [[06-frameworks-rag/02-ragflow-quivr|RAGFlow et Quivr]]. Commandes : [[90-aide-memoire|aide-mémoire]].
