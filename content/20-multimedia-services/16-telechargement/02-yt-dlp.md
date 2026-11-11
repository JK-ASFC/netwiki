---
title: yt-dlp
description: yt-dlp, téléchargeur de vidéos et d'audio des sites de partage (Unlicense) — installation et mises à jour, choix des formats (-F, -f, -S), fusion avec FFmpeg, extraction audio, sous-titres et chapitres, listes de lecture, modèles de nommage, archive pour ne pas retélécharger, fichier de configuration, cookies, limites de débit, aria2 comme téléchargeur, et cadre légal.
tags: [yt-dlp, youtube-dl, téléchargement, vidéo, audio, ffmpeg, sous-titres, playlist]
icon: download
---

**yt-dlp** (successeur actif de youtube-dl) récupère vidéos et audio depuis des **centaines de sites** (YouTube, PeerTube, Vimeo, sites d'information, podcasts…). Usages légitimes : archiver ses propres contenus ou ceux de son organisation, conserver une conférence publiée sous licence libre, travailler hors ligne sur un contenu dont on a les droits.

> [!IMPORTANT]
> Respectez les **conditions d'utilisation** des sites et le **droit d'auteur** : ne téléchargez que des contenus que vous êtes autorisé à copier.

## Installation et mise à jour

```bash
python3 -m pip install -U "yt-dlp[default]"       # ou pipx install yt-dlp
brew install yt-dlp ; winget install yt-dlp.yt-dlp
sudo apt install ffmpeg                            # nécessaire pour fusionner audio et vidéo
yt-dlp -U                                          # mise à jour (binaire autonome)
```

Les sites changent souvent : une version **à jour** règle la plupart des erreurs (les paquets des distributions sont fréquemment trop anciens).

## Formats

```bash
yt-dlp -F "URL"                                   # lister les formats disponibles
yt-dlp "URL"                                      # meilleure qualité, audio et vidéo fusionnés
yt-dlp -f "bv*[height<=1080]+ba/b[height<=1080]" "URL"     # au plus 1080p
yt-dlp -S "res:1080,vcodec:h264,acodec:m4a" --merge-output-format mp4 "URL"   # préférer H.264 + AAC en MP4
yt-dlp -x --audio-format mp3 --audio-quality 0 "URL"        # extraire l'audio en MP3
```

| Option | Rôle |
| --- | --- |
| `-f` | Sélection explicite (`bv` meilleure vidéo, `ba` meilleur audio, `b` meilleur combiné) |
| `-S` | Tri des formats par critères (résolution, codec, taille) |
| `-x`, `--audio-format` | Extraire l'audio |
| `--merge-output-format mp4` / `--remux-video mkv` | Conteneur final |

## Sous-titres, chapitres, métadonnées

```bash
yt-dlp --list-subs "URL"
yt-dlp --write-subs --write-auto-subs --sub-langs "fr,en" --embed-subs "URL"
yt-dlp --embed-chapters --embed-metadata --embed-thumbnail "URL"
yt-dlp --split-chapters "URL"                     # un fichier par chapitre
```

## Listes de lecture et chaînes

```bash
yt-dlp -o "%(playlist)s/%(playlist_index)03d - %(title)s.%(ext)s" "URL_PLAYLIST"
yt-dlp --download-archive archive.txt "URL_CHAINE"        # ne retélécharger que les nouveautés
yt-dlp --playlist-items 1-10 "URL_PLAYLIST"
yt-dlp --dateafter 20260101 "URL_CHAINE"
```

## Fichier de configuration

```text ~/.config/yt-dlp/config
-o ~/Videos/%(uploader)s/%(upload_date>%Y-%m-%d)s - %(title)s [%(id)s].%(ext)s
-S res:1080,vcodec:h264
--embed-metadata
--embed-subs
--sub-langs fr,en
--download-archive ~/Videos/archive.txt
--limit-rate 10M
--concurrent-fragments 4
```

## Autres options utiles

```bash
yt-dlp --cookies-from-browser firefox "URL"       # contenus nécessitant une connexion (vos propres accès)
yt-dlp --downloader aria2c --downloader-args "aria2c:-x 8 -s 8" "URL"
yt-dlp --simulate --print "%(title)s | %(duration_string)s" "URL"   # informations sans télécharger
yt-dlp -j "URL" | jq '{title, uploader, duration}'                  # métadonnées JSON
```

Voir aussi : [[01-aria2|aria2]] · [[12-traitement-video/01-ffmpeg|FFmpeg]] · [[13-capture-lecture/02-vlc-mpv|mpv]] (lecture directe via yt-dlp). Commandes : [[90-aide-memoire|aide-mémoire]].
