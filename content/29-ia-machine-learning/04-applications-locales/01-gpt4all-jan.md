---
title: GPT4All et Jan
description: Applications de bureau pour exécuter des LLM hors ligne — GPT4All (Nomic, MIT : installateurs Windows, macOS, Linux, catalogue de modèles GGUF, LocalDocs pour interroger ses dossiers, serveur API local port 4891, SDK Python) et Jan (AGPL : application Tauri, Jan Hub, moteur llama.cpp, serveur local compatible OpenAI port 1337, extensions, fournisseurs distants, dossier de données) ; matériel, confidentialité, déploiement sur un parc et comparaison avec LM Studio et Ollama.
tags: [gpt4all, jan, llm local, application de bureau, hors ligne, rag, api openai]
icon: laptop
---

Ces applications installent en quelques clics un assistant IA **entièrement local** sur un poste Windows, macOS ou Linux, sans ligne de commande. Elles conviennent pour des utilisateurs non techniques ou pour travailler sur des documents confidentiels hors ligne.

## GPT4All

**GPT4All** (MIT, éditeur Nomic) s'appuie sur llama.cpp et fonctionne aussi sur CPU seul.

```bash
# Installateurs : gpt4all.io (Windows .exe, macOS .dmg, Linux .run) ; aussi Flathub
flatpak install flathub io.gpt4all.gpt4all
python3 -m pip install gpt4all            # SDK Python
```

- **Catalogue** de modèles (téléchargement dans l'application) ou import de fichiers GGUF.
- **LocalDocs** : indexer des dossiers locaux (PDF, DOCX, TXT, Markdown) puis poser des questions avec citation des passages, sans envoi externe. Les plongements sont calculés localement.
- **Serveur API** local optionnel (Réglages → Enable Local API Server), compatible OpenAI, sur `http://localhost:4891/v1`.

```python
from gpt4all import GPT4All
modele = GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf")      # téléchargé au premier appel
with modele.chat_session():
    print(modele.generate("Liste trois bonnes pratiques de sauvegarde.", max_tokens=200))
```

> [!NOTE]
> La collecte anonyme de statistiques et le partage de conversations (« datalake ») sont proposés au premier lancement : les refuser pour un usage professionnel.

## Jan

**Jan** (AGPL) est une application de bureau moderne (Tauri) qui fonctionne **hors ligne** par défaut et peut aussi se connecter à des fournisseurs en ligne.

```bash
# Installateurs : jan.ai (Windows, macOS, Linux .deb et AppImage)
sudo apt install ./jan_*_amd64.deb
```

- **Jan Hub** : catalogue de modèles, ou import d'un GGUF / téléchargement depuis Hugging Face.
- Moteur **llama.cpp** intégré (CPU, CUDA, Vulkan, Metal), réglages par modèle (contexte, couches GPU).
- **Serveur local** compatible OpenAI (onglet Local API Server), par défaut `http://127.0.0.1:1337/v1`, avec clé d'API.
- Assistants personnalisés, outils et serveurs **MCP**, fournisseurs distants (OpenAI, Anthropic, Groq…) à ajouter avec leurs clés.
- Données (conversations, modèles) dans un **dossier de données** modifiable dans les réglages : à exclure de la synchronisation cloud si confidentiel.

## Matériel recommandé

| Poste | Modèles utilisables |
| --- | --- |
| 8 Go de RAM, sans GPU | 1–4 B (lent mais utilisable) |
| 16 Go de RAM ou GPU 8 Go | 7–8 B en Q4 |
| Mac Apple Silicon 32 Go ou GPU 16–24 Go | 14–32 B en Q4 |

## Déploiement sur un parc

- Déployer l'installateur par l'outil habituel (Intune, GPO, WAPT, winget selon disponibilité) et **précharger** un modèle validé dans le dossier des modèles.
- Fixer la politique : modèles autorisés, fournisseurs en ligne interdits ou autorisés, télémétrie désactivée.
- Pour une équipe, un serveur central ([[21-outils/05-ia-productivite/04-ollama-open-webui|Ollama + Open WebUI]] ou [[03-interfaces-chat/01-librechat-anythingllm|LibreChat]]) évite de dupliquer les modèles sur chaque poste.

## Comparatif

| Critère | GPT4All | Jan | LM Studio (propriétaire, gratuit) | Ollama |
| --- | --- | --- | --- | --- |
| Interface | Bureau | Bureau | Bureau | Ligne de commande + API |
| Documents locaux | LocalDocs | Via outils et assistants | Oui | Via une interface (Open WebUI) |
| API locale | 4891 | 1337 | 1234 | 11434 |
| Licence | MIT | AGPL | Propriétaire | MIT |

Voir aussi : [[02-privategpt-khoj|PrivateGPT et Khoj]]. Commandes : [[90-aide-memoire|aide-mémoire]].
