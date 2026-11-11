---
title: HandBrake
description: HandBrake, transcodeur vidéo graphique et en ligne de commande (GPL) — installation sur Windows, macOS et Linux, préréglages (Fast 1080p30, H.265 MKV, appareils), qualité constante, pistes audio et sous-titres, filtres, encodage matériel (NVENC, Quick Sync, VCN, VideoToolbox), file d'attente, HandBrakeCLI pour les scripts, préréglages personnalisés en JSON, et limites (DVD et Blu-ray protégés).
tags: [handbrake, handbrakecli, transcodage, vidéo, h265, av1, préréglages]
icon: film
---

**HandBrake** convertit des vidéos avec une **interface graphique** claire et des **préréglages** bien choisis ; il repose sur FFmpeg et sur les encodeurs x264, x265 et SVT-AV1. **HandBrakeCLI** offre les mêmes fonctions en ligne de commande pour les scripts et les serveurs.

```powershell
winget install HandBrake.HandBrake
```

```bash
brew install --cask handbrake ; brew install handbrake           # interface / CLI
flatpak install flathub fr.handbrake.ghb                          # Linux, version à jour
sudo apt install handbrake handbrake-cli                          # version des dépôts
```

## Utilisation

1. **Ouvrir la source** : fichier, dossier (traitement en lot), ou disque non protégé.
2. **Choisir un préréglage** : *General → Fast 1080p30* (polyvalent), *Matroska → H.265 MKV 1080p30*, *Devices* (téléphones, consoles), *Web* (YouTube, Discord).
3. **Vidéo** : encodeur, **qualité constante** (RF 20-22 en H.264, 24-26 en H.265), fréquence d'images identique à la source.
4. **Audio** : pistes et langues à garder (*Sélection automatique* par langue), passthrough AC3/DTS ou réencodage AAC/Opus.
5. **Sous-titres** : pistes à garder, sous-titres forcés, incrustation ou piste séparée.
6. **Filtres** : désentrelacement (sources TV), débruitage, recadrage automatique.
7. **Ajouter à la file d'attente**, puis lancer.

Les préréglages modifiés s'enregistrent comme **préréglages personnalisés** et s'exportent en JSON pour être partagés.

## Encodage matériel

*Vidéo → Encodeur* : **NVENC** (NVIDIA), **QSV** (Intel), **VCN** (AMD), **VideoToolbox** (Mac). Beaucoup plus rapide, pour une taille un peu supérieure à qualité égale : idéal pour un grand nombre de fichiers ou une machine modeste.

## HandBrakeCLI

```bash
HandBrakeCLI --preset-list                                             # préréglages disponibles
HandBrakeCLI -i film.mkv -o film.mp4 --preset "Fast 1080p30"
HandBrakeCLI -i film.mkv -o film.mkv -e x265 -q 24 --encoder-preset medium \
  --all-audio --aencoder copy:ac3,copy:eac3,av_aac --all-subtitles
HandBrakeCLI -i film.mkv -o film.mp4 --preset-import-file mes-presets.json --preset "Archivage maison"
HandBrakeCLI --scan -i source.mkv                                       # pistes et titres de la source

# Traitement d'un dossier
for f in /srv/a-convertir/*.mkv; do
  HandBrakeCLI -i "$f" -o "/srv/convertis/$(basename "${f%.*}").mp4" --preset "Fast 1080p30" < /dev/null
done
```

## Limites

- HandBrake **ne contourne pas les protections** des DVD et Blu-ray du commerce.
- Pour transcoder automatiquement toute une médiathèque, utiliser plutôt [[14-packaging-transcodage-auto/02-tdarr-unmanic-fileflows|Tdarr, Unmanic ou FileFlows]] (qui peuvent d'ailleurs utiliser HandBrakeCLI).

Voir aussi : [[01-ffmpeg|FFmpeg]] · [[02-gstreamer|GStreamer]]. Commandes : [[90-aide-memoire|aide-mémoire]].
