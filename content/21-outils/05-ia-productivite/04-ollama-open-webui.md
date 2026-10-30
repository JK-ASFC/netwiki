---
title: Ollama et Open WebUI (IA locale)
description: Exécuter des modèles de langage en local — Ollama (installation Linux, Windows, macOS et Docker, téléchargement et quantification des modèles, GPU NVIDIA/AMD/Apple, API REST port 11434, Modelfile, variables de configuration), Open WebUI (interface web multi-utilisateurs, comptes et rôles, LDAP/OIDC, base de connaissances RAG, outils), dimensionnement matériel, sécurité (ne jamais exposer l'API), cas d'usage pour des données confidentielles.
tags: [ollama, open webui, llm, ia locale, gpu, rag, api]
icon: brain
---

**Ollama** (MIT) télécharge et exécute des **modèles de langage ouverts** (Llama, Mistral, Qwen, Gemma, DeepSeek, Phi…) sur votre machine ou votre serveur. **Open WebUI** ajoute une interface web de discussion multi-utilisateurs. Intérêt principal : les données **ne quittent pas** l'infrastructure — analyse de configurations ou de journaux confidentiels, documentation interne, assistants hors ligne.

## Matériel

| Taille du modèle (paramètres) | Mémoire (quantification 4 bits) | Matériel indicatif |
| --- | --- | --- |
| 3–4 milliards | ~3 Go | Portable récent, CPU seul (lent) |
| 7–9 milliards | ~5–6 Go | GPU 8 Go, Mac Apple Silicon 16 Go |
| 12–14 milliards | ~9–10 Go | GPU 12–16 Go |
| 27–32 milliards | ~18–20 Go | GPU 24 Go, Mac 32 Go et plus |
| 70 milliards et plus | 40 Go et plus | Plusieurs GPU ou GPU de centre de données |

La mémoire vidéo (ou unifiée sur Mac) est le facteur limitant ; sans GPU, le CPU fonctionne mais lentement.

## Ollama

```bash
# Linux : script officiel (service systemd, utilisateur ollama) — le lire avant exécution
curl -fsSL https://ollama.com/install.sh -o install-ollama.sh && less install-ollama.sh && sh install-ollama.sh
ollama pull qwen3:8b               # télécharger un modèle (catalogue sur ollama.com/library)
ollama run qwen3:8b                # discussion en console
ollama list && ollama ps           # modèles installés / chargés en mémoire
```

```powershell
winget install Ollama.Ollama       # Windows ; macOS : application ou brew install ollama
```

```bash
# Docker avec GPU NVIDIA (NVIDIA Container Toolkit)
docker run -d --gpus=all -v ollama:/root/.ollama -p 127.0.0.1:11434:11434 --name ollama ollama/ollama
```

| Variable | Rôle |
| --- | --- |
| `OLLAMA_HOST` | Adresse d'écoute (défaut `127.0.0.1:11434`) |
| `OLLAMA_MODELS` | Emplacement des modèles (volumineux) |
| `OLLAMA_KEEP_ALIVE` | Durée de maintien du modèle en mémoire |
| `OLLAMA_NUM_PARALLEL`, `OLLAMA_MAX_LOADED_MODELS` | Concurrence |

### API

```bash
curl -s http://127.0.0.1:11434/api/generate -d '{
  "model": "qwen3:8b",
  "prompt": "Explique en 5 lignes ce que fait la commande Cisco ip helper-address.",
  "stream": false
}' | jq -r .response
```

Une API compatible OpenAI est aussi exposée (`/v1/chat/completions`) : de nombreux outils (éditeurs, scripts, [[06-n8n|n8n]]) peuvent utiliser Ollama comme fournisseur.

### Modelfile

```text Modelfile
FROM qwen3:8b
PARAMETER temperature 0.2
SYSTEM "Tu es un assistant d'administration réseau. Réponds en français, de façon concise, en signalant toujours les risques et les commandes de vérification."
```

```bash
ollama create assistant-reseau -f Modelfile && ollama run assistant-reseau
```

## Open WebUI

```yaml compose.yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main      # épingler une version en production
    ports: ["127.0.0.1:3000:8080"]
    environment:
      OLLAMA_BASE_URL: http://host.docker.internal:11434
      WEBUI_URL: https://ia.corp.exemple.fr
      ENABLE_SIGNUP: "false"
    extra_hosts: ["host.docker.internal:host-gateway"]
    volumes: ["open-webui:/app/backend/data"]
    restart: unless-stopped
volumes:
  open-webui:
```

Le premier compte créé devient **administrateur** ; ensuite : inscription désactivée ou soumise à approbation, authentification **LDAP** ou **OIDC** (Keycloak, Entra ID), groupes et droits par modèle. Fonctions : historique, partage de discussions, **bases de connaissances** (RAG : documents internes indexés et cités dans les réponses), outils et fonctions, plusieurs fournisseurs (Ollama, API compatibles OpenAI).

## Sécurité

> [!WARNING]
> L'API d'Ollama n'a **aucune authentification** : un port 11434 exposé permet à n'importe qui d'utiliser vos GPU, de télécharger ou supprimer des modèles. Des milliers d'instances exposées sur Internet ont été recensées. Gardez `127.0.0.1` ou filtrez strictement, et placez un reverse proxy authentifié devant toute interface publiée.

- [ ] Open WebUI derrière HTTPS, SSO, inscription fermée ; mises à jour fréquentes (projet très actif)
- [ ] Modèles depuis des sources reconnues ; attention aux licences d'usage des modèles
- [ ] Documents des bases de connaissances soumis aux mêmes droits que leur source
- [ ] Les réponses restent à **vérifier** comme pour tout modèle ([[01-chatgpt|bonnes pratiques]])
