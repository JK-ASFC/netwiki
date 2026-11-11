---
title: Whisper et synthèse vocale — aide-mémoire
description: Commandes de transcription (whisper, whisper.cpp whisper-cli et whisper-server, faster-whisper), conversion audio avec ffmpeg, synthèse vocale Piper, Coqui TTS, Kokoro et Mimic 3, ports des serveurs.
tags: [aide-mémoire, whisper, whisper.cpp, faster-whisper, piper, coqui tts, kokoro, rvc]
icon: terminal
---

Explications : [[01-whisper|Whisper, whisper.cpp et faster-whisper]] · [[02-synthese-vocale|synthèse et conversion de voix]].

| Serveur | Port |
| --- | --- |
| whisper-server (whisper.cpp) | 8080 (`/inference`) |
| Piper HTTP | 5000 |
| Wyoming Piper / Whisper (Home Assistant) | 10200 / 10300 |
| Mimic 3 | 59125 |
| RVC WebUI | 7865 |

```bash
# Préparer l'audio
ffmpeg -i entree.m4a -ar 16000 -ac 1 -c:a pcm_s16le sortie-16k.wav     # pour Whisper
ffmpeg -i entree.wav -ar 8000 -ac 1 sortie-8k.wav                       # pour la téléphonie

# Whisper
whisper fichier.m4a --model turbo --language fr --output_format srt
./build/bin/whisper-cli -m models/ggml-large-v3-turbo.bin -l fr -f fichier.wav -osrt -otxt
./build/bin/whisper-server -m models/ggml-large-v3-turbo.bin -l fr --host 127.0.0.1 --port 8080
curl 127.0.0.1:8080/inference -F file=@fichier.wav -F response_format=json
python3 -c "from faster_whisper import WhisperModel as M; s,_=M('small',device='cpu',compute_type='int8').transcribe('f.wav',language='fr',vad_filter=True); print(' '.join(x.text for x in s))"

# Synthèse vocale
python3 -m piper.download_voices fr_FR-siwis-medium
echo "Texte" | python3 -m piper -m fr_FR-siwis-medium -f sortie.wav
tts --text "Texte" --model_name tts_models/fr/css10/vits --out_path sortie.wav
docker run -it -p 59125:59125 mycroftai/mimic3
```
