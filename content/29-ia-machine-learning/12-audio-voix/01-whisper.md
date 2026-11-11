---
title: Whisper, whisper.cpp et faster-whisper
description: Transcription automatique de la parole en local — modèle Whisper d'OpenAI (MIT : tailles tiny à large-v3 et turbo, multilingue, traduction vers l'anglais, CLI whisper, formats txt, srt, vtt), whisper.cpp (C/C++ : modèles ggml, quantification, CUDA, Vulkan, Metal, whisper-cli, whisper-server, transcription en direct), faster-whisper (CTranslate2 : 4 fois plus rapide, INT8, filtre VAD, horodatage par mot) ; matériel, qualité en français, cas d'usage (réunions, messagerie vocale, appels) et RGPD.
tags: [whisper, whisper.cpp, faster-whisper, transcription, reconnaissance vocale, stt, sous-titres, audio]
icon: audio-lines
---

**Whisper** est un modèle de **reconnaissance vocale** publié par OpenAI sous licence MIT, entraîné sur 680 000 heures d'audio multilingue. Il transcrit le français avec une très bonne qualité, ajoute la ponctuation et peut **traduire** vers l'anglais. Trois façons de l'exécuter localement : l'implémentation d'origine, **whisper.cpp** et **faster-whisper**.

## Modèles

| Modèle | Paramètres | Mémoire (env.) | Usage |
| --- | --- | --- | --- |
| `tiny`, `base` | 39–74 M | ~1 Go | Tests, appareils modestes (qualité limitée en français) |
| `small` | 244 M | ~2 Go | Bon compromis sur CPU |
| `medium` | 769 M | ~5 Go | Bonne qualité |
| `large-v3` | 1,55 G | ~10 Go | Meilleure qualité |
| `large-v3-turbo` (`turbo`) | 809 M | ~6 Go | Presque la qualité de large, bien plus rapide (pas de traduction) |

## Whisper (implémentation d'origine)

```bash
sudo apt install ffmpeg
python3 -m pip install -U openai-whisper
whisper reunion.m4a --model turbo --language fr --output_format srt --output_dir sorties/
whisper message.wav --model medium --language fr --task translate      # traduction vers l'anglais
```

```python
import whisper
modele = whisper.load_model("turbo")
resultat = modele.transcribe("reunion.m4a", language="fr")
for s in resultat["segments"]:
    print(f"[{s['start']:.1f}–{s['end']:.1f}] {s['text']}")
```

## whisper.cpp

Portage C/C++ par l'auteur de llama.cpp : aucune dépendance Python, très efficace sur CPU, GPU (CUDA, Vulkan), Apple Silicon (Metal, Core ML) et même Raspberry Pi.

```bash
git clone https://github.com/ggml-org/whisper.cpp && cd whisper.cpp
sh ./models/download-ggml-model.sh large-v3-turbo          # modèles ggml (quantifiés possibles : …-q5_0)
cmake -B build -DGGML_CUDA=ON && cmake --build build -j --config Release

ffmpeg -i reunion.m4a -ar 16000 -ac 1 -c:a pcm_s16le reunion.wav     # 16 kHz mono requis
./build/bin/whisper-cli -m models/ggml-large-v3-turbo.bin -l fr -f reunion.wav -osrt -otxt
./build/bin/whisper-server -m models/ggml-large-v3-turbo.bin -l fr --host 127.0.0.1 --port 8080
curl 127.0.0.1:8080/inference -F file=@reunion.wav -F response_format=json
./build/bin/whisper-stream -m models/ggml-small.bin -l fr     # transcription en direct depuis le micro (SDL2)
```

## faster-whisper

Réimplémentation sur **CTranslate2** : jusqu'à 4 fois plus rapide que l'original pour la même qualité, moins de mémoire, quantification **INT8** sur CPU ou GPU. C'est le moteur de nombreux outils (WhisperX, Speaches, Home Assistant via Wyoming).

```bash
python3 -m pip install faster-whisper
```

```python
from faster_whisper import WhisperModel

modele = WhisperModel("large-v3-turbo", device="cuda", compute_type="float16")   # CPU : device="cpu", compute_type="int8"
segments, info = modele.transcribe("appel.wav", language="fr", vad_filter=True, word_timestamps=True)
print(info.language, info.duration)
for s in segments:
    print(f"[{s.start:.1f}s] {s.text}")
```

Le filtre **VAD** (détection d'activité vocale) supprime les silences et réduit les « hallucinations » (texte inventé sur du bruit ou de la musique).

## Cas d'usage

| Cas | Conseil |
| --- | --- |
| Comptes rendus de réunion | Transcrire puis résumer avec un LLM local ; ajouter la **diarisation** (qui parle) avec pyannote ou WhisperX |
| Messagerie vocale (Asterisk, FreePBX) | Transcription du fichier WAV et envoi par courriel |
| Sous-titres de vidéos internes | Export SRT/VTT, relecture humaine |
| Assistant vocal domotique | Protocole Wyoming (Home Assistant) avec faster-whisper |

## Confidentialité

Les enregistrements de voix sont des **données personnelles** (et la voix peut être biométrique). Informer les participants, obtenir les accords nécessaires, conserver les audios le moins longtemps possible : l'intérêt d'une transcription **locale** est justement que l'audio ne quitte pas l'infrastructure.

Voir aussi : [[02-synthese-vocale|synthèse et conversion de voix]]. Commandes : [[90-aide-memoire|aide-mémoire]].
