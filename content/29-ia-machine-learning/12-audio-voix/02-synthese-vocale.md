---
title: Synthèse et conversion de voix (Piper, Coqui TTS, Kokoro, Mimic 3, RVC)
description: Synthèse vocale locale — Piper (rapide sur CPU et Raspberry Pi, voix françaises ONNX, ligne de commande, serveur HTTP, Home Assistant), Coqui TTS (bibliothèque Python, modèles VITS et XTTS-v2 multilingue avec clonage, licence CPML non commerciale, fin de l'entreprise et fork idiap), Kokoro (82 M paramètres, poids Apache 2.0, voix françaises limitées), Mimic 3 (Mycroft, archivé) ; conversion de voix RVC (entraînement, inférence, usages et risques) ; éthique, consentement et deepfakes.
tags: [piper, coqui tts, xtts, kokoro, mimic 3, rvc, synthèse vocale, tts, conversion de voix]
icon: audio-lines
---

La **synthèse vocale** (*text-to-speech*, TTS) transforme du texte en parole. Exécutée en local, elle sert aux annonces (téléphonie, SVI, sonorisation), à l'accessibilité, aux assistants vocaux et à la lecture de documents, sans envoyer de texte à un service en ligne.

## Piper

**Piper** (MIT, issu du projet Rhasspy, désormais maintenu par l'Open Home Foundation) est **très rapide** même sur CPU modeste ou Raspberry Pi, avec des voix au format **ONNX** pour de nombreuses langues, dont plusieurs voix **françaises** (`fr_FR-siwis`, `fr_FR-upmc`, `fr_FR-tom`…) en qualités `low`, `medium` et `high`.

```bash
python3 -m pip install piper-tts
python3 -m piper.download_voices fr_FR-siwis-medium               # télécharge .onnx + .onnx.json
echo "Bienvenue au service informatique. Merci de patienter." | \
  python3 -m piper -m fr_FR-siwis-medium -f accueil.wav
python3 -m piper.http_server -m fr_FR-siwis-medium --host 127.0.0.1 --port 5000
curl -X POST -H 'Content-Type: application/json' -d '{"text":"Test de synthèse."}' -o test.wav http://127.0.0.1:5000
```

```bash
# Message d'attente pour Asterisk (8 kHz mono)
sox accueil.wav -r 8000 -c 1 accueil-8k.wav            # ou : ffmpeg -i accueil.wav -ar 8000 -ac 1 accueil-8k.wav
```

Dans **Home Assistant**, Piper s'intègre par le protocole **Wyoming** (module complémentaire ou conteneur `rhasspy/wyoming-piper`, port 10200).

## Coqui TTS

**Coqui TTS** est une bibliothèque Python regroupant de nombreux modèles (Tacotron, VITS, YourTTS, **XTTS-v2**). XTTS-v2 parle 17 langues, dont le français, avec une prosodie naturelle, et peut **cloner une voix** à partir de quelques secondes d'audio.

```bash
python3 -m pip install coqui-tts          # fork maintenu (idiap) ; le paquet « TTS » d'origine n'est plus maintenu
tts --list_models | grep fr
tts --text "Le serveur de fichiers sera redémarré à 22 heures." \
    --model_name tts_models/fr/css10/vits --out_path annonce.wav
```

```python
from TTS.api import TTS
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to("cuda")
tts.tts_to_file(text="Bonjour, ceci est un test.", speaker_wav="voix-reference-consentie.wav",
                language="fr", file_path="sortie.wav")
```

> [!NOTE]
> L'entreprise Coqui a fermé fin 2023 ; la bibliothèque vit dans le fork communautaire **coqui-tts**. Le code est sous MPL 2.0, mais les poids d'**XTTS-v2** sont sous **Coqui Public Model License** (usage **non commercial**).

## Kokoro

**Kokoro** est un modèle de synthèse léger (82 millions de paramètres) aux **poids ouverts sous Apache 2.0**, d'une qualité remarquable pour sa taille et rapide sur CPU. Le choix de voix est surtout riche en anglais ; le français est disponible avec peu de voix.

```bash
python3 -m pip install kokoro soundfile
sudo apt install espeak-ng                 # phonémisation de certaines langues
```

```python
from kokoro import KPipeline
import soundfile as sf
pipeline = KPipeline(lang_code="f")        # « f » : français
for i, (_, _, audio) in enumerate(pipeline("Sauvegarde terminée avec succès.", voice="ff_siwis")):
    sf.write(f"kokoro-{i}.wav", audio, 24000)
```

Vérifier la licence des **données et voix** associées à chaque version, et pas seulement celle du code.

## Mimic 3

**Mimic 3** (Mycroft AI, AGPL) était un moteur TTS hors ligne pour Raspberry Pi et serveurs, avec serveur HTTP (port 59125) et voix multilingues.

```bash
docker run -it -p 59125:59125 -v /srv/mimic3:/home/mimic3/.local/share/mycroft/mimic3 mycroftai/mimic3
```

> [!NOTE]
> Mycroft a cessé son activité et Mimic 3 n'est plus maintenu ; son auteur principal développe désormais **Piper**, qui le remplace.

## Conversion de voix : RVC

**RVC** (*Retrieval-based Voice Conversion*, MIT) **transforme une voix enregistrée en une autre voix** (et non du texte en parole). Un modèle s'entraîne avec 10 à 30 minutes d'enregistrements propres d'une voix cible, puis convertit n'importe quel audio en conservant l'intonation.

```bash
git clone https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI && cd Retrieval-based-Voice-Conversion-WebUI
python3 -m pip install -r requirements.txt     # PyTorch avec GPU conseillé
python3 infer-web.py --port 7865                # interface : entraînement, extraction de l'index, inférence
```

Usages légitimes : doublage de sa propre voix, voix de personnages créés, accessibilité (personnes ayant perdu la voix, avec leurs enregistrements).

## Éthique et sécurité

> [!WARNING]
> Le clonage et la conversion de voix permettent des **usurpations** (fraude au président, faux appels du support, désinformation). Ne cloner **que des voix dont la personne a donné un consentement écrit**, signaler les contenus générés (obligation de transparence du règlement européen sur l'IA pour les deepfakes), et former les équipes : une voix familière au téléphone ne prouve plus l'identité de l'appelant — utiliser un rappel sur un numéro connu ou un code convenu.

## Choisir

| Besoin | Outil |
| --- | --- |
| Annonces, SVI, domotique, CPU modeste | Piper |
| Voix la plus naturelle en français, usage non commercial | Coqui XTTS-v2 |
| Modèle léger sous licence permissive | Kokoro |
| Transformer une voix enregistrée (avec consentement) | RVC |

Voir aussi : [[01-whisper|Whisper]]. Commandes : [[90-aide-memoire|aide-mémoire]].
