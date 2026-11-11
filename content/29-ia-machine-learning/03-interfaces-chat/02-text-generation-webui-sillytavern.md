---
title: text-generation-webui et SillyTavern
description: text-generation-webui (« oobabooga », AGPL : interface Gradio pour charger et tester des modèles avec plusieurs moteurs — llama.cpp, Transformers, ExLlamaV2/V3 — scripts d'installation portables, onglets Chat, Notebook, Model, Parameters, extensions, API compatible OpenAI, port 7860 et 5000, options --listen et --api) et SillyTavern (interface Node.js de dialogue et de personnages, connexion à KoboldCpp, llama.cpp, Ollama, text-generation-webui ou API en ligne, port 8000, liste blanche d'adresses, comptes, config.yaml) ; usages et précautions.
tags: [text-generation-webui, oobabooga, sillytavern, llm, interface, gradio, jeu de rôle]
icon: messages-square
---

## text-generation-webui

**text-generation-webui** (souvent appelée « oobabooga », du nom de son auteur) est un **banc d'essai** pour les LLM : charger un modèle, choisir le moteur, régler finement les paramètres d'échantillonnage, comparer. C'est un outil d'expérimentation plutôt qu'une interface d'entreprise.

| Moteur (*loader*) | Formats |
| --- | --- |
| llama.cpp | GGUF (CPU et GPU) |
| Transformers | Modèles Hugging Face complets ou quantifiés bitsandbytes |
| ExLlamaV2 / V3 | EXL2 / EXL3 (GPU NVIDIA, très rapide) |

```bash
git clone https://github.com/oobabooga/text-generation-webui && cd text-generation-webui
./start_linux.sh                 # start_windows.bat, start_macos.sh : installe un environnement isolé au premier lancement
# Des versions « portables » (llama.cpp seul, sans installation) sont aussi publiées

./start_linux.sh --listen --api --model qwen-7b-instruct-Q4_K_M.gguf
```

| Port | Usage |
| --- | --- |
| 7860 | Interface Gradio |
| 5000 | API compatible OpenAI (`--api`) |

- Les modèles se placent dans `user_data/models/` (ou se téléchargent depuis l'onglet **Model**).
- Onglets : **Chat** (personnages, modes instruction), **Notebook** (texte libre), **Parameters** (température, top-p, min-p, répétition…).
- Extensions : synthèse vocale, transcription, recherche, multimodal.
- Options utiles dans `user_data/CMD_FLAGS.txt` pour les rendre permanentes.

> [!WARNING]
> `--listen` expose l'interface sur le réseau **sans authentification** : ajouter `--gradio-auth utilisateur:motdepasse` ou un proxy authentifié, et ne jamais l'exposer sur Internet. L'onglet Model permet de télécharger et d'exécuter du contenu arbitraire.

## SillyTavern

**SillyTavern** (AGPL) est une interface Node.js orientée **dialogue avec des personnages** (cartes de personnages, mondes, groupes), très utilisée pour l'écriture interactive. Elle ne contient **aucun modèle** : elle se connecte à un moteur.

| Moteur pris en charge | Exemples |
| --- | --- |
| Local | KoboldCpp, llama.cpp server, Ollama, text-generation-webui, TabbyAPI, vLLM |
| En ligne | OpenAI, Anthropic, Google, Mistral, OpenRouter… |

```bash
git clone https://github.com/SillyTavern/SillyTavern -b release && cd SillyTavern
./start.sh                       # Start.bat sous Windows ; Node.js requis
# Docker : image ghcr.io/sillytavern/sillytavern, port 8000
```

```yaml config.yaml
listen: false                    # true pour écouter sur le réseau
port: 8000
whitelistMode: true              # n'accepte que les adresses listées
whitelist: [ "127.0.0.1", "192.168.10.0/24" ]
basicAuthMode: false
enableUserAccounts: true         # comptes séparés avec mots de passe
```

Par défaut, SillyTavern n'accepte que les connexions **locales** ; ouvrir l'accès réseau uniquement avec liste blanche et comptes utilisateurs ou authentification.

## À qui s'adressent-ils ?

| Outil | Public |
| --- | --- |
| text-generation-webui | Expérimentateurs : tester des modèles, des formats et des réglages |
| SillyTavern | Écriture créative, jeux de rôle, personnages |
| [[01-librechat-anythingllm\|LibreChat, AnythingLLM]] ou Open WebUI | Usage professionnel multi-utilisateurs |

Commandes : [[90-aide-memoire|aide-mémoire]].
