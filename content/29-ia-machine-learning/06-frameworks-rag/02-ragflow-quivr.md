---
title: RAGFlow et Quivr
description: Moteurs RAG prêts à l'emploi — RAGFlow (InfiniFlow, Apache 2.0 : compréhension profonde des documents DeepDoc, gabarits de découpage par type, vérification des morceaux, citations, agents ; Docker Compose avec Elasticsearch ou Infinity, MySQL, MinIO, Redis ; vm.max_map_count, service_conf.yaml, fournisseurs Ollama et OpenAI-compatibles, API et clés, port 80) et Quivr (bibliothèque RAG « opinionated » quivr-core, ancien « second cerveau » en application web, état du projet) ; conseils de mise en production.
tags: [ragflow, quivr, rag, deepdoc, base de connaissances, docker, elasticsearch]
icon: library
---

## RAGFlow

**RAGFlow** (Apache 2.0) met l'accent sur la **qualité d'extraction** : son module **DeepDoc** analyse la mise en page (OCR, tableaux, titres, figures) avant découpage, ce qui améliore nettement les réponses sur des PDF complexes (contrats, notices, rapports).

| Fonction | Détail |
| --- | --- |
| Gabarits de découpage | Général, Q&R, manuel, tableau, papier scientifique, juridique, présentation, livre… |
| Vérification | Visualiser et corriger chaque morceau, ajouter des mots-clés |
| Récupération | Hybride (texte intégral + vecteurs), reclassement, graphe de connaissances optionnel |
| Réponses | Citations cliquables vers le passage source |
| Agents | Éditeur de flux (recherche web, SQL, outils, MCP) |

### Installation

```bash
# Prérequis : 4 cœurs, 16 Go de RAM, 50 Go de disque ; Docker et Compose
sudo sysctl -w vm.max_map_count=262144                     # requis par Elasticsearch
echo 'vm.max_map_count=262144' | sudo tee /etc/sysctl.d/99-ragflow.conf
git clone https://github.com/infiniflow/ragflow.git && cd ragflow/docker
# Éditer .env : mots de passe (ELASTIC_PASSWORD, MYSQL_PASSWORD, MINIO_PASSWORD, REDIS_PASSWORD), image (variante avec ou sans modèles d'embedding intégrés)
docker compose -f docker-compose.yml up -d                 # docker-compose-gpu.yml pour l'accélération GPU
docker logs -f ragflow-server
# Interface : http://serveur (port 80) ; le premier compte inscrit doit être celui de l'administrateur
```

| Service | Rôle |
| --- | --- |
| `ragflow-server` | API, interface, analyse des documents |
| Elasticsearch ou **Infinity** | Index texte et vecteurs (`DOC_ENGINE` dans `.env`) |
| MySQL | Métadonnées |
| MinIO | Fichiers déposés |
| Redis | Files de tâches |

Les fournisseurs de modèles se déclarent dans l'interface (**Model providers**) : Ollama, Xinference, LocalAI, vLLM via « OpenAI-API-Compatible », ou services en ligne. Valeurs par défaut dans `docker/service_conf.yaml.template`.

```bash
curl -X POST http://serveur/api/v1/chats/<id-assistant>/completions \
  -H "Authorization: Bearer ragflow-XXXX" -H 'Content-Type: application/json' \
  -d '{"question":"Quelle est la garantie du contrat de maintenance ?","stream":false}'
```

### Exploitation

- Fermer l'inscription libre après création des comptes (`REGISTER_ENABLED=0` selon la version) et placer l'interface derrière HTTPS.
- Surveiller l'espace disque d'Elasticsearch et de MinIO ; sauvegarder MySQL, MinIO et l'index.
- L'analyse DeepDoc est gourmande : prévoir un GPU ou du temps pour les gros volumes.

## Quivr

**Quivr** (Apache 2.0) a commencé comme application web de « **second cerveau** » (déposer ses fichiers et discuter avec eux), puis s'est recentré sur **quivr-core**, une **bibliothèque Python** de RAG configurée par défaut (découpage, récupération, reclassement, génération), à intégrer dans ses propres applications.

```bash
python3 -m pip install quivr-core
```

```python
from quivr_core import Brain
cerveau = Brain.from_files(name="procedures", file_paths=["pra.pdf", "pca.docx"])
print(cerveau.ask("Quel est le délai de reprise de la messagerie ?").answer)
```

La configuration (LLM, plongements, reclassement, nombre de morceaux) se fait par fichier YAML de workflow ; par défaut, elle utilise des API en ligne : la paramétrer pour des modèles **locaux** si les documents sont confidentiels.

> [!NOTE]
> L'ancienne application web auto-hébergeable de Quivr n'est plus le produit principal du projet. Pour une interface d'équipe prête à l'emploi, préférer RAGFlow, [[03-interfaces-chat/01-librechat-anythingllm|AnythingLLM]] ou Open WebUI.

## Mettre un RAG en production

1. **Corpus maîtrisé** : sources à jour, doublons et versions obsolètes retirés, propriétaire identifié.
2. **Droits** : un utilisateur ne doit retrouver que les documents qu'il a le droit de lire (bases séparées ou filtrage par métadonnées).
3. **Évaluation** : 50 à 100 questions de référence rejouées à chaque changement de modèle ou de découpage.
4. **Traçabilité** : réponses citées, journal des questions (avec règles de conservation).
5. **Modèle local** pour les documents confidentiels.

Voir aussi : [[01-langchain-llamaindex-haystack|LangChain, LlamaIndex et Haystack]]. Commandes : [[90-aide-memoire|aide-mémoire]].
