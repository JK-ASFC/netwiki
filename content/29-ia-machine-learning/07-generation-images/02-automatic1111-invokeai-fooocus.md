---
title: AUTOMATIC1111, InvokeAI et Fooocus
description: Trois interfaces de génération d'images — Stable Diffusion WebUI d'AUTOMATIC1111 (AGPL : webui.sh, webui-user, arguments --xformers, --medvram, --api, --listen, extensions, API /sdapi/v1/txt2img, port 7860, variante Forge), InvokeAI (Apache 2.0 : lanceur, toile unifiée, gestionnaire de modèles, workflows, invokeai.yaml, port 9090, multi-utilisateurs limité) et Fooocus (GPL : simplicité façon Midjourney, SDXL, styles, run.bat, entry_with_update.py, état du projet) ; comparatif avec ComfyUI.
tags: [automatic1111, stable diffusion webui, forge, invokeai, fooocus, génération d'images, sdxl]
icon: image
---

## Stable Diffusion WebUI (AUTOMATIC1111)

L'interface historique, la plus documentée : onglets **txt2img**, **img2img**, inpainting, agrandissement, des milliers d'**extensions** (ControlNet, ADetailer…).

```bash
# Linux (Python 3.10 conseillé)
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui && cd stable-diffusion-webui
./webui.sh --listen --api --xformers
# Windows : webui-user.bat (définir COMMANDLINE_ARGS=--xformers --api) puis lancer
```

| Argument | Effet |
| --- | --- |
| `--xformers` / `--opt-sdp-attention` | Attention optimisée (mémoire, vitesse) |
| `--medvram`, `--lowvram` | Pour les GPU de 4–8 Go |
| `--api` | Active l'API REST |
| `--listen`, `--port 7860` | Écoute réseau |
| `--gradio-auth utilisateur:mdp` | Authentification basique |
| `--api-auth utilisateur:mdp` | Protège l'API |

```bash
curl -s -X POST http://127.0.0.1:7860/sdapi/v1/txt2img -H 'Content-Type: application/json' \
  -d '{"prompt":"schéma isométrique d une salle serveur, style illustration","steps":25,"width":1024,"height":768}' \
  | jq -r '.images[0]' | base64 -d > salle.png
```

Les modèles vont dans `models/Stable-diffusion/`, les LoRA dans `models/Lora/`. Le développement de l'original a ralenti ; **Forge** (fork compatible) est plus rapide, gère mieux la mémoire et prend en charge Flux.

## InvokeAI

**InvokeAI** (Apache 2.0) vise un usage **professionnel et créatif** : une **toile unifiée** (génération, retouche, extension, calques), un gestionnaire de modèles et un éditeur de workflows par nœuds.

```bash
# Lanceur (Windows, macOS, Linux) : télécharger « Invoke Community Edition » sur le site du projet
# Docker
docker run -d --name invokeai --gpus all -p 9090:9090 -v /srv/invokeai:/invokeai ghcr.io/invoke-ai/invokeai
# Interface : http://localhost:9090
```

```yaml /srv/invokeai/invokeai.yaml
host: 0.0.0.0
port: 9090
precision: auto
device: auto
enable_partial_loading: true      # charge les modèles par morceaux sur les petits GPU
```

- Le gestionnaire de modèles installe depuis Hugging Face, une URL ou un dossier local, et détecte le type (SD 1.5, SDXL, Flux, LoRA, ControlNet).
- L'édition communautaire est **mono-utilisateur** : la protéger par un proxy authentifié pour un usage partagé.

## Fooocus

**Fooocus** (GPL) reprend la simplicité d'un service en ligne : une invite, un bouton, de bons résultats par défaut sur **SDXL**, grâce à une réécriture automatique de l'invite et à des **styles** prédéfinis.

```bash
git clone https://github.com/lllyasviel/Fooocus && cd Fooocus
python3 -m venv fooocus_env && . fooocus_env/bin/activate
python3 -m pip install -r requirements_versions.txt
python3 entry_with_update.py --listen          # télécharge les modèles au premier lancement ; port 7865
# Windows : archive avec run.bat
```

> [!NOTE]
> Fooocus est en **maintenance limitée** (corrections uniquement) et ne prend en charge que SDXL ; pour les modèles récents, utiliser ComfyUI, Forge ou InvokeAI.

## Comparatif

| Critère | [[01-comfyui\|ComfyUI]] | AUTOMATIC1111 / Forge | InvokeAI | Fooocus |
| --- | --- | --- | --- | --- |
| Prise en main | Difficile (graphes) | Moyenne | Facile, soignée | Très facile |
| Souplesse | Maximale | Grande (extensions) | Bonne (workflows) | Faible |
| Nouveaux modèles | Très rapide | Forge : rapide | Bonne | SDXL seulement |
| Automatisation (API) | Oui | Oui | Oui | Limitée |
| Port | 8188 | 7860 | 9090 | 7865 |

Les mêmes règles s'appliquent à tous : modèles **safetensors** de sources fiables, extensions vérifiées, pas d'exposition sans authentification, respect des licences et du droit à l'image.

Commandes : [[90-aide-memoire|aide-mémoire]].
