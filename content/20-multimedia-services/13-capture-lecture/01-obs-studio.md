---
title: OBS Studio
description: OBS Studio pour enregistrer et diffuser (GPL) — installation, scènes et sources (écran, fenêtre, caméra, capture, navigateur, média), audio et filtres, réglages de sortie (encodeur matériel, débit CBR, images clés, résolution), diffusion vers YouTube, Twitch, Owncast, PeerTube ou un serveur RTMP, SRT et WHIP, enregistrement, caméra virtuelle, contrôle à distance par WebSocket, profils et collections de scènes, dépannage des images perdues.
tags: [obs studio, streaming, enregistrement, rtmp, srt, whip, nvenc, websocket, visioconférence]
icon: monitor-play
---

**OBS Studio** est le logiciel libre de référence pour **enregistrer** une démonstration ou une formation et **diffuser en direct** : il compose des **scènes** à partir de **sources** (écran, caméra, images, pages web, vidéos) et encode le résultat.

```powershell
winget install OBSProject.OBSStudio
```

```bash
flatpak install flathub com.obsproject.Studio      # Linux, version recommandée par le projet
sudo add-apt-repository ppa:obsproject/obs-studio && sudo apt install obs-studio   # Ubuntu
brew install --cask obs
```

Au premier lancement, l'**assistant de configuration automatique** propose des réglages adaptés à la machine et à la connexion.

## Scènes et sources

| Source | Usage |
| --- | --- |
| Capture d'écran / de fenêtre | Démonstration, formation (sous Wayland : *Capture d'écran (PipeWire)*) |
| Périphérique de capture vidéo | Webcam, carte d'acquisition HDMI |
| Source navigateur | Bandeaux, chat, compteurs, pages web |
| Source média | Vidéo ou boucle d'attente |
| Image, texte | Logo, titre, bandeau |
| Capture audio d'entrée / de sortie | Micro, son du système |

Une **scène** par situation : « Démarrage », « Caméra plein écran », « Présentation + caméra », « Pause ». Le **mode Studio** prépare une scène avant de l'envoyer à l'antenne.

## Audio

Sur chaque piste audio, ajouter des **filtres** : *Suppression du bruit* (RNNoise), *Porte de bruit*, *Compresseur*, *Limiteur*. Viser des crêtes autour de -10 dB dans le mixeur, jamais dans le rouge.

## Réglages de sortie

*Paramètres → Sortie* (mode avancé) :

| Réglage | Diffusion 1080p30 | Diffusion 720p30 |
| --- | --- | --- |
| Encodeur | Matériel : NVENC, Quick Sync, AMF ; sinon x264 *veryfast* | Idem |
| Contrôle du débit | **CBR** | CBR |
| Débit vidéo | 4 500 à 6 000 kbit/s | 2 500 à 4 000 kbit/s |
| Intervalle d'images clés | **2 s** | 2 s |
| Audio | AAC 160 kbit/s | AAC 128 kbit/s |

*Paramètres → Vidéo* : résolution de base (écran) et résolution de sortie (mise à l'échelle), 30 ou 60 images par seconde.

Pour l'**enregistrement**, utiliser un débit plus élevé ou une qualité constante (CQP/CRF) et le format **MKV** (récupérable en cas de plantage), puis *Fichier → Remuxer des enregistrements* en MP4.

## Diffusion

*Paramètres → Stream* :

| Destination | Réglage |
| --- | --- |
| YouTube, Twitch… | Service prédéfini, connexion au compte ou clé de stream |
| Owncast, PeerTube, SRS, MediaMTX | *Personnalisé* : `rtmp://serveur/live` (ou l'URL fournie) + clé |
| **SRT** | Serveur `srt://serveur:port?streamid=…` (via le service personnalisé) |
| **WHIP** (WebRTC) | Service *WHIP* : URL WHIP du serveur et jeton |

Pour diffuser vers plusieurs plates-formes à la fois sans multiplier le débit montant, passer par [[10-serveurs-streaming/06-restreamer|Restreamer]].

## Autres fonctions

- **Caméra virtuelle** : utiliser la sortie d'OBS comme webcam dans Teams, Zoom ou Jitsi.
- **Contrôle à distance** : serveur **WebSocket** intégré (*Outils → Paramètres du serveur WebSocket*, port 4455, mot de passe) pour une télécommande, un Stream Deck ou un script.
- **Profils** (réglages de sortie) et **collections de scènes** : s'exportent pour être réutilisés sur un autre poste.

## Dépannage

| Message dans la barre d'état | Cause | Correction |
| --- | --- | --- |
| Images perdues (réseau) | Débit montant insuffisant | Baisser le débit, câble plutôt que Wi-Fi |
| Images ignorées (encodage) | Processeur saturé | Encodeur matériel, preset plus rapide, résolution plus basse |
| Images manquées (rendu) | Carte graphique saturée | Limiter les jeux et effets, baisser la résolution de base |

*Aide → Fichiers journaux* : le journal complet, à analyser ou à joindre à une demande d'aide.

Voir aussi : [[02-vlc-mpv|VLC et mpv]] · [[10-serveurs-streaming/01-protocoles-comparatif|protocoles de streaming]]. Commandes : [[90-aide-memoire|aide-mémoire]].
