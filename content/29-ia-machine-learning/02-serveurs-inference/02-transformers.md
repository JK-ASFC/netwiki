---
title: Hugging Face Transformers
description: La bibliothèque Transformers (Apache 2.0) — Hub de modèles, pipelines prêts à l'emploi (texte, classification, traduction, résumé, vision, audio), AutoTokenizer et AutoModelForCausalLM, gabarits de dialogue, GPU et device_map, quantification bitsandbytes, cache des modèles (HF_HOME), mode hors ligne, hf CLI (download, auth), ajustement fin avec Trainer et PEFT/LoRA, sécurité (safetensors, trust_remote_code).
tags: [transformers, hugging face, pytorch, llm, nlp, peft, lora, python]
icon: server
---

**Transformers** est la bibliothèque Python de référence pour utiliser les modèles publiés sur le **Hub Hugging Face** : langage, vision, audio, multimodal. Elle s'appuie principalement sur **PyTorch**. C'est l'outil des développeurs et data scientists ; pour servir un modèle à des utilisateurs, on passe ensuite par [[01-vllm-tgi|vLLM ou TGI]].

## Installation

```bash
python3 -m venv ~/.venvs/hf && . ~/.venvs/hf/bin/activate
python3 -m pip install torch transformers accelerate     # PyTorch : choisir la variante CUDA/ROCm sur pytorch.org
python3 -m pip install "huggingface_hub[cli]"
hf auth login                                           # jeton pour les modèles à accès restreint
hf download Qwen/Qwen2.5-0.5B-Instruct                  # téléchargement dans le cache
```

| Variable | Rôle |
| --- | --- |
| `HF_HOME` | Racine du cache (par défaut `~/.cache/huggingface`) — prévoir de l'espace disque |
| `HF_HUB_OFFLINE=1` | Mode hors ligne : n'utilise que le cache |
| `HF_TOKEN` | Jeton d'accès (CI, serveurs) |
| `HF_ENDPOINT` | Miroir interne du Hub |

## Pipelines

```python
from transformers import pipeline

resume = pipeline("summarization", model="facebook/bart-large-cnn")
print(resume(open("rapport.txt").read(), max_length=120)[0]["summary_text"])

classif = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print(classif("Le lien WAN de Lyon est tombé à 3 h", candidate_labels=["incident réseau", "facturation", "demande d'accès"]))

traduction = pipeline("translation", model="Helsinki-NLP/opus-mt-en-fr")
print(traduction("The switch port is in err-disabled state.")[0]["translation_text"])
```

D'autres tâches : `text-generation`, `ner`, `sentiment-analysis`, `automatic-speech-recognition`, `image-classification`, `object-detection`…

## Modèle de dialogue

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

nom = "Qwen/Qwen2.5-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(nom)
modele = AutoModelForCausalLM.from_pretrained(nom, torch_dtype="auto", device_map="auto")

messages = [{"role": "system", "content": "Tu es un assistant réseau concis."},
            {"role": "user", "content": "Différence entre VLAN natif et VLAN de gestion ?"}]
entree = tok.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt").to(modele.device)
sortie = modele.generate(entree, max_new_tokens=200, do_sample=False)
print(tok.decode(sortie[0][entree.shape[-1]:], skip_special_tokens=True))
```

- `device_map="auto"` répartit le modèle sur les GPU disponibles (puis CPU) grâce à **Accelerate**.
- Quantification au chargement : `BitsAndBytesConfig(load_in_4bit=True)` (paquet `bitsandbytes`, GPU NVIDIA).

## Ajustement fin (LoRA)

Plutôt que de réentraîner tout le modèle, **PEFT/LoRA** n'entraîne que de petites matrices additionnelles : quelques heures sur un seul GPU suffisent pour adapter un modèle de 7 B à un style ou un domaine.

```python
from peft import LoraConfig, get_peft_model
config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"], task_type="CAUSAL_LM")
modele = get_peft_model(modele, config)
modele.print_trainable_parameters()
# entraînement : transformers.Trainer ou TRL (SFTTrainer), puis modele.save_pretrained("adaptateur")
```

## Sécurité

- Préférer les poids au format **safetensors** : les anciens fichiers `pytorch_model.bin` (pickle) peuvent exécuter du code au chargement.
- `trust_remote_code=True` exécute le code Python fourni par le dépôt du modèle : ne l'activer que pour des sources vérifiées.
- Vérifier la **licence** de chaque modèle (Apache 2.0, MIT, licences communautaires restrictives) avant un usage professionnel.

Voir aussi : [[01-vllm-tgi|vLLM et TGI]] · [[08-frameworks-ml/01-pytorch-tensorflow-jax|PyTorch]]. Commandes : [[90-aide-memoire|aide-mémoire]].
